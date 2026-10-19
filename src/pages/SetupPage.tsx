import { useState, type FormEvent } from 'react';
import { FormError } from '../components/FormError';
import { FullNameField, hasValidFullName } from '../components/FullNameField';
import { TextField } from '../components/TextField';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { MIN_PASSWORD_LENGTH } from '../lib/password';
import { registerFirstAdmin } from '../services/setup';

export function SetupPage() {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [participates, setParticipates] = useState(true);
  const { isRunning, errorMessage, run } = useAsyncAction();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await run(() => registerFirstAdmin({ fullName, password, participates }));
  }

  return (
    <section className="card auth-card">
      <div className="auth-hero" aria-hidden="true">🎄</div>
      <h1 className="auth-title">Bem-vindo, organizador!</h1>
      <p className="muted">Primeiro acesso: crie a conta de quem vai administrar o amigo secreto.</p>
      <form className="form" onSubmit={handleSubmit}>
        <FullNameField fullName={fullName} onFullNameChange={setFullName} />
        <TextField label="Senha" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} value={password} onValueChange={setPassword} hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`} required />
        <label className="checkbox">
          <input type="checkbox" checked={participates} onChange={(event) => setParticipates(event.target.checked)} />
          Eu também vou participar do sorteio
        </label>
        <FormError message={errorMessage} />
        <button type="submit" className="button button-primary button-large" disabled={isRunning || !hasValidFullName(fullName)}>
          {isRunning ? 'Criando…' : 'Criar conta de organizador'}
        </button>
      </form>
    </section>
  );
}
