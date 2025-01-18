import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import COLORS from '@/utils/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function EnterLoading() {
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    // Random duration between 2-3 seconds
    const duration = Math.random() * 5000 + 2000;

    // Infinite pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 600, easing: Easing.in(Easing.cubic) })
      ),
      -1, // -1 means infinite repetition
      true // reverse animation
    );

    // Progress animation
    progress.value = withTiming(1, {
      duration,
      easing: Easing.inOut(Easing.cubic),
    });

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Navigate after animation completes
    const timer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(focus)/focus-timer');
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View style={[styles.circle, pulseStyle]} />
        {showMessage && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Preparing your focus session...</Text>
            <View style={styles.progressContainer}>
              <Animated.View style={[styles.progressBar, progressStyle]} />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondaryYellow,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.orange,
    borderWidth: 4,
    marginBottom: 40,
    borderColor: '#000',
  },
  messageContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: '90%',
    backgroundColor: COLORS.secondaryYellow,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    bottom: '20%',
  },
  messageText: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'ReadexProBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.orange,
    borderRadius: 4,
  },
});
