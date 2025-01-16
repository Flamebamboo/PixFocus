// SegmentedControl.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '@/utils/color';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import PressableScale from './PressableScale';

const SegmentadControl = ({ selectedMode, setSelectedMode, onChange }) => {
  const offset = useDerivedValue(() => {
    return selectedMode === 'timeblock' ? 0 : 1;
  });

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    if (onChange) onChange(mode);
  };

  const backgroundStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: '90%',
    height: '80%',
    display: 'flex',
    backgroundColor: COLORS.secondaryBlue,
    borderRadius: 10,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    transform: [
      {
        translateX: withSpring(offset.value * 120, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        }),
      },
    ],
  }));

  const leftTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(offset.value, [0, 1], ['#000000', '#ffffff']),
    fontWeight: '600',
  }));

  const rightTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(offset.value, [0, 1], ['#ffffff', '#000000']),
    fontWeight: '600',
  }));

  const gesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX < 50 && selectedMode === 'pomodoro') {
      runOnJS(handleModeChange)('timeblock');
    } else if (event.translationX > -50 && selectedMode === 'timeblock') {
      runOnJS(handleModeChange)('pomodoro');
    }
  });

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <PressableScale onPress={() => handleModeChange('timeblock')} style={styles.button}>
          <Animated.View style={backgroundStyle} />
          <Animated.Text style={[styles.text, leftTextStyle]}>TimeBlock</Animated.Text>
        </PressableScale>

        <PressableScale onPress={() => handleModeChange('pomodoro')} style={styles.button}>
          <Animated.Text style={[styles.text, rightTextStyle]}>Pomodoro</Animated.Text>
        </PressableScale>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.blue,
    borderWidth: 5,
    borderColor: '#000',

    borderRadius: 12,
    flexDirection: 'row',
    width: 250,
    height: 60,

    borderCurve: 'continuous',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontSize: 15,
    letterSpacing: 0.3,
  },
});

export default SegmentadControl;
