import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions from design (iPhone sizes typically)
const baseWidth = 375;
const baseHeight = 812;

// Detect if device is a tablet
export const isTablet = () => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return (Platform.OS === 'ios' && Platform.isPad) || (Platform.OS === 'android' && aspectRatio < 1.6);
};

// Scale based on screen width
export const scale = (size) => {
  const scaleRatio = SCREEN_WIDTH / baseWidth;
  return size * scaleRatio;
};

// Scale based on screen height
export const verticalScale = (size) => {
  const scaleRatio = SCREEN_HEIGHT / baseHeight;
  return size * scaleRatio;
};

// Moderate scale - reduces scaling for very large screens
export const moderateScale = (size, factor = 0.5) => {
  const scaleRatio = SCREEN_WIDTH / baseWidth;
  return size + (scaleRatio - 1) * size * factor;
};

// Font scaling with tablet considerations
export const fontScale = (size) => {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;

  if (isTablet()) {
    // Limit font scaling on tablets to prevent too large fonts
    return Math.min(newSize, size * 1.3);
  }

  // Normalize for different pixel densities
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Get responsive dimensions
export const responsiveDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isTablet: isTablet(),
};

// Spacing utilities
export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
};

// Get snap points for bottom sheets based on device
export const getBottomSheetSnapPoints = (small, medium, large) => {
  if (isTablet()) {
    return [small || '40%', medium || '60%', large || '85%'];
  }
  return [small || '50%', medium || '70%', large || '95%'];
};

export default {
  scale,
  verticalScale,
  moderateScale,
  fontScale,
  isTablet,
  responsiveDimensions,
  spacing,
  getBottomSheetSnapPoints,
};
