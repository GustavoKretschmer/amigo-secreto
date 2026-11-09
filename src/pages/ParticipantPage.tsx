import { useState } from 'react';
import { DrawPanel } from '../components/DrawPanel';
import { PageFrame } from '../components/PageFrame';
import { ParticipantsOverview } from '../components/ParticipantsOverview';
import { TabNav, type TabOption } from '../components/TabNav';
import { WishEditor } from '../components/WishEditor';
import type { Member } from '../types';

export type ParticipantTab = 'my-draw' | 'my-wish';

export const PARTICIPANT_TABS: readonly TabOption<ParticipantTab>[] = [
  { id: 'my-draw', label: 'Meu amigo secreto' },
  { id: 'my-wish', label: 'Sugestão de presente' },
];

type ParticipantPageTab = ParticipantTab | 'participants';

const PARTICIPANT_PAGE_TABS: readonly TabOption<ParticipantPageTab>[] = [
  ...PARTICIPANT_TABS,
  { id: 'participants', label: 'Participantes' },
];

export function ParticipantPage({ member }: { member: Member }) {
  const [activeTab, setActiveTab] = useState<ParticipantPageTab>('my-draw');
  return (
    <PageFrame member={member}>
      <TabNav tabs={PARTICIPANT_PAGE_TABS} activeTab={activeTab} onSelect={setActiveTab} />
      {activeTab === 'participants' ? (
        <main className="content content-narrow">
          <ParticipantsOverview currentUid={member.uid} />
        </main>
      ) : (
        <ParticipantContent uid={member.uid} tab={activeTab} onOpenWish={() => setActiveTab('my-wish')} />
      )}
    </PageFrame>
  );
}

interface ParticipantContentProps {
  uid: string;
  tab: ParticipantTab;
  onOpenWish: () => void;
}

export function ParticipantContent({ uid, tab, onOpenWish }: ParticipantContentProps) {
  return (
    <main className="content content-narrow">
      {tab === 'my-draw' ? <DrawPanel uid={uid} onOpenWish={onOpenWish} /> : <WishEditor uid={uid} />}
    </main>
  );
}
