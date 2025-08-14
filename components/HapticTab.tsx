import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (Platform.OS === 'android') {
          // Use performAndroidHapticsAsync for better vibration on Android
          Haptics.performAndroidHapticsAsync(
            Haptics.AndroidHaptics.Keyboard_Press
          );
        }

        props.onPressIn?.(ev);
      }}
    />
  );
}
