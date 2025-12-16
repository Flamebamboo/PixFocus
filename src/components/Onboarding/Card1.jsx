import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withTiming, runOnJS } from 'react-native-reanimated';
import { TimerArt } from '../TimerArt/TimerArt';
import COLORS from '@/utils/color';
import TypewriterMessage from '../transition/TypeWriter';
const { width, height } = Dimensions.get('window');

// Responsive scaling factors
const isTablet = width >= 768;
const scale = width / 375; // Base scale on iPhone X width
const moderateScale = (size, factor = 0.5) => size + (scale - 1) * factor * size;

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
    paddingTop: height * 0.15,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: '#EFB6C8',
  },
  title: {
    fontSize: moderateScale(isTablet ? 36 : 28),
    marginBottom: moderateScale(10),
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
  },
  description: {
    fontSize: moderateScale(isTablet ? 20 : 16),
    textAlign: 'center',
    paddingHorizontal: width * 0.048,
    fontFamily: 'PixelCodeMedium',
    color: '#fff',
    marginBottom: moderateScale(10),
  },
  animatedNumber: {
    fontSize: moderateScale(isTablet ? 96 : 72),
    color: '#fff',
    fontFamily: 'PixelCode',
  },
});
