import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import PressableScale from './PressableScale';

const DateRangeControl = ({ selectedRange, setSelectedRange }) => {
  const { width } = useWindowDimensions(); // Get screen width

  const getRangeOffset = (range) => {
    'worklet';
    switch (range) {
      case 'day':
        return 0;
      case 'week':
        return 1;
      case 'month':
        return 2;
      case 'year':
        return 3;
      default:
        return 0;
    }
  };

  const offset = useDerivedValue(() => {
    return getRangeOffset(selectedRange);
  }, [selectedRange]);

  // Calculate container width and button width
  const containerWidth = width * 0.85; // 90% of screen width
  const buttonWidth = containerWidth / 4; // Divide by 4 for each button

  const backgroundStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: buttonWidth,
    height: '100%',
    top: '10%',
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 5,
    transform: [
      {
        translateX: withSpring(offset.value * buttonWidth, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        }),
      },
    ],
  }));

  const getTextStyle = (position) =>
    useAnimatedStyle(() => ({
      color: interpolateColor(
        offset.value,
        [0, 1, 2, 3],
        [
          position === 0 ? '#000000' : '#ffffff',
          position === 1 ? '#000000' : '#ffffff',
          position === 2 ? '#000000' : '#ffffff',
          position === 3 ? '#000000' : '#ffffff',
        ]
      ),
      fontWeight: '600',
    }));

  const gesture = Gesture.Pan().onEnd((event) => {
    const currentIndex = getRangeOffset(selectedRange);
    const ranges = ['day', 'week', 'month', 'year'];

    if (event.translationX > 50 && currentIndex > 0) {
      runOnJS(setSelectedRange)(ranges[currentIndex - 1]);
    } else if (event.translationX < -50 && currentIndex < 3) {
      runOnJS(setSelectedRange)(ranges[currentIndex + 1]);
    }
  });

  // Calculate responsive font size
  const fontSize = Math.min(width * 0.04, 18); // Cap at 18

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.container, { width: containerWidth }]}>
        <Animated.View style={backgroundStyle} />

        <PressableScale onPress={() => setSelectedRange('day')} style={styles.button}>
          <Animated.Text style={[styles.text, getTextStyle(0), { fontSize }]}>Day</Animated.Text>
        </PressableScale>

        <PressableScale onPress={() => setSelectedRange('week')} style={styles.button}>
          <Animated.Text style={[styles.text, getTextStyle(1), { fontSize }]}>Week</Animated.Text>
        </PressableScale>

        <PressableScale onPress={() => setSelectedRange('month')} style={styles.button}>
          <Animated.Text style={[styles.text, getTextStyle(2), { fontSize }]}>Month</Animated.Text>
        </PressableScale>

        <PressableScale onPress={() => setSelectedRange('year')} style={styles.button}>
          <Animated.Text style={[styles.text, getTextStyle(3), { fontSize }]}>Year</Animated.Text>
        </PressableScale>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2C',
    padding: 4,
    borderRadius: 30,
    flexDirection: 'row',
    height: 50,
    position: 'relative',
    alignSelf: 'center', // Center the container horizontally
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontSize: 18,
    letterSpacing: 0.3,
    fontFamily: 'PixelifySans',
  },
});

export default DateRangeControl;
