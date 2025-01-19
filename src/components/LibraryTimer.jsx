// components/LibraryTimer.jsx
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

export const LibraryTimer = () => {
  return (
    <TouchableOpacity className="bg-[#2C2C2C] p-4 rounded-2xl" onPress={() => router.push("(chat)/chat")}>
      <View className="flex-row items-center gap-2 mb-4">
        <View className="w-2 h-2 bg-green-400 rounded-full" />
        <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center">
          <Text>⏰</Text>
        </View>
        <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center">
          <Text>🌍</Text>
        </View>
      </View>

      <Text className="text-white text-xl font-bold mb-2">Imnotsureyet</Text>

      <View className="flex-row items-center justify-between">
        <Text className="text-white/80">oh weowoowoow</Text>
        <Text className="text-2xl">▶️</Text>
      </View>
    </TouchableOpacity>
  );
};
