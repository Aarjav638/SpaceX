import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';

import { colors } from '@/components/ui/colors';
import { useColorScheme } from 'react-native';

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.primary[200],
    background: colors.neutral[800],
    text: colors.white,
    border: colors.charcoal[500],
    card: colors.charcoal[850],
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[200],
    background: colors.white,
    text: colors.charcoal[800],
    border: colors.charcoal[500],
    card: colors.charcoal[850],
  },
};

export function useThemeConfig() {
  const colorScheme = useColorScheme();

  if (colorScheme === 'dark') return DarkTheme;

  return LightTheme;
}
