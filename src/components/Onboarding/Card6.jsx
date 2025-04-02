import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import COLORS from '@/utils/color';
const { width, height } = Dimensions.get('window');
import useNotifications from '@/hooks/useNotifications';

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
    justifyContent: 'flex-start', // Changed from center to flex-start
    alignItems: 'center',
    backgroundColor: COLORS.purple,
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: '65%',
    left: '60%',
  },
  headerContainer: {
    width: '100%',
    paddingTop: 80, // Add space at the top
    marginBottom: 20,
    alignItems: 'center',
  },
  box: {
    width: 350,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderRadius: 20,
    // Position in center of screen where system alerts typically appear
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -175, // Half of width
    marginTop: -125, // Half of height
    borderColor: '#fff',
    // Now this box is empty and just positioned where the alert will appear
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PixelCodeBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  notificationImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
    color: '#fff',
    fontFamily: 'PixelCodeMedium',
  },
});
