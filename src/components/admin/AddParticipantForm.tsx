import { useState, type FormEvent } from 'react';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { MIN_PASSWORD_LENGTH, generatePassword } from '../../lib/password';
import { buildUsername, isCompleteUsername } from '../../lib/username';
import { registerParticipant } from '../../services/members';
import { FormError } from '../FormError';
import { TextField } from '../TextField';

interface CreatedCredentials {
  displayName: string;
  username: string;
  password: string;
}

export function AddParticipantForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState(generatePassword);
  const [created, setCreated] = useState<CreatedCredentials | null>(null);
  const { isRunning, errorMessage, run } = useAsyncAction();
  const usernamePreview = buildUsername(firstName, lastName);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await run(async () => {
      const participant = await registerParticipant({ firstName, lastName, password });
      setCreated({ displayName: participant.displayName, username: participant.username, password });
      setFirstName('');
      setLastName('');
      setPassword(generatePassword());
    });
  }

  return (
    <section className="card">
      <h2 className="card-title">Cadastrar participante</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <TextField label="Nome" value={firstName} onValueChange={setFirstName} autoComplete="off" required />
          <TextField label="Sobrenome" value={lastName} onValueChange={setLastName} autoComplete="off" required />
        </div>
        <div className="form-row form-row-end">
          <TextField label="Senha inicial" value={password} onValueChange={setPassword} minLength={MIN_PASSWORD_LENGTH} autoComplete="off" required />
          <button type="button" className="button button-ghost" onClick={() => setPassword(generatePassword())}>Gerar outra</button>
        </div>
        <p className="muted small">
          Usuário de acesso: <strong className="mono">{isCompleteUsername(usernamePreview) ? usernamePreview : 'nome.sobrenome'}</strong>
        </p>
        <FormError message={errorMessage} />
        <button type="submit" className="button button-primary" disabled={isRunning || !isCompleteUsername(usernamePreview)}>
          {isRunning ? 'Cadastrando…' : 'Cadastrar participante'}
        </button>
      </form>
      {created && <CredentialsNote credentials={created} onDismiss={() => setCreated(null)} />}
    </section>
  );
}

function CredentialsNote({ credentials, onDismiss }: { credentials: CreatedCredentials; onDismiss: () => void }) {
  const [wasCopied, setWasCopied] = useState(false);
  const shareText = `Olá, ${credentials.displayName}! Seu acesso ao Amigo Secreto:\nUsuário: ${credentials.username}\nSenha: ${credentials.password}\nLink: ${window.location.origin}`;

  async function copyToClipboard() {
    await navigator.clipboard.writeText(shareText);
    setWasCopied(true);
  }

  return (
    <div className="credentials-note">
      <p><strong>{credentials.displayName}</strong> foi cadastrado(a)! Envie o acesso:</p>
      <pre className="credentials-text">{shareText}</pre>
      <div className="form-actions">
        <button className="button button-ghost button-small" onClick={onDismiss}>Fechar</button>
        <button className="button button-primary button-small" onClick={() => void copyToClipboard()}>{wasCopied ? 'Copiado!' : 'Copiar mensagem'}</button>
      </div>
    </div>
  );
}
