import { useRef } from 'react';

function useThrottle(callback: () => void, delay: number) {
  const lastCall = useRef(0);

  return () => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback();
    }
  };
}

export { useThrottle };
