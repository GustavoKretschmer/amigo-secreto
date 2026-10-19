import { useState } from 'react';
import { AddParticipantForm } from '../components/admin/AddParticipantForm';
import { DrawControls } from '../components/admin/DrawControls';
import { ParticipantList } from '../components/admin/ParticipantList';
import { DrawPanel } from '../components/DrawPanel';
import { PageFrame } from '../components/PageFrame';
import { LoadingScreen } from '../components/StatusScreen';
import { useDrawStatus, useMembers } from '../hooks/liveData';
import type { Member } from '../types';

type AdminTab = 'manage' | 'my-draw';

export function AdminPage({ admin }: { admin: Member }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('manage');
  return (
    <PageFrame member={admin}>
      {admin.participates && (
        <nav className="tabs" aria-label="Seções">
          <TabButton label="Organizar" isActive={activeTab === 'manage'} onSelect={() => setActiveTab('manage')} />
          <TabButton label="Meu amigo secreto" isActive={activeTab === 'my-draw'} onSelect={() => setActiveTab('my-draw')} />
        </nav>
      )}
      {activeTab === 'manage' ? (
        <ManagementPanel />
      ) : (
        <main className="content content-narrow">
          <DrawPanel uid={admin.uid} />
        </main>
      )}
    </PageFrame>
  );
}

function ManagementPanel() {
  const members = useMembers();
  const drawStatus = useDrawStatus();
  if (members === undefined || drawStatus === undefined) return <LoadingScreen />;
  return (
    <main className="content admin-grid">
      <div className="admin-column">
        <DrawControls members={members} drawStatus={drawStatus} />
        <AddParticipantForm />
      </div>
      <ParticipantList members={members} drawStatus={drawStatus} />
    </main>
  );
}

function TabButton({ label, isActive, onSelect }: { label: string; isActive: boolean; onSelect: () => void }) {
  return (
    <button className={`tab ${isActive ? 'tab-active' : ''}`} aria-pressed={isActive} onClick={onSelect}>
      {label}
    </button>
  );
}
