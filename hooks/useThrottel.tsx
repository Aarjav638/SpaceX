import { useRef } from 'react';

function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);

  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  };
}

export { useThrottle };
