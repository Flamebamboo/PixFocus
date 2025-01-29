// StatsCard.jsx
import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getByDay } from "@/lib/focusStats";
import React, { useState, useEffect } from "react";

export const StatsCard = () => {
  const [statsData, setStatsData] = useState({
    totalTime: 0, //the whole time spent on focused
    barData: {}, //contains the total time spent on each task
  });

  // Convert seconds to hours and minutes format
  const formatDuration = (second) => {
    const hours = Math.floor(second / 3600);
    const mins = second * 60;
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getByDay();
        const formattedData = data.groupTask.map((task) => ({
          value: task.value,
          label: task.label,
          frontColor: task.frontColor,
          labelTextStyle: {
            color: "white",
            fontSize: 14,
            position: "absolute",
            left: "80%",
          },
        }));
        setStatsData({
          totalTime: data.totalFocusTime,
          barData: formattedData,
        });
      } catch (error) {
        console.error("Failed to fetch stats data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <View className="bg-[#2C2C2C] flex w-[100%] h-80 rounded-3xl p-6">
      <View className="flex-row justify-between items-center w-full px-4">
        <Text className="text-white text-start">Today Focus {statsData.totalTime}</Text>
      </View>
      <View className="flex-1 items-starts justify-center">
        <BarChart
          data={statsData.barData}
          horizontal
          barWidth={40}
          spacing={8}
          maxValue={10} //seconds
          barBorderRadius={8}
          yAxisThickness={0}
          xAxisThickness={0}
          width={240}
          height={300}
          labelWidth={60}
          dashWidth={0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "300",
  },
  stat: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
