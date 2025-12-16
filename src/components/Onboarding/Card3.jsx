import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import FocusShopDisplay from '../../../assets/images/FocusShopDisplay.png';
const { width, height } = Dimensions.get('window');
import { Image } from 'expo-image';
import COLORS from '@/utils/color';

// Responsive scaling factors
const isTablet = width >= 768;
const scale = width / 375;
const moderateScale = (size, factor = 0.5) => size + (scale - 1) * factor * size;

export default function Card3() {
  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={FocusShopDisplay} contentFit="contain" />
      </View>
      <Text style={styles.title}>Designs to choose from</Text>
      <Text style={styles.description}>Earn coins based on focus durations</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '60%',
    marginTop: height * -0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: '#F8F2DF',
  },
  title: {
    fontSize: moderateScale(isTablet ? 32 : 24),
    marginTop: moderateScale(40),
    marginBottom: moderateScale(10),
    textAlign: 'center',
    color: '#000',
    fontFamily: 'PixelCodeBold',
  },
  description: {
    fontSize: moderateScale(isTablet ? 20 : 16),
    textAlign: 'center',
    paddingHorizontal: width * 0.08,
    fontFamily: 'PixelCodeMedium',
    color: '#000',
  },
});
