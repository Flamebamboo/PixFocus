import { View, Text, Animated } from "react-native";
import React, { useEffect, useState } from "react";

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [barWidth] = useState(new Animated.Value(0));

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 25;
    return score;
  };

  useEffect(() => {
    const newStrength = calculateStrength(password);
    setStrength(newStrength);

    Animated.timing(barWidth, {
      toValue: newStrength,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [password]);

  const getStrengthText = () => {
    if (strength === 0) return "";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strength <= 25) return "#FF4444";
    if (strength <= 50) return "#FFA500";
    if (strength <= 75) return "#2E7D32";
    return "#00C853";
  };

  return password ? (
    <View className="mt-2 ">
      <View className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <Animated.View
          style={{
            width: barWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            height: "100%",
            backgroundColor: getStrengthColor(),
          }}
        />
      </View>
      <Text className="text-sm mt-1" style={{ color: getStrengthColor() }}>
        {getStrengthText()}
      </Text>
    </View>
  ) : null;
};

export default PasswordStrengthIndicator;
