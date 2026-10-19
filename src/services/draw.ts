import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { isPermissionDenied } from '../lib/firebaseErrors';
import { logListenerError } from '../lib/logListenerError';
import { pickReceiver } from '../lib/pickReceiver';
import type { Assignment, DrawStatus, Member } from '../types';
import { fetchDrawParticipants, memberRef } from './members';

const MAX_DRAW_ATTEMPTS = 3;
const drawSettingsRef = doc(db, 'settings', 'draw');
const assignmentsCollection = collection(db, 'assignments');
const claimsCollection = collection(db, 'claims');

export function watchDrawStatus(onChange: (status: DrawStatus) => void): Unsubscribe {
  return onSnapshot(
    drawSettingsRef,
    (snapshot) => onChange(snapshot.data()?.status === 'open' ? 'open' : 'closed'),
    logListenerError('draw-status'),
  );
}

export async function openDraw(): Promise<void> {
  await setDoc(drawSettingsRef, { status: 'open' });
}

export function watchAssignment(giverUid: string, onChange: (assignment: Assignment | null) => void): Unsubscribe {
  return onSnapshot(
    doc(assignmentsCollection, giverUid),
    (snapshot) => {
      const fields = snapshot.data();
      onChange(fields ? { receiverUid: String(fields.receiverUid), receiverName: String(fields.receiverName) } : null);
    },
    logListenerError('assignment'),
  );
}

export async function drawSecretFriend(giverUid: string): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await attemptDraw(giverUid);
    } catch (error) {
      if (attempt >= MAX_DRAW_ATTEMPTS || !isPermissionDenied(error)) throw error;
    }
  }
}

async function attemptDraw(giverUid: string): Promise<void> {
  const [participants, claimedUids] = await Promise.all([fetchDrawParticipants(), fetchClaimedUids()]);
  const receiverUid = pickReceiver(giverUid, participants, claimedUids);
  const receiver = participants.find((participant) => participant.uid === receiverUid);
  const batch = writeBatch(db);
  batch.set(doc(assignmentsCollection, giverUid), {
    receiverUid,
    receiverName: receiver?.displayName ?? '',
    drawnAt: serverTimestamp(),
  });
  batch.set(doc(claimsCollection, receiverUid), { claimedAt: serverTimestamp() });
  batch.update(memberRef(giverUid), { hasDrawn: true });
  await batch.commit();
}

async function fetchClaimedUids(): Promise<Set<string>> {
  const snapshot = await getDocs(claimsCollection);
  return new Set(snapshot.docs.map((claim) => claim.id));
}

export async function resetDraw(members: readonly Member[]): Promise<void> {
  const claimedUids = await fetchClaimedUids();
  const batch = writeBatch(db);
  members.forEach((member) => {
    batch.delete(doc(assignmentsCollection, member.uid));
    if (member.hasDrawn) batch.update(memberRef(member.uid), { hasDrawn: false });
  });
  claimedUids.forEach((uid) => batch.delete(doc(claimsCollection, uid)));
  batch.set(drawSettingsRef, { status: 'closed' });
  await batch.commit();
}
