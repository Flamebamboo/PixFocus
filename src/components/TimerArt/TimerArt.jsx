import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import CoffeeCupSvg from './variants/CoffeeCupSvg';
import Animations from './variants/Animations';
import COLORS from '@/utils/color';

// Future imports for other timer arts
// import StudyLampSvg from './variants/StudyLampSvg';
// import CodeEditorSvg from './variants/CodeEditorSvg';

const TimerArtVariants = {
  COFFEE_CUP: 'COFFEE_CUP',
  FIRE_CAMP: 'FIRE_CAMP',
};

//bg for the timer art depending on current variant in use we will let the home compoenet change background to this
const TimerColor = {
  COFFEE_CUP: { primary: COLORS.purple, secondary: '#fff' },
  FIRE_CAMP: { primary: '#27032a', secondary: '#fff' },
};

const TimerArt = ({ variant = 'COFFEE_CUP', progress, style, onColorChange }) => {
  // Memoize color calculations to prevent unnecessary updates
  const { primaryColor, secondaryColor } = useMemo(() => {
    const colorSet = TimerColor[variant] || TimerColor.COFFEE_CUP; // Provide fallback

    return {
      primaryColor: colorSet.primary,
      secondaryColor: colorSet.secondary,
    };
  }, [variant]);

  // Only trigger color change when colors actually change
  useEffect(() => {
    if (onColorChange) {
      onColorChange(primaryColor, secondaryColor);
    }
  }, [onColorChange]);

  const renderArt = () => {
    switch (variant) {
      case TimerArtVariants.COFFEE_CUP:
        return <CoffeeCupSvg progress={progress} />;
      case TimerArtVariants.FIRE_CAMP:
        return <Animations />;
      default:
        return <CoffeeCupSvg progress={progress} />;
    }
  };

  return <View style={[styles.container, style]}>{renderArt()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { TimerArt, TimerArtVariants };
