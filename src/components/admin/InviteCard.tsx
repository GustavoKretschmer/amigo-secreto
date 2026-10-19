import { useState } from 'react';
import type { DrawStatus } from '../../types';

export function InviteCard({ drawStatus }: { drawStatus: DrawStatus }) {
  const [wasCopied, setWasCopied] = useState(false);
  const inviteLink = window.location.origin;
  const inviteMessage = `Bora participar do nosso amigo secreto! 🎁\nCrie sua conta em: ${inviteLink}\nLá você também deixa sua sugestão de presente.`;

  async function copyInvite() {
    await navigator.clipboard.writeText(inviteMessage);
    setWasCopied(true);
  }

  return (
    <section className="card">
      <h2 className="card-title">Convidar participantes</h2>
      {drawStatus === 'open' ? (
        <p className="muted">Inscrições encerradas: com o sorteio liberado, ninguém novo consegue criar conta. Reinicie o sorteio para reabrir.</p>
      ) : (
        <>
          <p className="muted">Cada pessoa cria a própria conta com nome completo e senha. Mande este convite no grupo:</p>
          <pre className="credentials-text">{inviteMessage}</pre>
          <button className="button button-primary" onClick={() => void copyInvite()}>{wasCopied ? 'Convite copiado!' : 'Copiar convite'}</button>
        </>
      )}
    </section>
  );
}
