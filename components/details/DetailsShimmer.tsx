import { ShimmerPlaceholder } from '@/components/ShimmerPlaceHolder';
import { colors } from '@/components/ui/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedView } from '../ThemedView';

const DetailsShimmer = () => {
  return (
    <ThemedView style={{ ...StyleSheet.absoluteFillObject, zIndex: 999 }}>
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
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <ShimmerPlaceholder
            height={Dimensions.get('window').width}
            width={'100%'}
            borderRadius={5}
          />
          <ThemedView
            style={{
              flex: 1,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              marginTop: -20,
              overflow: 'hidden',
              zIndex: 9999,
            }}
          >
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 30,
                  gap: 20,
                  padding: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    maxWidth: 100,
                    justifyContent: 'center',
                  }}
                >
                  <ShimmerPlaceholder
                    width={'100%'}
                    height={'50%'}
                    borderRadius={5}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingTop: 20,
                    gap: 20,
                  }}
                >
                  <ShimmerPlaceholder
                    width={'90%'}
                    height={30}
                    borderRadius={10}
                  />
                  <ShimmerPlaceholder
                    width={'50%'}
                    height={30}
                    borderRadius={10}
                  />
                  <View style={styles.line} />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 10,
                      width: '90%',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        gap: 10,
                      }}
                    >
                      <ShimmerPlaceholder
                        width={'100%'}
                        height={20}
                        borderRadius={5}
                      />
                      <ShimmerPlaceholder
                        width={'100%'}
                        height={20}
                        borderRadius={5}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        gap: 10,
                      }}
                    >
                      <ShimmerPlaceholder
                        width={'100%'}
                        height={20}
                        borderRadius={5}
                      />
                      <ShimmerPlaceholder
                        width={'100%'}
                        height={20}
                        borderRadius={5}
                      />
                    </View>
                  </View>
                  <View style={styles.line} />
                </View>
              </View>
              <ThemedView
                style={{
                  borderRadius: 10,
                  width: '90%',
                  alignSelf: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  elevation: 5,
                  gap: 10,
                }}
              >
                {new Array(4).fill('').map((_, index) => (
                  <ShimmerPlaceholder
                    key={index}
                    width={'90%'}
                    height={20}
                    borderRadius={5}
                  />
                ))}
              </ThemedView>
            </LinearGradient>
          </ThemedView>
        </ScrollView>
      </LinearGradient>
    </ThemedView>
  );
};

export default DetailsShimmer;

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
  line: {
    padding: 0.5,
    backgroundColor: '#908f8fff',
    width: '90%',
  },
});
