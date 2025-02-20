import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Props interface
const CustomButton = ({
  label,
  onPress,
  variant = 'solid',
  width = 300,
  height = 50,
  leftIcon,
  fontSize = 16,
  fontFamily = 'PixelCodeBold',
  rightIcon,
  iconSize = 17,
  iconColor = '#ffffff',
  backgroundColor = '#004086',
  fontWeight,
  color,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variantStyles[variant],
        { backgroundColor: variant === 'solid' ? backgroundColor : 'transparent' },
        { width, height },
        style,
      ]}
    >
      {leftIcon && <FontAwesome name={leftIcon} size={iconSize} color={iconColor} style={styles.leftIcon} />}
      <Text style={[styles.buttonText, { fontFamily, fontSize, fontWeight, color }]}>{label}</Text>
      {rightIcon && <FontAwesome name={rightIcon} size={iconSize} color={iconColor} style={styles.rightIcon} />}
    </TouchableOpacity>
  );
};

const variantStyles = StyleSheet.create({
  solid: {},
  outline: {
    borderWidth: 4,
    borderColor: '#000',
  },
  transparent: {},
});

const styles = StyleSheet.create({
  button: {
    height: 70,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#ffffff',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default CustomButton;
