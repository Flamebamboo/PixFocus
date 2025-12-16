import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import COLORS from '@/utils/color';
const { width, height } = Dimensions.get('window');
import useNotifications from '@/hooks/useNotifications';

// Responsive scaling factors
const isTablet = width >= 768;
const scale = width / 375;
const moderateScale = (size, factor = 0.5) => size + (scale - 1) * factor * size;

export default function Card6({ isActive }) {
  const notifications = useNotifications();
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    // Request permission once when the component mounts
    const requestPermission = async () => {
      if (isActive && !permissionRequested) {
        await notifications.checkAndRequestNotificationPermission();
        setPermissionRequested(true);
      }
    };

    requestPermission();
  }, [isActive, permissionRequested]);

  return (
    <View style={styles.slide}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Turn On Notifications!</Text>
        <Text style={styles.description}>PixFocus will alert you when your timer ends!</Text>
      </View>

      <View style={styles.box}>{/* This box is empty, just positioned where the alert will appear */}</View>
      <Image source={require('../../../assets/icons/arrow.png')} style={styles.arrow} contentFit="contain"></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
  slide: {
    width,
    height,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.purple,
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    width: moderateScale(isTablet ? 120 : 100),
    height: moderateScale(isTablet ? 120 : 100),
    top: '65%',
    left: '60%',
  },
  headerContainer: {
    width: '100%',
    paddingTop: height * 0.1,
    marginBottom: moderateScale(20),
    alignItems: 'center',
  },
  box: {
    width: width * 0.85,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: moderateScale(4),
    borderRadius: moderateScale(20),
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -(width * 0.85) / 2,
    marginTop: -(height * 0.25) / 2,
    borderColor: '#fff',
  },
  infoText: {
    color: '#fff',
    fontSize: moderateScale(isTablet ? 22 : 18),
    fontFamily: 'PixelCodeBold',
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  notificationImage: {
    width: moderateScale(isTablet ? 120 : 100),
    height: moderateScale(isTablet ? 120 : 100),
  },
  title: {
    fontSize: moderateScale(isTablet ? 32 : 24),
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
    marginBottom: moderateScale(10),
  },
  description: {
    fontSize: moderateScale(isTablet ? 20 : 16),
    textAlign: 'center',
    paddingHorizontal: width * 0.08,
    color: '#fff',
    fontFamily: 'PixelCodeMedium',
  },
});
