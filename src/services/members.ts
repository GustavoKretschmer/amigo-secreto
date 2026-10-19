import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  type DocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, registrationDb } from '../firebase';
import { logListenerError } from '../lib/logListenerError';
import type { Member, NewMemberInput } from '../types';
import { buildMemberFields, createAccount } from './accounts';

export const membersCollection = collection(db, 'users');

export function memberRef(uid: string) {
  return doc(membersCollection, uid);
}

export function toMember(snapshot: DocumentSnapshot): Member {
  const fields = snapshot.data() ?? {};
  return {
    uid: snapshot.id,
    username: String(fields.username ?? ''),
    displayName: String(fields.displayName ?? ''),
    role: fields.role === 'admin' ? 'admin' : 'participant',
    participates: fields.participates === true,
    hasDrawn: fields.hasDrawn === true,
  };
}

export function watchMember(uid: string, onChange: (member: Member | null) => void): Unsubscribe {
  return onSnapshot(
    memberRef(uid),
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.hasPendingWrites) return;
      onChange(snapshot.exists() ? toMember(snapshot) : null);
    },
    logListenerError('member'),
  );
}

export function watchMembers(onChange: (members: Member[]) => void): Unsubscribe {
  return onSnapshot(
    query(membersCollection, orderBy('displayName')),
    (snapshot) => onChange(snapshot.docs.map(toMember)),
    logListenerError('members'),
  );
}

export async function fetchDrawParticipants(): Promise<Member[]> {
  const snapshot = await getDocs(query(membersCollection, where('participates', '==', true)));
  return snapshot.docs.map(toMember);
}

export async function registerOwnAccount(input: NewMemberInput): Promise<void> {
  const fields = buildMemberFields(input.fullName, 'participant', true);
  await createAccount(input, fields, (uid) => setDoc(doc(registrationDb, 'users', uid), fields));
}

export async function removeParticipant(uid: string): Promise<void> {
  await deleteDoc(memberRef(uid));
}
