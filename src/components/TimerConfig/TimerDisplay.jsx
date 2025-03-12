import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatTimeDisplay } from '@/utils/timeFormat';

export const TimerDisplay = ({ time, color }) => (
  <Text style={[styles.timerDisplay, { color }]}>{formatTimeDisplay(time)}</Text>
);

const styles = StyleSheet.create({
  timerDisplay: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'PixelCode',
  },
});
