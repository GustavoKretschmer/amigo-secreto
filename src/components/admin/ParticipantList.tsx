import { useState } from 'react';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { removeParticipant } from '../../services/members';
import type { DrawStatus, Member } from '../../types';
import { FormError } from '../FormError';

interface ParticipantListProps {
  members: readonly Member[];
  drawStatus: DrawStatus;
}

export function ParticipantList({ members, drawStatus }: ParticipantListProps) {
  const [pendingRemovalUid, setPendingRemovalUid] = useState<string | null>(null);
  const { isRunning, errorMessage, run } = useAsyncAction();
  const canRemove = drawStatus === 'closed';

  async function confirmRemoval(uid: string) {
    await run(() => removeParticipant(uid));
    setPendingRemovalUid(null);
  }

  return (
    <section className="card">
      <h2 className="card-title">Participantes</h2>
      {members.length === 0 && <p className="muted">Nenhum participante ainda. Cadastre o primeiro ao lado!</p>}
      <FormError message={errorMessage} />
      <ul className="member-list">
        {members.map((member) => (
          <li key={member.uid} className="member-row">
            <span className="user-avatar" aria-hidden="true">{member.displayName.charAt(0)}</span>
            <span className="member-identity">
              <span className="member-name">{member.displayName}{member.role === 'admin' && <span className="tag">organizador</span>}</span>
              <span className="mono small muted">{member.username}</span>
            </span>
            <DrawBadge member={member} />
            {canRemove && member.role !== 'admin' && (
              pendingRemovalUid === member.uid ? (
                <span className="inline-confirm">
                  <button className="button button-danger button-small" disabled={isRunning} onClick={() => void confirmRemoval(member.uid)}>Remover</button>
                  <button className="button button-ghost button-small" onClick={() => setPendingRemovalUid(null)}>Cancelar</button>
                </span>
              ) : (
                <button className="icon-button" aria-label={`Remover ${member.displayName}`} onClick={() => setPendingRemovalUid(member.uid)}>✕</button>
              )
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DrawBadge({ member }: { member: Member }) {
  if (!member.participates) return <span className="badge badge-neutral">não participa</span>;
  return member.hasDrawn
    ? <span className="badge badge-success">já sorteou</span>
    : <span className="badge badge-waiting">aguardando</span>;
}
