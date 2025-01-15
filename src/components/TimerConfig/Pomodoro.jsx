import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useContext } from 'react';
import { faTag, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CustomSlider from '@/components/CustomSlider';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import usePomodoroStore from '@/store/pomodoroStore';
import COLORS from '@/utils/color';

const Pomodoro = ({ handleOpenTask, displayColor, selectedTask, handleCreateSession }) => {
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
        <Text style={styles.text}>Task Goal</Text>
        <View className="px-8">
          {/* section for task */}
          <TouchableOpacity onPress={handleOpenTask}>
            <View style={styles.taskContainer}>
              <FontAwesomeIcon icon={faTag} size={22} color={color} />
              <Text className="text-black text-2sm mx-4 " style={{ fontFamily: 'ReadexProSemiBold' }}>
                {task}
              </Text>
              <FontAwesomeIcon icon={faCaretDown} size={22} color="#000" />
            </View>
          </TouchableOpacity>

          {/* ahh */}
        </View>
      </View>
      <View className="w-full flex items-start gap-y-4 mt-20">
        <CustomSlider
          label="Focus Duration"
          value={duration}
          minVal={5}
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
          minVal={0}
          maxVal={30}
          step={5}
          onValueChange={adjustLongRest}
        />
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
  taskContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: COLORS.blue,
    padding: 10,
    borderWidth: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontFamily: 'ReadexProSemiBold',
    fontSize: 18,
  },
});
