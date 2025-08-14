import DetailsShimmer from '@/components/details/DetailsShimmer';
import PermissionDenial from '@/components/modals/PermissionDenial';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/components/ui/colors';
import useLocationPermissionRefresh from '@/hooks/useLocationPermissionRefresh';
import usePersistedAttemptCount from '@/hooks/usePermissionAttempt';
import { getLaunpadInfo } from '@/lib';
import { launchpadInfo } from '@/types/launcehs';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  Vibration,
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
    Vibration.vibrate([0, 100, 200]);
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
        .catch((err) => {
          if (err instanceof Error) {
            setErrorMsg(err.message);
          } else {
            setErrorMsg('Error Getting Details of launchpad');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, [launchPadData.id])
  );

  const openMapsApp = () => {
    Vibration.vibrate([0, 100, 200]);
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
    return <DetailsShimmer />;
  }

  if (!launchInfo) {
    return (
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={[
            'rgba(143, 149, 152, 0.5)',
            'rgba(65, 105, 225, 0.4)',
            'rgba(255, 140, 0, 0.2)',
          ]}
          start={[0, 0]}
          end={[1, 1]}
          style={{ flex: 1 }}
          locations={[0, 0.5, 1]}
        >
          <View style={styles.permissionDeniedContainer}>
            <ThemedText style={styles.permissionDeniedText}>
              {errorMsg}
            </ThemedText>
            <Text>{errorMsg}</Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={async () => {
                try {
                  Vibration.vibrate([0, 100, 200]);
                  const data = await getLaunpadInfo(launchPadData.id);
                  setLaunchInfo(data);
                } catch (error) {
                  if (error instanceof Error) {
                    setErrorMsg(error.message);
                  } else {
                    setErrorMsg('Error Getting Details of launchpad');
                  }
                }
              }}
            >
              <Text style={styles.permissionButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ThemedView>
    );
  }

  return (
    <LinearGradient
      colors={[
        'rgba(143, 149, 152, 0.5)',
        'rgba(65, 105, 225, 0.4)',
        'rgba(255, 140, 0, 0.2)',
      ]}
      start={[0, 0]}
      end={[1, 1]}
      style={{ flex: 1 }}
      locations={[0, 0.5, 1]}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <PermissionDenial
          visible={hasPermission === false}
          settingsOptions={attempt >= 2}
          handleRequestPremission={handlePermissionRequest}
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <MapView
            style={styles.map}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            initialRegion={{
              latitude: launchInfo.latitude,
              longitude: launchInfo.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
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
          <ThemedView style={styles.detailWrapper}>
            <LinearGradient
              colors={[
                'rgba(143, 149, 152, 0.5)',
                'rgba(65, 105, 225, 0.4)',
                'rgba(255, 140, 0, 0.2)',
              ]}
              start={[0, 0]}
              end={[1, 1]}
              style={{ flex: 1, paddingBottom: '10%' }}
              locations={[0, 0.5, 1]}
            >
              <View style={styles.detailsContainer}>
                <Image
                  source={require('@/assets/images/rocket.png')}
                  style={styles.image}
                  contentFit="cover"
                />
                <View style={styles.detailsSub}>
                  <ThemedText style={styles.fullName}>
                    {launchInfo.full_name}
                  </ThemedText>
                  <ThemedText style={styles.headingtext}>
                    Name{'\n'}
                    <ThemedText style={styles.valueText}>
                      {launchInfo.name}
                    </ThemedText>
                  </ThemedText>
                  <View style={styles.line} />

                  <View style={styles.pos}>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <ThemedText style={styles.headingtext}>
                        Longitude
                      </ThemedText>
                      <ThemedText style={styles.valueText}>
                        {launchInfo.longitude}
                      </ThemedText>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                      }}
                    >
                      <ThemedText style={styles.headingtext}>
                        Latitude
                      </ThemedText>
                      <ThemedText style={styles.valueText}>
                        {launchInfo.latitude}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.line} />
                </View>
              </View>
              <ThemedView style={styles.location}>
                <ThemedText style={styles.headingtext}>Locality</ThemedText>
                <ThemedText style={styles.valueText}>
                  {launchInfo.locality}
                </ThemedText>
                <ThemedText style={styles.headingtext}>Region</ThemedText>
                <ThemedText style={styles.valueText}>
                  {launchInfo.region}
                </ThemedText>
                <ThemedText style={styles.headingtext}>Timzone</ThemedText>
                <ThemedText style={styles.valueText}>
                  {launchInfo.timezone}
                </ThemedText>
                <ThemedText style={styles.headingtext}>Status</ThemedText>
                <ThemedText style={styles.valueText}>
                  {launchInfo.status}
                </ThemedText>
              </ThemedView>
              {location ? (
                <TouchableOpacity
                  style={styles.directionButton}
                  onPress={openMapsApp}
                >
                  <LinearGradient
                    colors={[
                      'rgba(143, 149, 152, 0.5)',
                      'rgba(65, 105, 225, 0.4)',
                      'rgba(255, 140, 0, 0.4)',
                    ]}
                    style={styles.directionGradient}
                    start={[0, 0]}
                    end={[1, 1]}
                    locations={[0, 0.5, 1]}
                  >
                    <ThemedText
                      maxFontSizeMultiplier={1.2}
                      style={styles.directionButtonText}
                      numberOfLines={1}
                    >
                      Get Directions to Launchpad
                    </ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 20,
                    right: 20,
                    alignItems: 'center',
                    zIndex: 999,
                  }}
                >
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text
                    style={{
                      color: '#2196F3',
                      marginTop: 8,
                      fontFamily: 'SpaceMonoBold',
                      textTransform: 'capitalize',
                    }}
                  >
                    Fetching current location...
                  </Text>
                </View>
              )}
            </LinearGradient>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: { height: Dimensions.get('window').width, width: '100%' },
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
    fontFamily: 'SpaceMonoBold',
  },
  permissionButton: {
    backgroundColor: colors.danger[400],
    width: '80%',
    paddingVertical: '4%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SpaceMonoBold',
  },
  directionButton: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 999,
    overflow: 'hidden',
    elevation: 5,
  },
  directionGradient: {
    padding: '3%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionButtonText: {
    fontFamily: 'SpaceMonoBold',
    fontSize: 15,
  },
  detailWrapper: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: -10,
    overflow: 'hidden',
    zIndex: 9999,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 20,
    paddingLeft: 10,
  },
  detailsSub: {
    flex: 1,
    paddingTop: 20,
    gap: 5,
  },
  fullName: {
    fontFamily: 'SpaceMonoBold',
    fontSize: 14,
    width: '90%',
  },
  pos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '90%',
  },
  location: {
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    elevation: 5,
  },
  headingtext: {
    fontFamily: 'SpaceMono',
    color: '#908f8fff',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  valueText: { fontFamily: 'SpaceMonoBold', fontSize: 14 },
  image: {
    height: '100%',
    width: 80,
  },
  line: {
    padding: 0.5,
    backgroundColor: '#908f8fff',
    width: '90%',
  },
});
