const LOGIN_EMAIL_DOMAIN = 'amigo-secreto.app';

function toLoginWord(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function splitNameWords(fullName: string): string[] {
  return fullName.trim().split(/\s+/).filter((word) => toLoginWord(word) !== '');
}

export function buildUsername(fullName: string): string {
  const words = splitNameWords(fullName);
  if (words.length < 2) return '';
  return `${toLoginWord(words[0])}.${toLoginWord(words[words.length - 1])}`;
}

export function buildDisplayName(fullName: string): string {
  return fullName.trim().split(/\s+/).join(' ');
}

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${LOGIN_EMAIL_DOMAIN}`;
}

export function isCompleteUsername(username: string): boolean {
  return /^[a-z0-9]+\.[a-z0-9]+$/.test(username);
}
