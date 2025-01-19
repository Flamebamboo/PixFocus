import COLORS from "@/utils/color";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Vibration } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeInUp,
  BounceInUp,
} from "react-native-reanimated";
import useMessageStore from "@/store/messageStatus";
import TypewriterMessage from "@/components/transition/TypeWriter";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PressableScale from "@/components/PressableScale";
import { useHaptics } from "@/hooks/useHaptics";

const { width, height } = Dimensions.get("window");
const PARTICLE_COUNT = 30; // Increased particle count
const PARTICLE_SIZE = 15; // Increased particle size
const VIBRATION_PATTERN = [0, 100, 50, 100, 50, 100, 50, 100];

const Particle = ({ delay, onParticleComplete }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * Math.min(width, height) * 0.8; // Increased spread

    translateX.value = withDelay(
      delay,
      withTiming(Math.cos(angle) * distance, {
        duration: 800, // Increased duration
        easing: Easing.out(Easing.cubic),
      })
    );
    translateY.value = withDelay(
      delay,
      withTiming(Math.sin(angle) * distance, {
        duration: 800, // Increased duration
        easing: Easing.out(Easing.cubic),
      })
    );
    scale.value = withDelay(
      delay,
      withTiming(Math.random() * 2 + 1, {
        // Random scale between 1-3
        duration: 800,
        easing: Easing.out(Easing.cubic),
      })
    );

    opacity.value = withDelay(
      delay + 600, // Adjusted delay for longer visibility
      withTiming(0, {
        duration: 400,
        easing: Easing.in(Easing.cubic),
      })
    );

    // Updated haptic feedback
    const triggerParticleHaptic = async () => {
      await triggerHaptic("heavy");
    };

    triggerParticleHaptic();
    const interval = setInterval(triggerParticleHaptic, 150);

    // Stop haptics after particle animation
    const timeout = setTimeout(() => {
      clearInterval(interval);
      onParticleComplete?.();
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [delay, translateX, translateY, scale, opacity, triggerHaptic]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.particle, animatedStyle]} />;
};

const ExitLoading = () => {
  const backgroundOpacity = useSharedValue(0);
  const message = useMessageStore((state) => state.message);
  const [showMessage, setShowMessage] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    backgroundOpacity.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.cubic) });
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 800);
    return () => {
      clearTimeout(timer);
      Vibration.cancel();
    };
  }, [backgroundOpacity]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const handleMessageComplete = () => {
    setShowDoneButton(true);
  };

  const handleDonePress = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View style={[styles.background, backgroundStyle]} />
        {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
          <Particle
            key={index}
            delay={index * 20}
            onParticleComplete={() => {
              if (index === PARTICLE_COUNT - 1) {
                triggerHaptic("success");
              }
            }}
          />
        ))}
        {showMessage && (
          <View style={styles.messageContainer}>
            <Animated.View entering={FadeInUp}>
              <TypewriterMessage message={message} onComplete={handleMessageComplete} />
              {showDoneButton && (
                <Animated.View entering={BounceInUp}>
                  <PressableScale style={styles.doneButton} onPress={handleDonePress}>
                    <Text style={styles.doneButtonText}>Continue</Text>
                  </PressableScale>
                </Animated.View>
              )}
            </Animated.View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondaryYellow,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.secondaryYellow,
  },
  particle: {
    position: "absolute",
    width: PARTICLE_SIZE,
    height: PARTICLE_SIZE,
    backgroundColor: COLORS.orange,
  },
  messageContainer: {
    position: "absolute",
    alignItems: "center",
    width: "90%",
    backgroundColor: COLORS.secondaryYellow,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#000",
  },
  doneButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#000",
  },
  doneButtonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "ReadexProBold",
    textAlign: "center",
  },
});

export default ExitLoading;
