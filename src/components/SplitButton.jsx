import { View, useWindowDimensions, StyleSheet } from 'react-native';
import React from 'react';
import Animated, { withTiming, useAnimatedStyle } from 'react-native-reanimated';
import PressableScale from './PressableScale';
import useThemeStore from '@/store/themeStore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';

const SplitButton = ({ mainAction, leftAction, rightAction, splitted }) => {
  const { width: windowWidth } = useWindowDimensions();
  const colors = useThemeStore((state) => state.colors);

  const paddingHorizontal = 40;
  const gap = 10;
  const splittedButtonWidth = (windowWidth - paddingHorizontal * 2 - gap) / 2;

  const rLeftButtonStyle = useAnimatedStyle(
    () => ({
      width: withTiming(splitted ? splittedButtonWidth : 0),
      opacity: withTiming(splitted ? 1 : 0),
      backgroundColor: colors.accent,
      borderColor: colors.buttonBorder,
    }),
    [splitted, colors.accent, colors.buttonBorder]
  );

  const rMainButtonStyle = useAnimatedStyle(
    () => ({
      width: withTiming(splitted ? splittedButtonWidth : splittedButtonWidth * 2 + gap),
      marginLeft: withTiming(splitted ? gap : 0),
      backgroundColor: splitted ? colors.secondary : colors.accent,
      borderColor: colors.buttonBorder,
    }),
    [splitted, colors.accent, colors.secondary, colors.buttonBorder]
  );

  return (
    <View style={[styles.container, { paddingHorizontal }]}>
      <PressableScale onPress={leftAction.onPress} style={[styles.button, rLeftButtonStyle]}>
        <FontAwesomeIcon icon={faPlay} size={32} color={colors.iconFill} />
      </PressableScale>

      <PressableScale
        onPress={splitted ? rightAction.onPress : mainAction.onPress}
        style={[styles.button, rMainButtonStyle]}
      >
        {!splitted ? (
          <FontAwesomeIcon icon={faPause} size={32} color={colors.iconFill} />
        ) : (
          <FontAwesomeIcon icon={faStop} size={32} color={colors.iconFill} />
        )}
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'center',
  },
  button: {
    height: 70,
    justifyContent: 'center',
    borderRadius: 30,
    alignItems: 'center',
    overflow: 'hidden',
    borderCurve: 'continuous',
    borderWidth: 4,
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'ReadexProBold',
  },
});

export default SplitButton;
