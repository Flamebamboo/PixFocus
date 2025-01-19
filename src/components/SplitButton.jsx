import { View, Text, useWindowDimensions, StyleSheet, Pressable } from "react-native";
import React from "react";
import Animated, { withTiming, useAnimatedStyle } from "react-native-reanimated";
import PressableScale from "./PressableScale";
import COLORS from "@/utils/color";

const SplitButton = ({ mainAction, leftAction, rightAction, splitted, label }) => {
  const { width: windowWidth } = useWindowDimensions();

  const paddingHorizontal = 20;
  const gap = 10;
  const splittedButtonWidth = (windowWidth - paddingHorizontal * 2 - gap) / 2;

  const rLeftButtonStyle = useAnimatedStyle(() => {
    const leftButtonWidth = splitted ? splittedButtonWidth : 0;
    return {
      width: withTiming(leftButtonWidth),
      opacity: withTiming(splitted ? 1 : 0),
    };
  }, [splitted]);

  const rMainButtonStyle = useAnimatedStyle(() => {
    const mainButtonWidth = splitted ? splittedButtonWidth : splittedButtonWidth * 2 + gap;
    return {
      width: withTiming(mainButtonWidth),
      marginLeft: withTiming(splitted ? gap : 0),
      backgroundColor: withTiming(splitted ? COLORS.orange : "#fff"),
    };
  }, [splitted]);

  const rMainTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 0 : 1),
      marginLeft: withTiming(splitted ? gap : 0),
    };
  }, [splitted]);

  const rRightTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 1 : 0),
    };
  }, [splitted]);

  const rLeftTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(splitted ? 1 : 0, {
        duration: 150,
      }),
    };
  }, [splitted]);

  return (
    <View style={[styles.container, { paddingHorizontal }]}>
      <PressableScale onPress={leftAction.onPress} style={[styles.button, rLeftButtonStyle]}>
        <Animated.Text style={[styles.buttonText, rLeftTextStyle]}>{leftAction.label}</Animated.Text>
      </PressableScale>

      <PressableScale
        onPress={splitted ? rightAction.onPress : mainAction.onPress}
        style={[styles.button, rMainButtonStyle]}
      >
        <Animated.Text style={[styles.buttonText, rMainTextStyle]}>{mainAction.label}</Animated.Text>
        <Animated.Text style={[styles.buttonText, rRightTextStyle]}>{rightAction.label}</Animated.Text>
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    height: 70,
    justifyContent: "center",
  },
  button: {
    height: 70,

    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 99,
    alignItems: "center",
    overflow: "hidden",
    borderCurve: "continuous",
    borderWidth: 4,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    position: "absolute",
    fontFamily: "ReadexProBold",
  },
});

export default SplitButton;
