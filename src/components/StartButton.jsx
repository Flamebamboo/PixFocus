import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PressableScale from './PressableScale';
import COLORS from '@/utils/color';
import { moderateScale, fontScale } from '@/utils/responsive';

const StartButton = ({ text, onPress }) => {
  return (
    <View style={styles.container}>
      <PressableScale style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{text || 'Start'}</Text>
      </PressableScale>
    </View>
  );
};

export default StartButton;

const styles = StyleSheet.create({
  container: {
    width: '70%',
    maxWidth: moderateScale(400),
    justifyContent: 'center',
  },
  button: {
    height: moderateScale(70),
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    borderWidth: 4,
    borderRadius: moderateScale(35),
    alignItems: 'center',
    overflow: 'hidden',
  },

  text: {
    fontFamily: 'PixelCodeBold',
    fontSize: fontScale(18),
  },
});
