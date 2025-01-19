import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
const AuthLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaProvider>
  );
};

export default AuthLayout;
