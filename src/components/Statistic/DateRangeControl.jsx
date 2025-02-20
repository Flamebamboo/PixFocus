import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import PressableScale from '../PressableScale';

const DateRangeControl = ({ selectedRange, setSelectedRange }) => {
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

  const offset = useDerivedValue(() => getRangeOffset(selectedRange));

  const { width } = useWindowDimensions();
  const containerWidth = width * 0.85;
  const buttonWidth = containerWidth / 4;

  const backgroundStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 1,

    width: buttonWidth - 1,
    height: 40,
    backgroundColor: '#F6EA96',
    borderRadius: 250,
    borderColor: '#000',
    borderWidth: 4,
    transform: [
      {
        translateX: withSpring(Math.min(offset.value, 2.89) * buttonWidth + 1, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        }),
      },
    ],
  }));

  const getTextStyle = (position) =>
    useAnimatedStyle(() => ({
      color: offset.value === '#000000',
      fontWeight: '600',
    }));

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Animated.View style={backgroundStyle} />
      {['Day', 'Week', 'Month', 'Year'].map((range, index) => (
        <PressableScale key={range} onPress={() => setSelectedRange(range.toLowerCase())} style={styles.button}>
          <Animated.Text style={[styles.text, getTextStyle(index)]}>{range}</Animated.Text>
        </PressableScale>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#000',
    overflow: 'hidden',
    position: 'relative',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'PixelCodeBold',
    zIndex: 1,
    fontSize: 16,
  },
});

export default DateRangeControl;
