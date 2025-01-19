import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          animation: "fade",
          headerShown: false,
        }}
      >
        <Stack.Screen name="focus-timer" options={{ headerShown: false }} />
        <Stack.Screen name="pomodoro-timer" options={{ headerShown: false }} />
        <Stack.Screen name="enter-loading" options={{ headerShown: false }} />
        <Stack.Screen name="exit-loading" options={{ headerShown: false }} />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </GestureHandlerRootView>
  );
};

export default RootLayout;
