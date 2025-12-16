import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import FadeOutStats from '../../../assets/images/FadeOutStats.png';
import COLORS from '@/utils/color';
const { width, height } = Dimensions.get('window');

// Responsive scaling factors
const isTablet = width >= 768;
const scale = width / 375;
const moderateScale = (size, factor = 0.5) => size + (scale - 1) * factor * size;

export default function Card2() {
  return (
    <View style={styles.slide}>
      <Text style={styles.title}>Analyse session stats</Text>
      <Text style={styles.description}>How many hours did you lock in?</Text>
      <Image style={styles.image} source={FadeOutStats} contentFit="contain" transition={1000} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
  slide: {
    width,
    height,
    justifyContent: 'flex-start',
    paddingTop: height * 0.15,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: COLORS.purple,
  },
  title: {
    fontSize: moderateScale(isTablet ? 32 : 25),
    marginBottom: moderateScale(10),
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
  },
  description: {
    fontSize: moderateScale(isTablet ? 20 : 16),
    textAlign: 'center',
    paddingHorizontal: width * 0.08,
    color: '#fff',
    fontFamily: 'PixelCodeMedium',
  },
});
