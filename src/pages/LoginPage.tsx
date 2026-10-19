import { useState, type FormEvent } from 'react';
import { FormError } from '../components/FormError';
import { TextField } from '../components/TextField';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { signIn } from '../services/session';

export function LoginPage({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isRunning, errorMessage, run } = useAsyncAction();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await run(() => signIn(username, password));
  }

  return (
    <section className="card auth-card">
      <div className="auth-hero" aria-hidden="true">🎁</div>
      <h1 className="auth-title">Amigo Secreto</h1>
      <p className="muted">Entre com seu login (nome.sobrenome) e sua senha.</p>
      <form className="form" onSubmit={handleSubmit}>
        <TextField label="Usuário" placeholder="nome.sobrenome" autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onValueChange={setUsername} required />
        <TextField label="Senha" type="password" autoComplete="current-password" value={password} onValueChange={setPassword} required />
        <FormError message={errorMessage} />
        <button type="submit" className="button button-primary button-large" disabled={isRunning}>
          {isRunning ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="auth-switch">
        Ainda não tem conta? <button type="button" className="link-button" onClick={onSwitchToSignUp}>Criar conta</button>
      </p>
    </section>
  );
}
