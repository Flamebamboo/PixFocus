import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import COLORS from '@/utils/color';

const { width, height } = Dimensions.get('window');
const circleSize = Math.max(width, height) * 2;

const RippleCircle = ({ onAnimationEnd }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) })
    );

    const timeoutId = setTimeout(() => {
      runOnJS(onAnimationEnd)();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [scale, onAnimationEnd]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.circle, animatedStyle]} />;
};

const RippleEffect = ({ onAnimationEnd }) => {
  return (
    <View style={styles.container}>
      <RippleCircle delay={0} onAnimationEnd={onAnimationEnd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: COLORS.orange,
  },
});

export default RippleEffect;
