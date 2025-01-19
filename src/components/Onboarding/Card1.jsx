import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { useSharedValue, useAnimatedProps, withTiming, runOnJS } from "react-native-reanimated";
import { TimerArt } from "../TimerArt/TimerArt";

const { width, height } = Dimensions.get("window");

export default function Card1() {
  const [bgColor, setBgColor] = useState("#000");
  const handleBg = (color) => {
    setBgColor(color);
  };

  const animatedValue = useSharedValue(26);
  const [currentNumber, setCurrentNumber] = useState(26);
  const [progress, setProgress] = useState(100);

  const animatedProps = useAnimatedProps(() => {
    runOnJS(setCurrentNumber)(Math.floor(animatedValue.value));
    runOnJS(setProgress)(25 - animatedValue.value);

    return {};
  });

  //when finish
  useEffect(() => {
    animatedValue.value = withTiming(0, { duration: 3000 }, () => {
      runOnJS(setCurrentNumber)((animatedValue.value = 25));
    });
  }, []);

  return (
    <View style={styles.slide}>
      <Text style={styles.title}>Welcome to PixFocus</Text>
      <Text style={styles.description}>Be more productive with pixel art visual timers</Text>
      <View>
        <TimerArt onColorChange={handleBg} progress={progress} />
      </View>

      <Animated.Text style={styles.animatedNumber} animatedProps={animatedProps}>
        {`${currentNumber}:00`}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    justifyContent: "flex-start",
    paddingTop: 150,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#2F1818",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
    fontFamily: "BhalooBold",
  },
  description: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 30,
    color: "#fff",
  },
  animatedNumber: {
    fontSize: 85,
    color: "#fff",
    fontFamily: "BhalooBold",
  },
});
