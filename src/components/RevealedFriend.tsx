import { useWish } from '../hooks/liveData';
import type { Assignment } from '../types';

const CONFETTI_PIECES = 18;

export function RevealedFriend({ assignment }: { assignment: Assignment }) {
  return (
    <section className="card reveal-card revealed">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: CONFETTI_PIECES }, (_, index) => (
          <span key={index} className="confetti-piece" style={{ ['--i' as string]: index }} />
        ))}
      </div>
      <p className="eyebrow">Seu amigo secreto é</p>
      <h1 className="friend-name">{assignment.receiverName}</h1>
      <GiftSuggestion receiverUid={assignment.receiverUid} />
      <p className="muted">Guarde segredo e capriche no presente! 🎄</p>
    </section>
  );
}

function GiftSuggestion({ receiverUid }: { receiverUid: string }) {
  const wishText = useWish(receiverUid);
  if (wishText === undefined) return null;
  return (
    <p className="gift-suggestion">
      <strong className="gift-suggestion-label">Sugestão de presente:</strong>{' '}
      {wishText || <span className="muted">ainda não cadastrada</span>}
    </p>
  );
}
