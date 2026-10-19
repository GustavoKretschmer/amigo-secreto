import { DrawPanel } from '../components/DrawPanel';
import { PageFrame } from '../components/PageFrame';
import type { Member } from '../types';

export function ParticipantPage({ member }: { member: Member }) {
  return (
    <PageFrame member={member}>
      <main className="content content-narrow">
        <DrawPanel uid={member.uid} />
      </main>
    </PageFrame>
  );
}
