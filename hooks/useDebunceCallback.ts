import { useCallback, useState } from 'react';

export const useDebouncedCallback = (callback: Function, delay: number) => {
  const [timeoutStart, setTimeoutStart] = useState<number | null>(null);

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();

      if (timeoutStart === null || now - timeoutStart >= delay) {
        setTimeoutStart(now);
        callback(...args);
      }
    },
    [callback, delay, timeoutStart]
  );
};
