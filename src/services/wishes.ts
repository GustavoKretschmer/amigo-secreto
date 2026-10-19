import { collection, doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';
import { logListenerError } from '../lib/logListenerError';

export const MAX_WISH_LENGTH = 500;
export const WISH_REQUIRED_MESSAGE = 'É obrigatório preencher o campo de sugestão de presente.';

function wishRef(uid: string) {
  return doc(db, 'wishes', uid);
}

export function watchWish(uid: string, onChange: (wishText: string) => void): Unsubscribe {
  return onSnapshot(
    wishRef(uid),
    (snapshot) => onChange(String(snapshot.data()?.text ?? '')),
    logListenerError('wish'),
  );
}

export async function saveWish(uid: string, wishText: string): Promise<void> {
  await setDoc(wishRef(uid), { text: wishText.trim(), updatedAt: serverTimestamp() });
}

export function watchFilledWishOwners(onChange: (ownerUids: Set<string>) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'wishes'),
    (snapshot) => onChange(new Set(snapshot.docs.filter((wish) => String(wish.data().text ?? '') !== '').map((wish) => wish.id))),
    logListenerError('wish-owners'),
  );
}
