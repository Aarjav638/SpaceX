import HomeShimmer from '@/components/home/HomeShimmer';
import PermissionDenial from '@/components/modals/PermissionDenial';
import { ThemedView } from '@/components/ThemedView';
import useLocationPermissionRefresh from '@/hooks/useLocationPermissionRefresh';
import usePersistedAttemptCount from '@/hooks/usePermissionAttempt';
import { getLaunpadInfo } from '@/lib';
import { launchpadInfo } from '@/types/launcehs';
import * as Location from 'expo-location';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const Details = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const { details } = useLocalSearchParams();
  const launchPadData: { id: string; details: string } = JSON.parse(
    details.toString()
  );
  const { attempt, isLoaded, incrementAttempt } = usePersistedAttemptCount();
  const [launchInfo, setLaunchInfo] = useState<launchpadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePermissionRequest = async () => {
    const currentAttempt = await incrementAttempt();

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      setHasPermission(true);
      return;
    }

    if (currentAttempt >= 2) {
      Linking.openSettings();
      return;
    } else {
      ToastAndroid.show('Permission denied again', ToastAndroid.SHORT);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!isLoaded) return;
      (async () => {
        await incrementAttempt();
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setHasPermission(false);
          return;
        }
        setHasPermission(true);
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])
  );

  useEffect(() => {
    (async () => {
      if (hasPermission) {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.LocationAccuracy.BestForNavigation,
        });
        setLocation(currentLocation);
      }
    })();
  }, [hasPermission]);

  useLocationPermissionRefresh(async (granted) => {
    if (granted) {
      setHasPermission(granted);
    }
  });

  useFocusEffect(
    useCallback(() => {
      getLaunpadInfo(launchPadData.id)
        .then((data) => setLaunchInfo(data))
        .catch((err) => setErrorMsg(err.message))
        .finally(() => {
          setLoading(false);
        });
    }, [launchPadData.id])
  );

  const openMapsApp = () => {
    if (!location || !launchInfo) {
      Alert.alert('Current location not available');
      return;
    }
    const userLat = location.coords.latitude;
    const userLng = location.coords.longitude;
    const destLat = launchInfo.latitude;
    const destLng = launchInfo.longitude;

    const url = Platform.select({
      ios: `http://maps.apple.com/?saddr=${userLat},${userLng}&daddr=${destLat},${destLng}&dirflg=d`,
      android: `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=driving`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Failed to open the map app');
      });
    }
  };

  if (loading) {
    return <HomeShimmer />;
  }

  if (!launchInfo) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.permissionDeniedContainer}>
          <Text style={styles.permissionDeniedText}>
            Error Getting Details of launchpad
          </Text>
          <Text>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              const data = await getLaunpadInfo(launchPadData.id);
              setLaunchInfo(data);
            }}
          >
            <Text style={styles.permissionButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <PermissionDenial
        visible={hasPermission === false}
        settingsOptions={attempt >= 2}
        handleRequestPremission={handlePermissionRequest}
      />
      <ThemedView style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          initialRegion={{
            latitude: launchInfo.latitude,
            longitude: launchInfo.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: launchInfo.latitude,
              longitude: launchInfo.longitude,
            }}
            title="Launchpad"
            description="Launchpad Location"
          />
        </MapView>

        {location ? (
          <TouchableOpacity
            style={styles.directionButton}
            onPress={openMapsApp}
          >
            <Text style={styles.directionButtonText}>
              Get Directions to Launchpad
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              position: 'absolute',
              bottom: 40,
              left: 20,
              right: 20,
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={{ color: '#2196F3', marginTop: 8 }}>
              Fetching current location...
            </Text>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionDeniedText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  directionButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  directionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
