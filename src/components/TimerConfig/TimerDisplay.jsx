import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatTimeDisplay } from '@/utils/timeFormat';
import { fontScale } from '@/utils/responsive';

export const TimerDisplay = ({ time, color }) => (
  <Text style={[styles.timerDisplay, { color }]}>{formatTimeDisplay(time)}</Text>
);

const styles = StyleSheet.create({
  timerDisplay: {
    fontSize: fontScale(64),
    marginBottom: 30,
    fontFamily: 'PixelCodeLight',
  },
});
