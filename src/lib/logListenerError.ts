import { FirebaseError } from 'firebase/app';

export function logListenerError(listener: string) {
  return (error: Error): void => {
    const code = error instanceof FirebaseError ? error.code : 'unknown';
    console.error(JSON.stringify({ event: 'listener_failed', listener, code, message: error.message }));
  };
}
