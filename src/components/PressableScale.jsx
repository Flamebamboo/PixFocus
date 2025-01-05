import { View, Text } from 'react-native';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const triggerHapticSelection = () => {
  Haptics.selectionAsync();
};

const triggerHapticImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

const PressableScale = ({ children, onPress, style }) => {
  const scale = useSharedValue(1);
  const gesture = Gesture.Tap()
    .onTouchesDown(() => {
      scale.value = withTiming(0.9);
      runOnJS(triggerHapticSelection)();
    })
    .onTouchesUp(() => {
      if (onPress) {
        runOnJS(triggerHapticImpact)();
        runOnJS(onPress)();
      }
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
