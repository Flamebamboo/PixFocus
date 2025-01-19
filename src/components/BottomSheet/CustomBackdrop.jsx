import React, { useMemo } from "react";
import { ImageBackground } from "react-native";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const CustomBackdrop = ({
  animatedIndex,
  style,
  imageUrl,
  backgroundColor = "#000000",
  opacity = 1,
}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, opacity],
      Extrapolation.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: backgroundColor,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      containerAnimatedStyle,
    ],
    [style, backgroundColor, containerAnimatedStyle]
  );

  if (imageUrl) {
    return (
      <Animated.View style={containerStyle}>
        <ImageBackground
          source={{ uri: imageUrl }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </Animated.View>
    );
  }

  return <Animated.View style={containerStyle} />;
};

export default CustomBackdrop;
