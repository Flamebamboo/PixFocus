import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import FadeOutStats from '../../../assets/images/FadeOutStats.png';
import COLORS from '@/utils/color';
const { width, height } = Dimensions.get('window');

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
    paddingTop: 150,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.purple,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,

    textAlign: 'center',
    color: '#fff',
    fontFamily: 'ReadexProBold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
    color: '#fff',
    fontFamily: 'ReadexProRegular',
  },
});
