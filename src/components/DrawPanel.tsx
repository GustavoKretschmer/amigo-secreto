import { useAssignment, useDrawStatus, useWish } from '../hooks/liveData';
import { WISH_REQUIRED_MESSAGE } from '../services/wishes';
import { GiftReveal } from './GiftReveal';
import { LoadingScreen, StatusScreen } from './StatusScreen';

interface DrawPanelProps {
  uid: string;
  onOpenWish: () => void;
}

export function DrawPanel({ uid, onOpenWish }: DrawPanelProps) {
  const drawStatus = useDrawStatus();
  const assignment = useAssignment(uid);
  const wishText = useWish(uid);

  if (drawStatus === undefined || assignment === undefined || wishText === undefined) return <LoadingScreen />;
  if (assignment) return <GiftReveal giverUid={uid} assignment={assignment} />;
  if (wishText === '') return <WishRequiredScreen onOpenWish={onOpenWish} />;
  if (drawStatus === 'closed') {
    return (
      <StatusScreen
        title="O sorteio ainda não começou"
        description="Assim que o organizador liberar, o botão de sortear aparece aqui. Fique de olho!"
      />
    );
  }
  return <GiftReveal giverUid={uid} assignment={null} />;
}

function WishRequiredScreen({ onOpenWish }: { onOpenWish: () => void }) {
  return (
    <StatusScreen
      title="Falta sua sugestão de presente"
      description={`${WISH_REQUIRED_MESSAGE} Assim quem tirar você sabe o que dar.`}
      action={<button className="button button-primary" onClick={onOpenWish}>Preencher sugestão</button>}
    />
  );
}
