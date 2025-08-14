// hooks/usePersistedAttemptCount.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const PERMISSION_ATTEMPT_KEY = 'location_permission_attempts';

export default function usePersistedAttemptCount() {
  const [attempt, setAttempt] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PERMISSION_ATTEMPT_KEY);
        if (stored !== null) {
          setAttempt(Number(stored));
        }
      } catch (error) {
        console.log('Error loading attempt count:', error);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const incrementAttempt = async (): Promise<number> => {
    const newAttempt = attempt + 1;
    setAttempt(newAttempt);

    try {
      await AsyncStorage.setItem(PERMISSION_ATTEMPT_KEY, newAttempt.toString());
    } catch (error) {
      console.log('Error saving attempt count:', error);
    }

    return newAttempt;
  };

  const resetAttempt = async (): Promise<void> => {
    setAttempt(0);

    try {
      await AsyncStorage.removeItem(PERMISSION_ATTEMPT_KEY);
    } catch (error) {
      console.log('Error resetting attempt count:', error);
    }
  };

  return {
    attempt,
    isLoaded,
    incrementAttempt,
    resetAttempt,
  };
}
