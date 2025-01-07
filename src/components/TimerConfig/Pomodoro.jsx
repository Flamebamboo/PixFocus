import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useContext } from 'react';
import { faTag, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CustomSlider from '@/components/CustomSlider';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import usePomodoroStore from '@/store/pomodoroStore';

const Pomodoro = ({ handleOpenTask, displayColor, selectedTask, handleCreatePomodoro }) => {
  const duration = usePomodoroStore((state) => state.duration);
  const adjustDuration = usePomodoroStore((state) => state.adjustDuration);

  const shortRestDuration = usePomodoroStore((state) => state.shortRest);
  const adjustShortRest = usePomodoroStore((state) => state.adjustShortRest);

  const longRestDuration = usePomodoroStore((state) => state.longRest);
  const adjustLongRest = usePomodoroStore((state) => state.adjustLongRest);

  const cycles = usePomodoroStore((state) => state.cycles);
  const adjustCycles = usePomodoroStore((state) => state.adjustCycles);

  const color = usePomodoroStore((state) => state.color);
  const task = usePomodoroStore((state) => state.task);
  return (
    <BottomSheetView style={styles.contentContainer}>
      <View className="flex-row items-center">
        <Text className="text-white font-ReadexPro font-bold text-xl">Task Goal</Text>
        <View className="px-8">
          <TouchableOpacity
            className="bg-[#2C2C2C] flex flex-row justify-between items-center py-2 px-4 rounded-full"
            onPress={handleOpenTask}
          >
            <FontAwesomeIcon icon={faTag} size={22} color={color} />
            <Text className="text-white text-2sm font-bold mx-4 ">{task}</Text>
            <FontAwesomeIcon icon={faCaretDown} size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-full flex items-start gap-y-4 mt-20">
        <CustomSlider
          label="Focus Duration"
          value={duration}
          minVal={15}
          maxVal={60}
          step={5}
          onValueChange={adjustDuration}
        />
        <CustomSlider
          label="Short Rest Duration"
          value={shortRestDuration}
          minVal={5}
          maxVal={15}
          step={5}
          onValueChange={adjustShortRest}
        />
        <CustomSlider label="Cycles" value={cycles} minVal={1} maxVal={10} step={1} onValueChange={adjustCycles} />
        <CustomSlider
          label="Long Rest Duration"
          value={longRestDuration}
          minVal={10}
          maxVal={30}
          step={5}
          onValueChange={adjustLongRest}
        />
      </View>
      <View className="pt-20 items-center w-full">
        <TouchableOpacity
          className="w-1/2 px-4 py-6 bg-white rounded-2xl shadow-lg flex items-center justify-center"
          onPress={handleCreatePomodoro}
        >
          <Text className="text-black font-semibold text-lg">Create Session</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
};

export default Pomodoro;
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 24,
    paddingBottom: 34,
  },
});
