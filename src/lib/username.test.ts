import { describe, expect, it } from 'vitest';
import { buildUsername, isCompleteUsername, usernameToEmail } from './username';

describe('username', () => {
  it('builds nome.sobrenome without accents, spaces or uppercase', () => {
    expect(buildUsername(' João ', 'da Conceição')).toBe('joao.daconceicao');
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
