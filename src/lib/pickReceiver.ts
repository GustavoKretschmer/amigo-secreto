export interface DrawCandidate {
  uid: string;
  hasDrawn: boolean;
}

export class NoReceiverAvailableError extends Error {
  constructor() {
    super('Não há mais ninguém disponível para ser sorteado.');
    this.name = 'NoReceiverAvailableError';
  }
}

export function pickReceiver(
  giverUid: string,
  candidates: readonly DrawCandidate[],
  claimedUids: ReadonlySet<string>,
  random: () => number = Math.random,
): string {
  const availableUids = candidates
    .map((candidate) => candidate.uid)
    .filter((uid) => uid !== giverUid && !claimedUids.has(uid));
  if (availableUids.length === 0) throw new NoReceiverAvailableError();
  const lastPendingGiver = findLastPendingGiver(giverUid, candidates);
  if (lastPendingGiver && availableUids.includes(lastPendingGiver)) return lastPendingGiver;
  return availableUids[Math.floor(random() * availableUids.length)];
}

function findLastPendingGiver(giverUid: string, candidates: readonly DrawCandidate[]): string | null {
  const otherPendingGivers = candidates.filter((candidate) => candidate.uid !== giverUid && !candidate.hasDrawn);
  return otherPendingGivers.length === 1 ? otherPendingGivers[0].uid : null;
}
