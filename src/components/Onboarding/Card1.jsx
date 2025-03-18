import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withTiming, runOnJS } from 'react-native-reanimated';
import { TimerArt } from '../TimerArt/TimerArt';
import COLORS from '@/utils/color';
import TypewriterMessage from '../transition/TypeWriter';
const { width, height } = Dimensions.get('window');

export default function Card1() {
  const animatedValue = useSharedValue(26);
  const [currentNumber, setCurrentNumber] = useState(26);
  const [progress, setProgress] = useState(100);

  const animatedProps = useAnimatedProps(() => {
    runOnJS(setCurrentNumber)(Math.floor(animatedValue.value));
    runOnJS(setProgress)(25 - animatedValue.value);

    return {};
  });

  //when finish
  useEffect(() => {
    animatedValue.value = withTiming(0, { duration: 3000 }, () => {
      runOnJS(setCurrentNumber)((animatedValue.value = 25));
    });
  }, []);

  return (
    <View style={styles.slide}>
      <Text style={styles.title}>Pixel Art Visuals</Text>
      {/* <TypewriterMessage message={'Be more productive with cute pixel art visual timers'} color="white" /> */}
      <Text style={styles.description}>Be more productive with cute pixel art visual timers</Text>
      <View>
        <TimerArt progress={progress} />
      </View>

      <Animated.Text style={styles.animatedNumber} animatedProps={animatedProps}>
        {`${currentNumber}:00`}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    justifyContent: 'flex-start',
    paddingTop: 150,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#EFB6C8',
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 18,
    fontFamily: 'PixelCodeMedium',
    color: '#fff',
    marginBottom: 10,
  },
  animatedNumber: {
    fontSize: 72,
    color: '#fff',
    fontFamily: 'PixelCode',
  },
});
