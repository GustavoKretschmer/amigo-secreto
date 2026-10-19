import type { InputHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  hint?: string;
}

export function TextField({ label, value, onValueChange, hint, ...inputProps }: TextFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className="field-input" value={value} onChange={(event) => onValueChange(event.target.value)} {...inputProps} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
