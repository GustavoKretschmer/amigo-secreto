import { useState } from 'react';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { openDraw, resetDraw } from '../../services/draw';
import type { DrawStatus, Member } from '../../types';
import { FormError } from '../FormError';

const MIN_PARTICIPANTS = 3;

interface DrawControlsProps {
  members: readonly Member[];
  drawStatus: DrawStatus;
}

export function DrawControls({ members, drawStatus }: DrawControlsProps) {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const { isRunning, errorMessage, run } = useAsyncAction();
  const participants = members.filter((member) => member.participates);
  const drawnCount = participants.filter((member) => member.hasDrawn).length;
  const hasEnoughParticipants = participants.length >= MIN_PARTICIPANTS;

  async function confirmReset() {
    await run(() => resetDraw(members));
    setIsConfirmingReset(false);
  }

  return (
    <section className="card draw-controls">
      <div className="stats">
        <Stat value={participants.length} label="participantes" />
        <Stat value={`${drawnCount}/${participants.length}`} label="já sortearam" />
        <Stat value={drawStatus === 'open' ? 'Liberado' : 'Fechado'} label="sorteio" highlight={drawStatus === 'open'} />
      </div>
      <FormError message={errorMessage} />
      {drawStatus === 'closed' ? (
        <div className="draw-actions">
          <button className="button button-primary" disabled={isRunning || !hasEnoughParticipants} onClick={() => void run(openDraw)}>
            Liberar sorteio
          </button>
          {!hasEnoughParticipants && <span className="muted small">Cadastre pelo menos {MIN_PARTICIPANTS} participantes para liberar.</span>}
        </div>
      ) : (
        <div className="draw-actions">
          {isConfirmingReset ? (
            <span className="inline-confirm">
              <span className="small">Apagar todos os resultados e recomeçar?</span>
              <button className="button button-danger button-small" disabled={isRunning} onClick={() => void confirmReset()}>Sim, reiniciar</button>
              <button className="button button-ghost button-small" onClick={() => setIsConfirmingReset(false)}>Cancelar</button>
            </span>
          ) : (
            <button className="button button-ghost" onClick={() => setIsConfirmingReset(true)}>Reiniciar sorteio</button>
          )}
          <span className="muted small">Os resultados são secretos: nem o organizador consegue ver quem tirou quem.</span>
        </div>
      )}
    </section>
  );
}

function Stat({ value, label, highlight = false }: { value: string | number; label: string; highlight?: boolean }) {
  return (
    <div className={`stat ${highlight ? 'stat-highlight' : ''}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
