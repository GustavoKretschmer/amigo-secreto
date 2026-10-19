import { useState } from 'react';
import { describeError } from '../lib/firebaseErrors';

export interface AsyncAction {
  isRunning: boolean;
  errorMessage: string | null;
  run: (action: () => Promise<void>) => Promise<boolean>;
  clearError: () => void;
}

export function useAsyncAction(): AsyncAction {
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function run(action: () => Promise<void>): Promise<boolean> {
    setIsRunning(true);
    setErrorMessage(null);
    try {
      await action();
      return true;
    } catch (error) {
      setErrorMessage(describeError(error));
      return false;
    } finally {
      setIsRunning(false);
    }
  }

  return { isRunning, errorMessage, run, clearError: () => setErrorMessage(null) };
}
