import { View, Text, Dimensions, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedRef,
  runOnJS,
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";
import CustomButton from "@/components/Onboarding/CustomButton";
import { router } from "expo-router";
import Card1 from "@/components/Onboarding/Card1";
import Card2 from "@/components/Onboarding/Card2";
import Card3 from "@/components/Onboarding/Card3";
import Card4 from "@/components/Onboarding/Card4";
import { useGlobalContext } from "@/context/GlobalProvider";

const { width, height } = Dimensions.get("window");

export default function Onboarding() {
  const { firstLaunch } = useGlobalContext();
  const screenSize = useWindowDimensions();
  const animatedRef = useAnimatedRef();
  const scroll = useSharedValue(0);
  const [step, setStep] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scroll.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.x / width);
      runOnJS(setStep)(index); // Use runOnJS to call setStep thread issues shit
    },
  });

  const handleNextSlider = async () => {
    if (step < 3) {
      // 4 cards: 0 1, 2 3
      animatedRef.current.scrollTo({ x: width * (step + 1), animated: true });
    } else {
      await AsyncStorage.setItem("firstLaunch", "false");
    }
  };

  const Paginator = () => (
    <View style={styles.paginationContainer}>
      {[0, 1, 2, 3].map((i) => {
        // Adjust based on the number of cards
        const animatedDotStyle = useAnimatedStyle(() => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = interpolate(scroll.value, inputRange, [10, 20, 10], Extrapolate.CLAMP);
          const opacity = interpolate(scroll.value, inputRange, [0.3, 1, 0.3], Extrapolate.CLAMP);
          return {
            width: dotWidth,
            opacity,
          };
        });

        return <Animated.View style={[styles.dot, animatedDotStyle]} key={i.toString()} />;
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={animatedRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        <Card1 />
        <Card2 />
        <Card3 />
        <Card4 />
      </Animated.ScrollView>
      <Paginator />
      <View style={styles.button}>
        {step === 3 ? (
          <Animated.View
            entering={FadeInDown.duration(400)}
            exiting={FadeOut.duration(100)}
            style={{ paddingBottom: 30, marginTop: 20 }}
          >
            <CustomButton
              backgroundColor="#E9870E"
              label="Get Started"
              variant="solid"
              fontSize={20}
              leftIcon="sign-in"
              onPress={() => router.push("/(auth)/sign-up")}
            />
            <CustomButton
              fontSize={16}
              label="I ALREADY HAVE AN ACCOUNT"
              rightIcon="chevron-right"
              variant="transparent"
              onPress={() => router.push("/(auth)/sign-in")}
            />
          </Animated.View>
        ) : (
          <CustomButton
            backgroundColor="#E9870E"
            label="Next"
            variant="solid"
            fontSize={20}
            onPress={handleNextSlider}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 30,
    color: "#666",
  },
  paginationContainer: {
    flexDirection: "row",
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 120,
    width: "100%",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7C3FFF",
    marginHorizontal: 8,
  },
  button: {
    position: "absolute",
    bottom: 50,
    width: "80%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
