import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import Simpleandcute from '../../../assets/images/Simpleandcute.png';
import COLORS from '@/utils/color';
const { width, height } = Dimensions.get('window');

// Responsive scaling factors
const isTablet = width >= 768;
const scale = width / 375;
const moderateScale = (size, factor = 0.5) => size + (scale - 1) * factor * size;

export default function Card4() {
  return (
    <View style={styles.slide}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Simple and cute design</Text>
        <Text style={styles.description}>Add task, and fully customisable!</Text>
      </View>
      <View className="flex-1 w-full justify-center items-center mb-28">
        <Image style={styles.image} source={Simpleandcute} contentFit="contain" transition={1000} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '85%',
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: '#90AACB',
  },
  headerContainer: {
    marginTop: height * 0.08,
  },
  title: {
    fontSize: moderateScale(isTablet ? 32 : 24),
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
