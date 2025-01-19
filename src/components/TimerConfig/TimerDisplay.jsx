import React from "react";
import { Text, StyleSheet } from "react-native";
import { formatTimeDisplay } from "@/utils/timeFormat";

export const TimerDisplay = ({ time }) => <Text style={styles.timerDisplay}>{formatTimeDisplay(time)}</Text>;

const styles = StyleSheet.create({
  timerDisplay: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    fontFamily: "PixelCode",
  },
});
