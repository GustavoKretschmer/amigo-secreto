import { useState, type FormEvent } from 'react';
import { useWish } from '../hooks/liveData';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { MAX_WISH_LENGTH, WISH_REQUIRED_MESSAGE, saveWish } from '../services/wishes';
import { FormError } from './FormError';
import { LoadingScreen } from './StatusScreen';

export function WishEditor({ uid }: { uid: string }) {
  const savedWish = useWish(uid);
  if (savedWish === undefined) return <LoadingScreen />;
  return <WishForm uid={uid} savedWish={savedWish} />;
}

function WishForm({ uid, savedWish }: { uid: string; savedWish: string }) {
  const [draft, setDraft] = useState(savedWish);
  const [wasSaved, setWasSaved] = useState(false);
  const { isRunning, errorMessage, run } = useAsyncAction();
  const hasChanges = draft.trim() !== savedWish;
  const isDraftEmpty = draft.trim() === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setWasSaved(await run(() => saveWish(uid, draft)));
  }

  function handleDraftChange(text: string) {
    setDraft(text);
    setWasSaved(false);
  }

  return (
    <section className="card">
      <h1 className="card-title">Sugestão de presente</h1>
      <p className="muted">Conte o que você gostaria de ganhar. Quem tirar você vai ver essa sugestão logo abaixo do seu nome.</p>
      <form className="form wish-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Minha sugestão <span className="required-mark">*</span></span>
          <textarea
            className="field-input wish-textarea"
            value={draft}
            required
            maxLength={MAX_WISH_LENGTH}
            placeholder="Ex.: livro de ficção, caneca divertida, chocolate amargo, tamanho M..."
            onChange={(event) => handleDraftChange(event.target.value)}
          />
          <span className="field-hint">{draft.length}/{MAX_WISH_LENGTH} caracteres</span>
        </label>
        {isDraftEmpty && <p className="warning-note" role="alert">{WISH_REQUIRED_MESSAGE}</p>}
        <FormError message={errorMessage} />
        {wasSaved && !hasChanges && <p className="success-note">Sugestão salva! 🎁</p>}
        <button type="submit" className="button button-primary" disabled={isRunning || !hasChanges || isDraftEmpty}>
          {isRunning ? 'Salvando…' : 'Salvar sugestão'}
        </button>
      </form>
    </section>
  );
}
