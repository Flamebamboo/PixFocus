import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import CoffeeCupSvg from './variants/CoffeeCupSvg';
import Animations from './variants/Animations';
import useThemeStore from '@/store/themeStore';
import COLORS from '@/utils/color';
import { moderateScale, isTablet } from '@/utils/responsive';

const TimerArtVariants = {
  COFFEE_CUP: 'COFFEE_CUP',
  FIRE_CAMP: 'FIRE_CAMP',
  OWL: 'OWL',
  RABBIT: 'RABBIT',
};

//bg for the timer art depending on current variant in use we will let the home compoenet change background to this
// const TimerColor = {
//   COFFEE_CUP: { primary: '#EFB6C8', secondary: '#A888B5', accent: '#FFF', text: '#fff' },
//   FIRE_CAMP: { primary: '#241515', secondary: '#F4D793', accent: '#A94A4A', text: '#FFF6DA' },

// };

const TimerArt = ({ variant = 'COFFEE_CUP', progress, style }) => {
  // const colorSet = useMemo(() => TimerColor[variant], [variant]);

  // useEffect(() => {
  //   if (onColorChange) {
  //     onColorChange(colorSet);
  //   }
  // }, [variant, onColorChange, colorSet]);

  // more better lah babi
  useEffect(() => {
    useThemeStore.getState().setTheme(variant);
  }, [variant]);

  const renderArt = () => {
    switch (variant) {
      case TimerArtVariants.COFFEE_CUP:
        return <CoffeeCupSvg progress={progress} />;
      case TimerArtVariants.FIRE_CAMP:
      case TimerArtVariants.OWL:
      case TimerArtVariants.RABBIT:
        return <Animations type={variant} />;
      default:
        return <CoffeeCupSvg progress={progress} />;
    }
  };

  return <View style={[styles.container, style]}>{renderArt()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: isTablet() ? moderateScale(300) : moderateScale(200),
    height: isTablet() ? moderateScale(300) : moderateScale(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { TimerArt, TimerArtVariants };
