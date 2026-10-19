import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, registrationAuth } from '../firebase';
import { buildDisplayName, buildUsername, usernameToEmail } from '../lib/username';
import type { Member, NewMemberInput, Role } from '../types';

export type MemberFields = Omit<Member, 'uid'>;

type ProfileWriter = (uid: string, fields: MemberFields) => Promise<void>;

export function buildMemberFields(fullName: string, role: Role, participates: boolean): MemberFields {
  return {
    username: buildUsername(fullName),
    displayName: buildDisplayName(fullName),
    role,
    participates,
    hasDrawn: false,
  };
}

export async function createAccount(input: NewMemberInput, fields: MemberFields, writeProfile: ProfileWriter): Promise<void> {
  const email = usernameToEmail(fields.username);
  const credential = await createUserWithEmailAndPassword(registrationAuth, email, input.password);
  try {
    await writeProfile(credential.user.uid, fields);
  } catch (error) {
    await deleteUser(credential.user);
    throw error;
  } finally {
    await signOut(registrationAuth);
  }
  await signInWithEmailAndPassword(auth, email, input.password);
}
