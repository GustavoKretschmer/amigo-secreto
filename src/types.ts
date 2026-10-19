export type Role = 'admin' | 'participant';

export type DrawStatus = 'closed' | 'open';

export interface Member {
  uid: string;
  username: string;
  displayName: string;
  role: Role;
  participates: boolean;
  hasDrawn: boolean;
}

export interface Assignment {
  receiverUid: string;
  receiverName: string;
}

export interface NewMemberInput {
  fullName: string;
  password: string;
}
