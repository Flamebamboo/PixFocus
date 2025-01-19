import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

export const DaySelector = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <View className="flex-row justify-between px-4">
      {days.map((day, index) => (
        <TouchableOpacity
          key={day}
          onPress={() => setSelectedDay(index)}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            selectedDay === index ? "bg-blue-500" : "bg-[#25262b]"
          }`}
        >
          <Text
            className={`${
              selectedDay === index ? "text-white" : "text-gray-400"
            }`}
          >
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
