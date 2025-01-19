import { View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import { FontAwesome } from "@expo/vector-icons";
import COLORS from "@/utils/color";
const SessionButtons = ({ label, leftIcon, rightIcon, altLabel, style, onPress }) => {
  return (
    <View className="px-1" style={style}>
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <View style={styles.iconWrapper}>
          <FontAwesome name={leftIcon} size={24} color={leftIcon ? "#000" : "transparent"} style={styles.leftIcon} />
          <View style={styles.textWrapper}>
            <Text style={styles.buttonMainText}>{label}</Text>
          </View>
        </View>

        <View style={styles.subTextContainer}>
          <Text style={styles.subText}>{altLabel}</Text>
          <FontAwesome name={rightIcon} size={16} color={rightIcon ? "#000" : "transparent"} style={styles.rightIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default SessionButtons;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.blue,
    height: 55,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#000",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
  },

  iconWrapper: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 10,
  },

  textWrapper: {
    marginLeft: 20,
  },

  buttonMainText: {
    color: "#000",
    fontFamily: "ReadexProRegular",
    fontSize: 18,
    textAlign: "center",
  },

  subTextContainer: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },

  subText: {
    color: "#000",
  },
});
