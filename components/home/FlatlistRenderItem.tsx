import { colors } from '@/components/ui/colors';
import { Launch } from '@/types/launcehs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { ThemedText } from '../ThemedText';
interface RenderItemProps {
  item: Launch; // replace with your item type
  index: number;
}

const RenderItem = memo(
  ({ item }: RenderItemProps) => {
    const { colors: COLORS } = useTheme();
    const date = new Date(item.date_utc).toLocaleDateString('en-gb', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      weekday: 'short',
    });
    const time = new Date(item.date_utc).toLocaleTimeString('en-gb', {
      timeStyle: 'medium',
      hourCycle: 'h12',
    });
    const position = useRef(new Animated.ValueXY({ x: -10, y: -10 })).current;
    const rotation = useRef(new Animated.Value(0)).current;
    const [layoutWidth, setLayoutWidth] = useState(100);
    const crashPos = useRef(new Animated.ValueXY({ x: 35, y: -20 })).current;

    useEffect(() => {
      const createRectanglePattern = () => {
        return Animated.loop(
          Animated.sequence([
            // 1. Start from left, move to right (top edge)
            Animated.parallel([
              Animated.timing(position, {
                toValue: { x: 50, y: -10 }, // Move right, stay at top
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(rotation, {
                toValue: 1, // Rotate 90deg to point down
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),

            // 2. Move from top to bottom (right edge)
            Animated.parallel([
              Animated.timing(position, {
                toValue: { x: 50, y: 10 }, // Stay right, move down
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(rotation, {
                toValue: 2, // Rotate 180deg to point left
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),

            // 3. Move from right to left (bottom edge)
            Animated.parallel([
              Animated.timing(position, {
                toValue: { x: -50, y: 10 }, // Move left, stay at bottom
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(rotation, {
                toValue: 3, // Rotate 270deg to point up
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),

            // 4. Move from bottom to top (left edge)
            Animated.parallel([
              Animated.timing(position, {
                toValue: { x: -50, y: -10 }, // Stay left, move up
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(rotation, {
                toValue: 4, // Rotate 360deg to point right (back to start)
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
          ])
        );
      };
      const createCrashPattern = () => {
        return Animated.loop(
          Animated.timing(crashPos, {
            toValue: { x: 35, y: 10 },
            duration: 1000,
            useNativeDriver: true,
          })
        );
      };

      if (item.success) {
        createRectanglePattern().start();
      } else {
        createCrashPattern().start();
      }
    }, [crashPos, item.success, layoutWidth, position, rotation]);

    const rotateInterpolate = rotation.interpolate({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'],
      extrapolate: 'clamp',
    });
    return (
      <LinearGradient
        colors={[
          'rgba(164, 181, 193, 1)',
          'rgba(169, 151, 221, 1)',
          'rgba(196, 202, 212, 1)',
        ]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.cardContainer}
        locations={[0, 0.5, 1]}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'space-evenly',
            gap: 10,
            overflow: 'visible',
          }}
          onPress={() => {
            Vibration.vibrate([0, 100, 200]);
            const details = { id: item.launchpad, detail: item.details };
            const data = JSON.stringify(details);
            router.push(`/Details/${data}`);
          }}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri:
                  item.links.patch.large ||
                  'https://dummyimage.com/600x400/f5f5f5/dbdbdb.jpg&text=Image%20Not%20Available',
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
              contentFit="contain"
              placeholder={
                'https://dummyimage.com/600x400/f5f5f5/dbdbdb.jpg&text=loading...'
              }
              placeholderContentFit="cover"
              transition={100}
            />
          </View>
          <View
            style={{
              ...styles.status,
              backgroundColor: item.success
                ? colors.success[500]
                : colors.danger[500],
            }}
            onLayout={(event) => {
              const width = event.nativeEvent.layout.width;
              setLayoutWidth(width);
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                display: item.success ? 'flex' : 'none',
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate: rotateInterpolate },
                ],
              }}
            >
              <MaterialCommunityIcons
                name="rocket-launch"
                color={colors.neutral[600]}
                size={24}
              />
            </Animated.View>
            <Animated.View
              style={{
                position: 'absolute',
                display: item.success ? 'none' : 'flex',
                transform: [
                  { translateX: crashPos.x },
                  { translateY: crashPos.y },
                  { rotate: '135deg' },
                ],
              }}
            >
              <MaterialCommunityIcons
                name="rocket-launch"
                size={24}
                color={colors.neutral[600]}
              />
            </Animated.View>
            <Text
              style={{ fontSize: 14, color: '#fff', fontFamily: 'SpaceMono' }}
            >
              {item.success ? 'Sucessfull' : 'Failed'}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
              paddingHorizontal: 10,
            }}
          >
            <DetailsText title="Name" value={item.name} />
            {/* <DetailsText title="Details" value={item.details || ''} /> */}
            <DetailsText title="Date" value={date} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: 5,
              }}
            >
              <DetailsText title="Time" value={time} />
              <MaterialCommunityIcons
                name="chevron-right"
                color={COLORS.text}
                size={30}
              />
            </View>
          </View>
        </Pressable>
      </LinearGradient>
    );
  },
  (prev, next) => prev.item.id === next.item.id
);

RenderItem.displayName = 'RenderItem';

export default RenderItem;

const DetailsText = ({ value, title }: { title: string; value: string }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        display: value ? 'flex' : 'none',
      }}
    >
      <ThemedText
        maxFontSizeMultiplier={1.2}
        style={{ ...styles.text, fontWeight: 'bold' }}
      >
        {title}:
      </ThemedText>
      <ThemedText
        maxFontSizeMultiplier={1.2}
        style={{ ...styles.text, flexShrink: 1 }}
        numberOfLines={1}
      >
        {value}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 360,
    borderRadius: 10,
    padding: 5,
    elevation: 5,
    paddingBottom: 20,
    overflow: 'visible',
  },
  imageWrapper: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 35 : 20,
    height: '75%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  text: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
  status: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: Platform.OS === 'ios' ? 0 : -15,
    paddingHorizontal: 15,
    height: 30,
  },
});
