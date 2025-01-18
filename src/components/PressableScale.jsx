import { View, Text } from 'react-native';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useHaptics } from '@/hooks/useHaptics';

const PressableScale = ({ children, onPress, style }) => {
  const { triggerHaptic } = useHaptics();
  const scale = useSharedValue(1);

  // Separate the haptic feedback into regular functions
  const handlePressDown = () => {
    triggerHaptic('heavy');
  };

  const handlePressUp = () => {
    if (onPress) {
      triggerHaptic('medium');
      onPress();
    }
  };

  const gesture = Gesture.Tap()
    .onTouchesDown(() => {
      scale.value = withTiming(0.9);
      runOnJS(handlePressDown)();
    })
    .onTouchesUp(() => {
      runOnJS(handlePressUp)();
    })
    .onFinalize(() => {
      scale.value = withTiming(1);
    });

  const rButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, rButtonStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default PressableScale;
