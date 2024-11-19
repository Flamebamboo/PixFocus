// components/LibraryTimer.jsx
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

export const LibraryTimer = () => {
  return (
    <TouchableOpacity
      className="bg-blue-500 p-4 rounded-2xl"
      onPress={() => router.push("/library")}
    >
      <View className="flex-row items-center gap-2 mb-4">
        <View className="w-2 h-2 bg-green-400 rounded-full" />
        <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center">
          <Text>⏰</Text>
        </View>
        <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center">
          <Text>🌍</Text>
        </View>
      </View>

      <Text className="text-white text-xl font-bold mb-2">Library timer</Text>

      <View className="flex-row items-center justify-between">
        <Text className="text-white/80">Study live with 2,730 others</Text>
        <Text className="text-2xl">▶️</Text>
      </View>
    </TouchableOpacity>
  );
};