import { describe, expect, it } from 'vitest';
import { buildDisplayName, buildUsername, isCompleteUsername, usernameToEmail } from './username';

describe('username', () => {
  it('uses the first name and the last surname', () => {
    expect(buildUsername('João da Silva Santos')).toBe('joao.santos');
  });

  it('removes accents, uppercase and extra spaces', () => {
    expect(buildUsername('  Ângela   Conceição ')).toBe('angela.conceicao');
  });

  it('returns empty when only one name is given', () => {
    expect(buildUsername('Maria')).toBe('');
  });

  it('keeps the full name tidy for display', () => {
    expect(buildDisplayName('  Ana   Maria  Souza ')).toBe('Ana Maria Souza');
  });

  it('maps the typed username to the internal login email', () => {
    expect(usernameToEmail(' Maria.Silva ')).toBe('maria.silva@amigo-secreto.app');
  });

  it('only accepts usernames with both parts filled', () => {
    expect(isCompleteUsername('maria.silva')).toBe(true);
    expect(isCompleteUsername('maria.')).toBe(false);
    expect(isCompleteUsername('.silva')).toBe(false);
  });
});
