import { describe, expect, it } from 'vitest';
import { NoReceiverAvailableError, pickReceiver, type DrawCandidate } from './pickReceiver';

function candidates(...uids: string[]): DrawCandidate[] {
  return uids.map((uid) => ({ uid, hasDrawn: false }));
}

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function simulateFullDraw(uids: readonly string[]): Map<string, string> {
  const participants = candidates(...uids);
  const claimed = new Set<string>();
  const pairs = new Map<string, string>();
  for (const giver of shuffle(participants)) {
    const receiver = pickReceiver(giver.uid, participants, claimed);
    claimed.add(receiver);
    pairs.set(giver.uid, receiver);
    giver.hasDrawn = true;
  }
  return pairs;
}

describe('pickReceiver', () => {
  it('never picks the giver', () => {
    const picked = pickReceiver('ana', candidates('ana', 'bia'), new Set());
    expect(picked).toBe('bia');
  });

  it('never picks someone already claimed', () => {
    const picked = pickReceiver('ana', candidates('ana', 'bia', 'caio'), new Set(['bia']), () => 0);
    expect(picked).toBe('caio');
  });

  it('forces the last pending giver to avoid them drawing themselves', () => {
    const participants: DrawCandidate[] = [
      { uid: 'ana', hasDrawn: true },
      { uid: 'bia', hasDrawn: false },
      { uid: 'caio', hasDrawn: false },
    ];
    const picked = pickReceiver('bia', participants, new Set(['ana']), () => 0.99);
    expect(picked).toBe('caio');
  });

  it('throws when nobody is available', () => {
    expect(() => pickReceiver('ana', candidates('ana', 'bia'), new Set(['bia']))).toThrow(NoReceiverAvailableError);
  });

  it.each([3, 4, 7, 15])('completes a valid draw for %i participants in any order', (size) => {
    const uids = Array.from({ length: size }, (_, index) => `p${index}`);
    for (let round = 0; round < 500; round++) {
      const pairs = simulateFullDraw(uids);
      expect(pairs.size).toBe(size);
      expect(new Set(pairs.values()).size).toBe(size);
      pairs.forEach((receiver, giver) => expect(receiver).not.toBe(giver));
    }
  });
});
