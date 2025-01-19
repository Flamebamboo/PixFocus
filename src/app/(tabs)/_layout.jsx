import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="stats-screen" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
