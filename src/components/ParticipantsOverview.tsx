import { useMembers } from '../hooks/liveData';
import type { Member } from '../types';
import { LoadingScreen } from './StatusScreen';

export function ParticipantsOverview({ currentUid }: { currentUid: string }) {
  const members = useMembers();
  if (members === undefined) return <LoadingScreen />;
  const participants = members.filter((member) => member.participates);
  return (
    <section className="card">
      <h1 className="card-title">Participantes</h1>
      <p className="muted">
        {participants.length === 1 ? '1 pessoa está participando' : `${participants.length} pessoas estão participando`} do amigo secreto.
      </p>
      <ul className="member-list participants-overview">
        {participants.map((member) => (
          <ParticipantRow key={member.uid} member={member} isCurrentUser={member.uid === currentUid} />
        ))}
      </ul>
    </section>
  );
}

function ParticipantRow({ member, isCurrentUser }: { member: Member; isCurrentUser: boolean }) {
  return (
    <li className="member-row">
      <span className="user-avatar" aria-hidden="true">{member.displayName.charAt(0)}</span>
      <span className="member-name">
        {member.displayName}
        {member.role === 'admin' && <span className="tag">organizador</span>}
        {isCurrentUser && <span className="tag tag-neutral">você</span>}
      </span>
    </li>
  );
}
