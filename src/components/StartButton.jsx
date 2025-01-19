import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PressableScale from "./PressableScale";
import COLORS from "@/utils/color";

const StartButton = ({ text, onPress }) => {
  return (
    <View style={styles.container}>
      <PressableScale style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{text || "Start"}</Text>
      </PressableScale>
    </View>
  );
};

export default StartButton;

const styles = StyleSheet.create({
  container: {
    width: "70%",
    justifyContent: "center",
  },
  button: {
    height: 70,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    borderWidth: 4,
    borderRadius: 99,
    alignItems: "center",
    overflow: "hidden",
    borderCurve: "continuous",
  },

  text: {
    fontFamily: "ReadexProSemiBold",
    fontSize: 18,
  },
});
