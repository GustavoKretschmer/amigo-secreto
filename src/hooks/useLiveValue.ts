import { useEffect, useState } from 'react';

type Unsubscribe = () => void;
type Subscribe<T> = (onValue: (value: T) => void) => Unsubscribe;

interface KeyedValue<T> {
  key: string | null;
  value: T | undefined;
}

export function useLiveValue<T>(key: string | null, subscribe: Subscribe<T>): T | undefined {
  const [current, setCurrent] = useState<KeyedValue<T>>({ key: null, value: undefined });

  useEffect(() => {
    if (key === null) return undefined;
    return subscribe((value) => setCurrent({ key, value }));
  }, [key]);

  return current.key === key ? current.value : undefined;
}
