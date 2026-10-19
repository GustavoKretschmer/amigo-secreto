const LOGIN_EMAIL_DOMAIN = 'amigo-secreto.app';

function toLoginWord(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

export function buildUsername(firstName: string, lastName: string): string {
  return `${toLoginWord(firstName)}.${toLoginWord(lastName)}`;
}

export function buildDisplayName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`;
}

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${LOGIN_EMAIL_DOMAIN}`;
}

export function isCompleteUsername(username: string): boolean {
  return /^[a-z0-9]+\.[a-z0-9]+$/.test(username);
}
