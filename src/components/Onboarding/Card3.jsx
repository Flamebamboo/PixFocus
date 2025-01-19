import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import FocusShopDisplay from "../../../assets/images/FocusShopDisplay.png";
const { width, height } = Dimensions.get("window");
import { Image } from "expo-image";

export default function Card3() {
  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={FocusShopDisplay} contentFit="contain" />
      </View>
      <Text style={styles.title}>Designs to choose from</Text>
      <Text style={styles.description}>Earn more focus duration to unlock designs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: "60%", // Take up half the screen height
    marginTop: -30, // Pull the image up to compensate for SafeAreaView
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  slide: {
    width,
    height,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#2F1818",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    textAlign: "center",
    color: "#fff",
    fontFamily: "BhalooBold",
  },
  description: {
    fontSize: 12,
    fontWeight: "bold",
    width: "80%",
    textAlign: "center",
    paddingHorizontal: 30,
    color: "#fff",
  },
});
