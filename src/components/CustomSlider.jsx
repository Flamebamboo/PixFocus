import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import React, { useState, useMemo } from 'react';
import COLORS from '@/utils/color';
import trackImage from 'assets/images/Rectangle.png';
import thumbImage from 'assets/images/Thumb.png';
// Move image requires outside component to prevent recreation

const CustomSlider = ({ label, minVal, maxVal, step, onValueChange, value }) => {
  // Memoize slider props to prevent unnecessary rerenders
  const sliderProps = useMemo(
    () => ({
      minimumValue: minVal,
      maximumValue: maxVal,
      step: step,
      thumbImage: thumbImage,
      trackImage: trackImage,
      onValueChange: onValueChange,
      minimumTrackTintColor: COLORS.blue,
      maximumTrackTintColor: COLORS.yellow,
      value: value,
    }),
    [minVal, maxVal, step, onValueChange, value]
  );

  return (
    <View>
      <Text style={{ fontFamily: 'PixelCode' }} className="text-black text-xl mb-4 ">
        {label}: <Text style={{ fontFamily: 'PixelCodeBold' }}>{value && +value.toFixed(2)}</Text>
      </Text>
      <View className="w-full flex items-center">
        <Slider style={styles.slider} {...sliderProps} />
      </View>
    </View>
  );
};

export default React.memo(CustomSlider);

const styles = StyleSheet.create({
  slider: {
    width: 330,
  },
});
