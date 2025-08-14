/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import { Theme, useTheme } from '@react-navigation/native';

export function useThemeColor(colorName: keyof Theme['colors']) {
  const { colors } = useTheme();

  return colors[colorName];
}
