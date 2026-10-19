const PASSWORD_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const GENERATED_PASSWORD_LENGTH = 8;

export const MIN_PASSWORD_LENGTH = 6;

export function generatePassword(): string {
  const randomValues = crypto.getRandomValues(new Uint32Array(GENERATED_PASSWORD_LENGTH));
  return Array.from(randomValues, (value) => PASSWORD_ALPHABET[value % PASSWORD_ALPHABET.length]).join('');
}
