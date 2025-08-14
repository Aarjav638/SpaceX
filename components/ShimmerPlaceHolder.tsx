import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  type DimensionValue,
  type LayoutChangeEvent,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export const ShimmerPlaceholder = ({
  height,
  width,
  borderRadius,
}: {
  height: DimensionValue;
  width: DimensionValue;
  borderRadius: number;
}) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const shimmerTranslateX = useSharedValue(-1);

  const handleLayout = (e: LayoutChangeEvent) => {
    setLayoutWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, [shimmerTranslateX]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerTranslateX.value,
      [-1, 0, 1],
      [-layoutWidth, 0, layoutWidth]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      onLayout={handleLayout}
      style={{
        height,
        width,
        borderRadius,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
      }}
    >
      {layoutWidth > 0 && (
        <AnimatedGradient
          colors={['#dcdcdc', '#f5f5f5', '#dcdcdc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              height: '100%',
            },
            animatedStyle,
          ]}
        />
      )}
    </View>
  );
};
