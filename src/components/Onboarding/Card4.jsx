import { View, Text } from "react-native";
import React from "react";
import CustomButton from "@/components/Onboarding/CustomButton";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
import { router } from "expo-router";
const Card4 = () => {
  return (
    <View>
      <View style={styles.slide}>
        <Text style={styles.title}>PixFocus</Text>
        {/* final image here later*/}
      </View>
    </View>
  );
};

export default Card4;

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    justifyContent: "flex-start",
    paddingTop: 100,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#2F1818",
  },
  title: {
    fontSize: 54,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
    fontFamily: "BhalooBold",
  },
});
