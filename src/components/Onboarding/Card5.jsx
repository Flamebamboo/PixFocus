import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import SwitchBetweenModes from '../../../assets/images/SwitchBetweenModes.png';
import COLORS from '@/utils/color';
const { width, height } = Dimensions.get('window');

export default function Card5() {
  return (
    <View style={styles.slide}>
      <View className="flex-1 w-full justify-center items-center mt-16">
        <Image style={styles.image} source={SwitchBetweenModes} contentFit="contain" transition={1000} />
      </View>
      <View className="mb-40">
        <Text style={styles.title}>Switch between modes</Text>
        <Text style={styles.description}>Pomodoro technique and also timeblock!</Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.purple,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
    color: '#fff',
    fontFamily: 'PixelCodeMedium',
  },
});
