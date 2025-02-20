import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import FocusShopDisplay from '../../../assets/images/FocusShopDisplay.png';
const { width, height } = Dimensions.get('window');
import { Image } from 'expo-image';
import COLORS from '@/utils/color';

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
    height: '60%', // Take up half the screen height
    marginTop: -30, // Pull the image up to compensate for SafeAreaView
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
    paddingHorizontal: 20,
    backgroundColor: COLORS.purple,
  },
  title: {
    fontSize: 24,
    marginTop: 40,
    marginBottom: 10,

    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
    fontFamily: 'PixelCodeMedium',

    color: '#fff',
  },
});
