import { Image } from 'expo-image';
import React from 'react';
import { ImageStyle, StyleSheet } from 'react-native';

interface ProductImageProps {
  imageUrl?: string;
  staticSource?: number; // For require() statements
  style?: ImageStyle;
  size?: number;
  borderRadius?: number;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export default function ProductImage({ 
  imageUrl, 
  staticSource,
  style, 
  size = 80, 
  borderRadius = 8,
  contentFit = 'cover'
}: ProductImageProps) {
  const imageStyle = [
    styles.image,
    { 
      width: size, 
      height: size, 
      borderRadius 
    },
    style
  ];

  // Determine the source based on what's provided
  const source = staticSource || (imageUrl ? { uri: imageUrl } : undefined);

  return (
    <Image
      source={source}
      style={imageStyle}
      contentFit={contentFit}
      placeholder={require('@/assets/images/sales_logo.png')}
      transition={200}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#f0f0f0',
  },
}); 