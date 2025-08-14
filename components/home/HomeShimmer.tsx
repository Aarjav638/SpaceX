import { ShimmerPlaceholder } from '@/components/ShimmerPlaceHolder';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/components/ui/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const HomeShimmer = () => {
  return (
    <ThemedView
      style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
      }}
    >
      <ScrollView
        contentContainerStyle={{ paddingVertical: '15%', padding: 10, gap: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <ShimmerPlaceholder height={40} width={'100%'} borderRadius={5} />
        {new Array(3).fill('').map((_, index) => (
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
            key={index}
          >
            <View style={styles.imageWrapper}>
              <ShimmerPlaceholder
                width={'100%'}
                height={'100%'}
                borderRadius={0}
              />
            </View>
            <View style={styles.status}>
              <ShimmerPlaceholder
                height={'100%'}
                width={80}
                borderRadius={10}
              />
            </View>
            <ShimmerPlaceholder height={25} width={'90%'} borderRadius={5} />
            <ShimmerPlaceholder height={25} width={'90%'} borderRadius={5} />
            <ShimmerPlaceholder height={25} width={'90%'} borderRadius={5} />
          </LinearGradient>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

export default HomeShimmer;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    gap: 10,
    borderRadius: 10,
    padding: 5,
    backgroundColor: colors.primary[400],
    elevation: 5,
    paddingBottom: 20,
  },
  imageWrapper: {
    width: '100%',
    height: 250,
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
    top: -15,
    paddingHorizontal: 15,
    height: 30,
  },
});
