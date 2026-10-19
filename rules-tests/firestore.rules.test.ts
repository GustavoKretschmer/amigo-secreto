import { readFileSync } from 'node:fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, writeBatch, type Firestore } from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let testEnvironment: RulesTestEnvironment;

function memberFields(username: string, role: 'admin' | 'participant') {
  return { username, displayName: username, role, participates: true, hasDrawn: false };
}

function firestoreAs(uid: string): Firestore {
  return testEnvironment.authenticatedContext(uid).firestore() as unknown as Firestore;
}

async function seed(drawStatus: 'open' | 'closed'): Promise<void> {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore() as unknown as Firestore;
    await setDoc(doc(db, 'meta/admin'), { uid: 'admin' });
    await setDoc(doc(db, 'users/admin'), memberFields('org.anizador', 'admin'));
    await setDoc(doc(db, 'users/ana'), memberFields('ana.silva', 'participant'));
    await setDoc(doc(db, 'users/bia'), memberFields('bia.souza', 'participant'));
    await setDoc(doc(db, 'settings/draw'), { status: drawStatus });
    for (const uid of ['admin', 'ana', 'bia']) await setDoc(doc(db, `wishes/${uid}`), { text: 'Um presente' });
  });
}

function drawBatch(db: Firestore, giverUid: string, receiverUid: string, receiverName: string) {
  const batch = writeBatch(db);
  batch.set(doc(db, `assignments/${giverUid}`), { receiverUid, receiverName, drawnAt: serverTimestamp() });
  batch.set(doc(db, `claims/${receiverUid}`), { claimedAt: serverTimestamp() });
  batch.update(doc(db, `users/${giverUid}`), { hasDrawn: true });
  return batch;
}

beforeAll(async () => {
  testEnvironment = await initializeTestEnvironment({
    projectId: 'demo-amigo-secreto',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
});

afterAll(async () => {
  await testEnvironment.cleanup();
});

describe('first admin setup', () => {
  it('lets the first person register as admin', async () => {
    const db = firestoreAs('founder');
    const batch = writeBatch(db);
    batch.set(doc(db, 'users/founder'), memberFields('fun.dador', 'admin'));
    batch.set(doc(db, 'meta/admin'), { uid: 'founder' });
    await assertSucceeds(batch.commit());
  });

  it('blocks a second admin once one exists', async () => {
    await seed('closed');
    const db = firestoreAs('intruder');
    const batch = writeBatch(db);
    batch.set(doc(db, 'users/intruder'), memberFields('in.truso', 'admin'));
    batch.set(doc(db, 'meta/admin'), { uid: 'intruder' });
    await assertFails(batch.commit());
  });
});

describe('participant registration', () => {
  it('allows the admin to register participants', async () => {
    await seed('closed');
    await assertSucceeds(setDoc(doc(firestoreAs('admin'), 'users/caio'), memberFields('caio.lima', 'participant')));
  });

  it('forbids participants from registering people', async () => {
    await seed('closed');
    await assertFails(setDoc(doc(firestoreAs('ana'), 'users/caio'), memberFields('caio.lima', 'participant')));
  });

  it('forbids strangers from reading the member list', async () => {
    await seed('closed');
    await assertFails(getDoc(doc(firestoreAs('stranger'), 'users/ana')));
  });
});

describe('drawing', () => {
  it('is blocked while the draw is closed', async () => {
    await seed('closed');
    await assertFails(drawBatch(firestoreAs('ana'), 'ana', 'bia', 'bia.souza').commit());
  });

  it('works when open and keeps the result private', async () => {
    await seed('open');
    await assertSucceeds(drawBatch(firestoreAs('ana'), 'ana', 'bia', 'bia.souza').commit());
    await assertSucceeds(getDoc(doc(firestoreAs('ana'), 'assignments/ana')));
    await assertFails(getDoc(doc(firestoreAs('bia'), 'assignments/ana')));
    await assertFails(getDoc(doc(firestoreAs('admin'), 'assignments/ana')));
  });

  it('rejects drawing without a gift wish', async () => {
    await seed('open');
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await deleteDoc(doc(context.firestore() as unknown as Firestore, 'wishes/ana'));
    });
    await assertFails(drawBatch(firestoreAs('ana'), 'ana', 'bia', 'bia.souza').commit());
  });

  it('rejects drawing yourself', async () => {
    await seed('open');
    await assertFails(drawBatch(firestoreAs('ana'), 'ana', 'ana', 'ana.silva').commit());
  });

  it('rejects a receiver already claimed by someone else', async () => {
    await seed('open');
    await assertSucceeds(drawBatch(firestoreAs('ana'), 'ana', 'bia', 'bia.souza').commit());
    await assertFails(drawBatch(firestoreAs('admin'), 'admin', 'bia', 'bia.souza').commit());
  });

  it('rejects drawing twice', async () => {
    await seed('open');
    await assertSucceeds(drawBatch(firestoreAs('ana'), 'ana', 'bia', 'bia.souza').commit());
    await assertFails(drawBatch(firestoreAs('ana'), 'ana', 'admin', 'org.anizador').commit());
  });

  it('rejects a forged receiver name', async () => {
    await seed('open');
    await assertFails(drawBatch(firestoreAs('ana'), 'ana', 'bia', 'Nome Falso').commit());
  });

  it('rejects drawing on behalf of someone else', async () => {
    await seed('open');
    await assertFails(drawBatch(firestoreAs('ana'), 'bia', 'admin', 'org.anizador').commit());
  });
});

describe('admin draw management', () => {
  it('lets the admin reset the draw', async () => {
    await seed('open');
    await assertSucceeds(drawBatch(firestoreAs('ana'), 'ana', 'bia', 'bia.souza').commit());
    const db = firestoreAs('admin');
    const batch = writeBatch(db);
    batch.delete(doc(db, 'assignments/ana'));
    batch.delete(doc(db, 'claims/bia'));
    batch.update(doc(db, 'users/ana'), { hasDrawn: false });
    batch.set(doc(db, 'settings/draw'), { status: 'closed' });
    await assertSucceeds(batch.commit());
  });

  it('forbids participants from opening the draw', async () => {
    await seed('closed');
    await assertFails(setDoc(doc(firestoreAs('ana'), 'settings/draw'), { status: 'open' }));
  });

  it('forbids removing participants while the draw is open', async () => {
    await seed('open');
    await assertFails(deleteDoc(doc(firestoreAs('admin'), 'users/bia')));
  });

  it('allows removing participants while the draw is closed', async () => {
    await seed('closed');
    await assertSucceeds(deleteDoc(doc(firestoreAs('admin'), 'users/bia')));
  });
});

describe('gift wishes', () => {
  function wishFields(text: string) {
    return { text, updatedAt: serverTimestamp() };
  }

  it('lets a member save their own wish', async () => {
    await seed('closed');
    await assertSucceeds(setDoc(doc(firestoreAs('ana'), 'wishes/ana'), wishFields('Um livro de receitas')));
  });

  it('forbids writing someone else wish', async () => {
    await seed('closed');
    await assertFails(setDoc(doc(firestoreAs('ana'), 'wishes/bia'), wishFields('Meias velhas')));
  });

  it('lets other members read a wish', async () => {
    await seed('closed');
    await assertSucceeds(setDoc(doc(firestoreAs('ana'), 'wishes/ana'), wishFields('Chocolate')));
    await assertSucceeds(getDoc(doc(firestoreAs('bia'), 'wishes/ana')));
  });

  it('hides wishes from strangers', async () => {
    await seed('closed');
    await assertFails(getDoc(doc(firestoreAs('stranger'), 'wishes/ana')));
  });

  it('rejects an empty wish', async () => {
    await seed('closed');
    await assertFails(setDoc(doc(firestoreAs('ana'), 'wishes/ana'), wishFields('')));
  });

  it('rejects wishes longer than 500 characters', async () => {
    await seed('closed');
    await assertFails(setDoc(doc(firestoreAs('ana'), 'wishes/ana'), wishFields('a'.repeat(501))));
  });
});
