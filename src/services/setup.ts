import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, onSnapshot, writeBatch, type Unsubscribe } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { logListenerError } from '../lib/logListenerError';
import { usernameToEmail } from '../lib/username';
import type { NewMemberInput } from '../types';
import { buildMemberFields, memberRef } from './members';

const adminMarkerRef = doc(db, 'meta', 'admin');

export interface FirstAdminInput extends NewMemberInput {
  participates: boolean;
}

export function watchAdminExists(onChange: (adminExists: boolean) => void): Unsubscribe {
  return onSnapshot(adminMarkerRef, (snapshot) => onChange(snapshot.exists()), logListenerError('admin-marker'));
}

export async function registerFirstAdmin(input: FirstAdminInput): Promise<void> {
  const fields = buildMemberFields(input, 'admin', input.participates);
  const credential = await createUserWithEmailAndPassword(auth, usernameToEmail(fields.username), input.password);
  const batch = writeBatch(db);
  batch.set(memberRef(credential.user.uid), fields);
  batch.set(adminMarkerRef, { uid: credential.user.uid });
  await batch.commit();
}
