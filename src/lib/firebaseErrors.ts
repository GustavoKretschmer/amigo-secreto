import { FirebaseError } from 'firebase/app';
import { NoReceiverAvailableError } from './pickReceiver';

const MESSAGES_BY_CODE: Readonly<Record<string, string>> = {
  'auth/invalid-credential': 'Usuário ou senha incorretos.',
  'auth/wrong-password': 'Senha atual incorreta.',
  'auth/user-not-found': 'Usuário ou senha incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  'auth/email-already-in-use': 'Já existe uma conta com esse login. Se for você, use "Entrar". Se for outra pessoa com o mesmo nome, coloque outro sobrenome no final.',
  'auth/configuration-not-found': 'O login ainda não foi ativado no Firebase. Avise o organizador.',
  'auth/operation-not-allowed': 'O login por e-mail/senha está desativado no Firebase. Avise o organizador.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
  'auth/requires-recent-login': 'Por segurança, saia e entre de novo antes de trocar a senha.',
  'permission-denied': 'Você não tem permissão para essa ação.',
  unavailable: 'Serviço indisponível no momento. Tente de novo.',
};

const FALLBACK_MESSAGE = 'Algo deu errado. Tente novamente.';

export function describeError(error: unknown): string {
  if (error instanceof NoReceiverAvailableError) return error.message;
  if (error instanceof FirebaseError) return MESSAGES_BY_CODE[error.code] ?? FALLBACK_MESSAGE;
  return FALLBACK_MESSAGE;
}

export function isPermissionDenied(error: unknown): boolean {
  return error instanceof FirebaseError && error.code === 'permission-denied';
}
