import { doc, onSnapshot, writeBatch, type Unsubscribe } from 'firebase/firestore';
import { db, registrationDb } from '../firebase';
import { logListenerError } from '../lib/logListenerError';
import type { NewMemberInput } from '../types';
import { buildMemberFields, createAccount } from './accounts';

const adminMarkerRef = doc(db, 'meta', 'admin');

export interface FirstAdminInput extends NewMemberInput {
  participates: boolean;
}

export function watchAdminExists(onChange: (adminExists: boolean) => void): Unsubscribe {
  return onSnapshot(adminMarkerRef, (snapshot) => onChange(snapshot.exists()), logListenerError('admin-marker'));
}

export async function registerFirstAdmin(input: FirstAdminInput): Promise<void> {
  const fields = buildMemberFields(input.fullName, 'admin', input.participates);
  await createAccount(input, fields, async (uid) => {
    const batch = writeBatch(registrationDb);
    batch.set(doc(registrationDb, 'users', uid), fields);
    batch.set(doc(registrationDb, 'meta', 'admin'), { uid });
    await batch.commit();
  });
}
