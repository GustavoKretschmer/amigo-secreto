import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
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
import { db, registrationAuth } from '../firebase';
import { logListenerError } from '../lib/logListenerError';
import { buildDisplayName, buildUsername, usernameToEmail } from '../lib/username';
import type { Member, NewMemberInput, Role } from '../types';

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

export function buildMemberFields(input: NewMemberInput, role: Role, participates: boolean): Omit<Member, 'uid'> {
  return {
    username: buildUsername(input.firstName, input.lastName),
    displayName: buildDisplayName(input.firstName, input.lastName),
    role,
    participates,
    hasDrawn: false,
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

export async function registerParticipant(input: NewMemberInput): Promise<Member> {
  const fields = buildMemberFields(input, 'participant', true);
  const credential = await createUserWithEmailAndPassword(registrationAuth, usernameToEmail(fields.username), input.password);
  await signOut(registrationAuth);
  await setDoc(memberRef(credential.user.uid), fields);
  return { uid: credential.user.uid, ...fields };
}

export async function removeParticipant(uid: string): Promise<void> {
  await deleteDoc(memberRef(uid));
}
