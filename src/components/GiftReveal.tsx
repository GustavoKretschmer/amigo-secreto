import { useState } from 'react';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { drawSecretFriend } from '../services/draw';
import type { Assignment } from '../types';
import { FormError } from './FormError';

const OPENING_ANIMATION_MS = 1800;

interface GiftRevealProps {
  giverUid: string;
  assignment: Assignment | null;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function GiftReveal({ giverUid, assignment }: GiftRevealProps) {
  const [isOpening, setIsOpening] = useState(false);
  const { errorMessage, run } = useAsyncAction();

  async function handleDraw() {
    setIsOpening(true);
    await run(async () => {
      await Promise.all([drawSecretFriend(giverUid), wait(OPENING_ANIMATION_MS)]);
    });
    setIsOpening(false);
  }

  if (assignment && !isOpening) return <RevealedFriend receiverName={assignment.receiverName} />;

  return (
    <section className="card reveal-card">
      <div className={`gift ${isOpening ? 'gift-opening' : ''}`} aria-hidden="true">
        <div className="gift-lid" />
        <div className="gift-box" />
        <div className="gift-ribbon" />
      </div>
      <h1 className="reveal-title">Quem será que você vai tirar?</h1>
      <p className="muted">Clique no botão e descubra quem é o seu amigo secreto. Não conte pra ninguém! 🤫</p>
      <FormError message={errorMessage} />
      <button className="button button-primary button-large" onClick={() => void handleDraw()} disabled={isOpening}>
        {isOpening ? 'Sorteando…' : 'Sortear amigo secreto'}
      </button>
    </section>
  );
}

function RevealedFriend({ receiverName }: { receiverName: string }) {
  return (
    <section className="card reveal-card revealed">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} className="confetti-piece" style={{ ['--i' as string]: index }} />
        ))}
      </div>
      <p className="eyebrow">Seu amigo secreto é</p>
      <h1 className="friend-name">{receiverName}</h1>
      <p className="muted">Guarde segredo e capriche no presente! 🎄</p>
    </section>
  );
}
