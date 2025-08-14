// hooks/useLocationPermissionRefresh.js
import * as Location from 'expo-location';
import { useEffect } from 'react';
import { AppState } from 'react-native';
type PermissionCallback = (granted: boolean) => void;
const useLocationPermissionRefresh = (
  onPermissionChanged: PermissionCallback
) => {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (nextAppState === 'active') {
          const { status } = await Location.getForegroundPermissionsAsync();
          onPermissionChanged(status === 'granted');
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [onPermissionChanged]);
};

export default useLocationPermissionRefresh;
