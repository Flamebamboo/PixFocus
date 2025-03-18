import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import Simpleandcute from '../../../assets/images/Simpleandcute.png';
import COLORS from '@/utils/color';
const { width, height } = Dimensions.get('window');

export default function Card4() {
  return (
    <View style={styles.slide}>
      <View className="mt-20">
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
    paddingHorizontal: 20,

    backgroundColor: '#90AACB',
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
