import { useState, type FormEvent } from 'react';
import { FormError } from '../components/FormError';
import { FullNameField, hasValidFullName } from '../components/FullNameField';
import { LoadingScreen, StatusScreen } from '../components/StatusScreen';
import { TextField } from '../components/TextField';
import { useDrawStatus } from '../hooks/liveData';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { MIN_PASSWORD_LENGTH } from '../lib/password';
import { registerOwnAccount } from '../services/members';

const PASSWORD_MISMATCH_MESSAGE = 'As senhas não são iguais.';

export function SignUpPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const drawStatus = useDrawStatus();
  if (drawStatus === undefined) return <LoadingScreen />;
  if (drawStatus === 'open') {
    return (
      <StatusScreen
        title="Inscrições encerradas"
        description="O sorteio já começou, então não dá mais para criar conta. Fale com o organizador."
        action={<button className="button button-primary" onClick={onSwitchToLogin}>Voltar ao login</button>}
      />
    );
  }
  return <SignUpForm onSwitchToLogin={onSwitchToLogin} />;
}

function SignUpForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { isRunning, errorMessage, run } = useAsyncAction();
  const passwordsDiffer = passwordConfirmation !== '' && password !== passwordConfirmation;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await run(() => registerOwnAccount({ fullName, password }));
  }

  return (
    <section className="card auth-card">
      <div className="auth-hero" aria-hidden="true">🎁</div>
      <h1 className="auth-title">Criar conta</h1>
      <p className="muted">Cadastre-se para participar do amigo secreto.</p>
      <form className="form" onSubmit={handleSubmit}>
        <FullNameField fullName={fullName} onFullNameChange={setFullName} />
        <TextField label="Senha" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} value={password} onValueChange={setPassword} hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`} required />
        <TextField label="Confirmar senha" type="password" autoComplete="new-password" value={passwordConfirmation} onValueChange={setPasswordConfirmation} required />
        <FormError message={passwordsDiffer ? PASSWORD_MISMATCH_MESSAGE : errorMessage} />
        <button type="submit" className="button button-primary button-large" disabled={isRunning || passwordsDiffer || !hasValidFullName(fullName)}>
          {isRunning ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>
      <p className="auth-switch">
        Já tem conta? <button type="button" className="link-button" onClick={onSwitchToLogin}>Entrar</button>
      </p>
    </section>
  );
}
