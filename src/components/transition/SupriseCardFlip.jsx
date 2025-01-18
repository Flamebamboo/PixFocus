import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const SurpriseCardFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const flipCard = () => {
    const newValue = isFlipped ? 0 : 180;
    rotation.value = withSequence(
      withTiming(newValue, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      withDelay(300, withTiming(newValue, { duration: 0 }))
    );
    scale.value = withSequence(
      withTiming(1.1, { duration: 150, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) })
    );
    translateY.value = withSequence(
      withTiming(-30, { duration: 150, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 150, easing: Easing.inOut(Easing.ease) })
    );
    runOnJS(setIsFlipped)(!isFlipped);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` },
        { scale: scale.value },
        { translateY: translateY.value },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg` },
        { scale: scale.value },
        { translateY: translateY.value },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  return (
    <Pressable onPress={flipCard} style={styles.container}>
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <Text style={styles.title}>Surprise!</Text>
        <Feather name="gift" size={64} color="#FFFFFF" />
        <Text style={styles.subtitle}>Tap to reveal</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.title}>Congratulations!</Text>
        <Feather name="award" size={64} color="#FFFFFF" />
        <Text style={styles.subtitle}>You've unlocked a secret</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  cardFront: {
    backgroundColor: '#FF6B6B',
  },
  cardBack: {
    backgroundColor: '#4ECDC4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 20,
  },
});

export default SurpriseCardFlip;
