import { useState } from 'react';
import { AddParticipantForm } from '../components/admin/AddParticipantForm';
import { DrawControls } from '../components/admin/DrawControls';
import { ParticipantList } from '../components/admin/ParticipantList';
import { PageFrame } from '../components/PageFrame';
import { LoadingScreen } from '../components/StatusScreen';
import { TabNav, type TabOption } from '../components/TabNav';
import { useDrawStatus, useFilledWishOwners, useMembers } from '../hooks/liveData';
import type { Member } from '../types';
import { PARTICIPANT_TABS, ParticipantContent, type ParticipantTab } from './ParticipantPage';

type AdminTab = 'manage' | ParticipantTab;

const ADMIN_TABS: readonly TabOption<AdminTab>[] = [{ id: 'manage', label: 'Organizar' }, ...PARTICIPANT_TABS];

export function AdminPage({ admin }: { admin: Member }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('manage');
  return (
    <PageFrame member={admin}>
      {admin.participates && <TabNav tabs={ADMIN_TABS} activeTab={activeTab} onSelect={setActiveTab} />}
      {activeTab === 'manage' ? <ManagementPanel /> : (
        <ParticipantContent uid={admin.uid} tab={activeTab} onOpenWish={() => setActiveTab('my-wish')} />
      )}
    </PageFrame>
  );
}

function ManagementPanel() {
  const members = useMembers();
  const drawStatus = useDrawStatus();
  const filledWishOwners = useFilledWishOwners();
  if (members === undefined || drawStatus === undefined || filledWishOwners === undefined) return <LoadingScreen />;
  return (
    <main className="content admin-grid">
      <div className="admin-column">
        <DrawControls members={members} drawStatus={drawStatus} />
        <AddParticipantForm />
      </div>
      <ParticipantList members={members} drawStatus={drawStatus} filledWishOwners={filledWishOwners} />
    </main>
  );
}
