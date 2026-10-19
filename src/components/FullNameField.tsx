import { buildUsername, isCompleteUsername } from '../lib/username';
import { TextField } from './TextField';

interface FullNameFieldProps {
  fullName: string;
  onFullNameChange: (fullName: string) => void;
}

export function FullNameField({ fullName, onFullNameChange }: FullNameFieldProps) {
  const username = buildUsername(fullName);
  return (
    <>
      <TextField label="Nome completo" placeholder="Ex.: João da Silva Santos" autoComplete="name" value={fullName} onValueChange={onFullNameChange} required />
      <p className="muted small">
        Seu login será: <strong className="mono">{isCompleteUsername(username) ? username : 'nome.sobrenome'}</strong>
      </p>
    </>
  );
}

export function hasValidFullName(fullName: string): boolean {
  return isCompleteUsername(buildUsername(fullName));
}
