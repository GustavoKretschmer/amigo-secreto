import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type Unsubscribe,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase';
import { usernameToEmail } from '../lib/username';

export function watchAuthUser(onChange: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, onChange);
}

export async function signIn(username: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, usernameToEmail(username), password);
}

export async function signOutCurrentUser(): Promise<void> {
  await signOut(auth);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('Nenhum usuário autenticado.');
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
  await updatePassword(user, newPassword);
}
