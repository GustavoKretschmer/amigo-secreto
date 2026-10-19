import { useState, type ReactNode } from 'react';
import { signOutCurrentUser } from '../services/session';
import type { Member } from '../types';
import { ChangePasswordDialog } from './ChangePasswordDialog';

interface PageFrameProps {
  member: Member;
  children: ReactNode;
}

export function PageFrame({ member, children }: PageFrameProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  return (
    <div className="page">
      <header className="topbar">
        <span className="brand">
          <span aria-hidden="true">🎁</span> Amigo Secreto
        </span>
        <div className="topbar-actions">
          <span className="user-chip" title={member.username}>
            <span className="user-avatar" aria-hidden="true">{member.displayName.charAt(0)}</span>
            <span className="user-name">{member.displayName}</span>
          </span>
          <button className="button button-ghost button-small" onClick={() => setIsChangingPassword(true)}>Trocar senha</button>
          <button className="button button-ghost button-small" onClick={() => void signOutCurrentUser()}>Sair</button>
        </div>
      </header>
      {children}
      {isChangingPassword && <ChangePasswordDialog onClose={() => setIsChangingPassword(false)} />}
    </div>
  );
}
