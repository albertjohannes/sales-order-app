import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface BannerCarouselProps {
  banners: string[];
  autoPlayInterval?: number;
}

export default function BannerCarousel({ 
  banners, 
  autoPlayInterval = 3000 
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoPlayRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex]);

  const startAutoPlay = () => {
    autoPlayRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, autoPlayInterval);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleManualScroll = (index: number) => {
    setCurrentIndex(index);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const handleScrollBeginDrag = () => {
    stopAutoPlay();
  };

  const handleScrollEndDrag = () => {
    startAutoPlay();
  };

  const renderBanner = ({ item }: { item: string }) => (
    <View style={styles.bannerContainer}>
      <Image
        source={item}
        style={styles.bannerImage}
        contentFit="cover"
        transition={200}
      />
    </View>
  );

  const renderDot = (index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.dot,
        currentIndex === index && styles.activeDot,
      ]}
      onPress={() => handleManualScroll(index)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentIndex(index);
        }}
      />
      
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  bannerContainer: {
    width: screenWidth - 24,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 24,
  },
}); 