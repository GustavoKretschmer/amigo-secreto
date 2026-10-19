import type { User } from 'firebase/auth';
import { watchAssignment, watchDrawStatus } from '../services/draw';
import { watchMember, watchMembers } from '../services/members';
import { watchAuthUser } from '../services/session';
import { watchAdminExists } from '../services/setup';
import { watchFilledWishOwners, watchWish } from '../services/wishes';
import type { Assignment, DrawStatus, Member } from '../types';
import { useLiveValue } from './useLiveValue';

export function useAuthUser(): User | null | undefined {
  return useLiveValue('auth', watchAuthUser);
}

export function useAdminExists(): boolean | undefined {
  return useLiveValue('admin-marker', watchAdminExists);
}

export function useMember(uid: string): Member | null | undefined {
  return useLiveValue(`member:${uid}`, (onValue: (member: Member | null) => void) => watchMember(uid, onValue));
}

export function useMembers(): Member[] | undefined {
  return useLiveValue('members', watchMembers);
}

export function useDrawStatus(): DrawStatus | undefined {
  return useLiveValue('draw-status', watchDrawStatus);
}

export function useAssignment(uid: string): Assignment | null | undefined {
  return useLiveValue(`assignment:${uid}`, (onValue: (assignment: Assignment | null) => void) =>
    watchAssignment(uid, onValue),
  );
}

export function useWish(uid: string): string | undefined {
  return useLiveValue(`wish:${uid}`, (onValue: (wishText: string) => void) => watchWish(uid, onValue));
}

export function useFilledWishOwners(): Set<string> | undefined {
  return useLiveValue('wish-owners', watchFilledWishOwners);
}
