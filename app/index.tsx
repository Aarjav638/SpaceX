import RenderItem from '@/components/home/FlatlistRenderItem';
import HomeShimmer from '@/components/home/HomeShimmer';
import Exit from '@/components/modals/Exit';
import { ShimmerPlaceholder } from '@/components/ShimmerPlaceHolder';
import { ThemedText } from '@/components/ThemedText';
import useDebounce from '@/hooks/useDebounce';
import { getLaunpads } from '@/lib';
import { Launch, LaunchesResponse } from '@/types/launcehs';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Home = () => {
  const [launchData, setLaunchData] = useState<LaunchesResponse | null>(null);
  const [loading, setloading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [exitAttempt, setExitAttempt] = useState(false);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const isSearching = debouncedSearchQuery.trim().length > 0;
  const displayData = useMemo(() => {
    if (!searchQuery) return launchData?.docs ?? [];
    const q = debouncedSearchQuery.toLowerCase();
    return (launchData?.docs ?? []).filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [searchQuery, launchData?.docs, debouncedSearchQuery]);

  const hasMore = launchData && launchData.hasNextPage ? true : false;
  const handleLoadMore = useCallback(async () => {
    if (isSearching || !hasMore || loadingRef.current) return;

    loadingRef.current = true;
    setFooterLoading(true);

    const nextPage = pageRef.current + 1;

    try {
      const data = await getLaunpads(nextPage);
      pageRef.current = nextPage;
      setLaunchData((prev) => {
        const existingIds = new Set(prev?.docs.map((d) => d.id));
        const newDocs = data.docs.filter((doc) => !existingIds.has(doc.id));
        return {
          ...data,
          docs: [...(prev?.docs ?? []), ...newDocs],
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(
          'Error Getting Details of launches',
          ToastAndroid.SHORT
        );
      }
    } finally {
      loadingRef.current = false;
      setFooterLoading(false);
    }
  }, [hasMore, isSearching]);

  const handleRefresh = useCallback(async () => {
    if (!loading) {
      try {
        setLaunchData(null);
        setRefreshing(true);
        pageRef.current = 1;
        const data = await getLaunpads(1);
        setLaunchData(data);
      } catch (error) {
        if (error instanceof Error) {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(
            'Error Getting Details of launches',
            ToastAndroid.SHORT
          );
        }
      } finally {
        setRefreshing(false);
      }
    }
  }, [loading]);

  const RenderFlatListItems = useCallback(
    ({ item, index }: { item: Launch; index: number }) => {
      return <RenderItem item={item} index={index} />;
    },
    []
  );

  const ListFooterComponent = useCallback(() => {
    if (footerLoading && hasMore) {
      return <ShimmerPlaceholder height={50} width={'100%'} borderRadius={5} />;
    }
    if (!footerLoading && !hasMore) {
      return (
        <View
          style={{
            ...styles.container,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemedText
            style={{
              fontFamily: 'SpaceMono',
              fontSize: 15,
              fontWeight: '500',
            }}
          >
            No More Data Available
          </ThemedText>
        </View>
      );
    }
    return null;
  }, [footerLoading, hasMore]);

  const ListEmptyComponent = useCallback(
    () => (
      <View
        style={{
          ...styles.container,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedText>NO DATA FOUND</ThemedText>
      </View>
    ),
    []
  );

  const handleExit = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (Platform.OS === 'android') {
      // Use performAndroidHapticsAsync for better vibration on Android
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
    }
    BackHandler.exitApp();
  };
  useEffect(() => {
    getLaunpads()
      .then((data) => setLaunchData(data))
      .catch((error) => {
        if (error instanceof Error) {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(
            'Error Getting Details of launches',
            ToastAndroid.SHORT
          );
        }
      })
      .finally(() => {
        setloading(false);
      });
  }, []);
  useFocusEffect(
    useCallback(() => {
      const listner = BackHandler.addEventListener('hardwareBackPress', () => {
        if (searchQuery.trim()) {
          setSearchQuery('');
          return true;
        }
        setExitAttempt(true);
        return true;
      });
      return () => {
        listner.remove();
      };
    }, [searchQuery])
  );

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
      <SafeAreaView style={styles.container}>
        {(loading || refreshing) && pageRef.current === 1 && <HomeShimmer />}
        {exitAttempt && (
          <Exit
            onRequestClose={() => {
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              } else if (Platform.OS === 'android') {
                // Use performAndroidHapticsAsync for better vibration on Android
                Haptics.performAndroidHapticsAsync(
                  Haptics.AndroidHaptics.Long_Press
                );
              }
              setExitAttempt(false);
            }}
            visible={exitAttempt}
            handleExit={handleExit}
          />
        )}
        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            justifyContent: 'space-between',
            borderRadius: 5,
            borderWidth: 1,
            alignItems: 'center',
            paddingRight: 10,
            // margin: 10,
            backgroundColor: '#fff',
            borderColor: 'rgba(221, 221, 221, 1)',
          }}
        >
          <TextInput
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            style={{ flex: 1, fontFamily: 'SpaceMono' }}
            placeholder="Search Misson..."
            cursorColor={'black'}
            placeholderTextColor={'#7a7878ff'}
            onPress={() => {
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              } else if (Platform.OS === 'android') {
                // Use performAndroidHapticsAsync for better vibration on Android
                Haptics.performAndroidHapticsAsync(
                  Haptics.AndroidHaptics.Long_Press
                );
              }
            }}
          />
          <Ionicons name="search" size={20} color={'#7a7878ff'} />
        </View>
        <FlatList
          data={displayData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={10}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={RenderFlatListItems}
          scrollEventThrottle={16}
          ListFooterComponent={ListFooterComponent}
          style={{ flex: 1 }}
          contentContainerStyle={{
            ...styles.contentConatinerStyle,
            flexGrow: displayData.length > 0 ? undefined : 1,
          }}
          getItemLayout={(_, index) => ({
            length: 360,
            offset: 360 * index,
            index,
          })}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
          }
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 20,
  },
  contentConatinerStyle: {
    paddingVertical: 20,
    gap: 40,
    padding: 10,
  },
});
