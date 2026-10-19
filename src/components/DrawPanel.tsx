import { useAssignment, useDrawStatus } from '../hooks/liveData';
import { GiftReveal } from './GiftReveal';
import { LoadingScreen, StatusScreen } from './StatusScreen';

export function DrawPanel({ uid }: { uid: string }) {
  const drawStatus = useDrawStatus();
  const assignment = useAssignment(uid);

  if (drawStatus === undefined || assignment === undefined) return <LoadingScreen />;
  if (drawStatus === 'closed' && !assignment) {
    return (
      <StatusScreen
        title="O sorteio ainda não começou"
        description="Assim que o organizador liberar, o botão de sortear aparece aqui. Fique de olho!"
      />
    );
  }
  return <GiftReveal giverUid={uid} assignment={assignment} />;
}
