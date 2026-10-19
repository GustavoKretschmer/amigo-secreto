import { useState, type FormEvent } from 'react';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { MIN_PASSWORD_LENGTH } from '../lib/password';
import { changePassword } from '../services/session';
import { FormError } from './FormError';
import { TextField } from './TextField';

export function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [wasChanged, setWasChanged] = useState(false);
  const { isRunning, errorMessage, run } = useAsyncAction();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const succeeded = await run(() => changePassword(currentPassword, newPassword));
    setWasChanged(succeeded);
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="card dialog" role="dialog" aria-modal="true" aria-labelledby="change-password-title" onClick={(event) => event.stopPropagation()}>
        <h2 id="change-password-title" className="card-title">Trocar senha</h2>
        {wasChanged ? (
          <>
            <p className="success-note">Senha alterada com sucesso! 🎉</p>
            <button className="button button-primary" onClick={onClose}>Fechar</button>
          </>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <TextField label="Senha atual" type="password" autoComplete="current-password" value={currentPassword} onValueChange={setCurrentPassword} required />
            <TextField label="Nova senha" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} value={newPassword} onValueChange={setNewPassword} hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`} required />
            <FormError message={errorMessage} />
            <div className="form-actions">
              <button type="button" className="button button-ghost" onClick={onClose}>Cancelar</button>
              <button type="submit" className="button button-primary" disabled={isRunning}>{isRunning ? 'Salvando…' : 'Salvar nova senha'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
