import type { ConfigContext, ExpoConfig } from '@expo/config';
import dotenv from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, `.env`);
dotenv.config({ path: envPath });
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SpaceX',
  slug: 'spacex',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/app-logo.png',
  scheme: 'spacex',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.aarjav.spacex',
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/app-logo.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: 'com.aarjav.spacex',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/app-logo.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/app-logo.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow $(PRODUCT_NAME) to use your location.',
      },
    ],

    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 25,
          targetSdkVersion: 35,
          compileSdkVersion: 35,
          buildToolsVersion: '35.0.0',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    googleMapsApiKeyAndroid: process.env.GOOGLE_MAPS_API_KEY,
    googleMapsApiKeyIOS: process.env.GOOGLE_MAPS_API_KEY_IOS,
  },
});
