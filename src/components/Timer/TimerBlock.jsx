import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';

import SessionButtons from '@/components/SessionButtons';

import { faTag, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useTimerStore from '@/store/timerStore';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatTime = (duration) => {
  if (!duration) {
    return '30 mins';
  }

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h`;
  }
  return `${minutes}m`;
};

const TimerBlock = ({ handleOpenTask, selectedTask, displayColor, handleOpenDuration, handleCreateSession }) => {
  const duration = useTimerStore((state) => state.duration);

  const color = useTimerStore((state) => state.color);
  const task = useTimerStore((state) => state.task);

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
      <View style={styles.optionContainer}>
        <SessionButtons
          label="Duration"
          leftIcon={'hourglass'}
          rightIcon={'chevron-right'}
          altLabel={formatTime(duration)}
          onPress={handleOpenDuration}
        />
        {/* <SessionButtons label="Apps Blocked" leftIcon={'hourglass'} rightIcon={'chevron-right'} altLabel="Block List" />
        <SessionButtons label="Mode" leftIcon={'hourglass'} rightIcon={'chevron-right'} altLabel="Trust Mode" /> */}
        {/* <SessionButtons
          label="Schedule for later"
          leftIcon={'hourglass'}
          rightIcon={'chevron-right'}
          style={{ marginTop: 50 }}
        /> */}
      </View>
      <View className="pt-4 items-center w-full ">
        <TouchableOpacity
          className="w-1/2 px-4 py-6 bg-white rounded-2xl shadow-lg flex items-center justify-center"
          onPress={handleCreateSession}
        >
          <Text className="text-black font-semibold text-lg">Create Session</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
};

export default TimerBlock;

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 0,
    width: SCREEN_WIDTH,
  },
  modalBackground: {
    backgroundColor: '#141414',
  },
  handleIndicator: {
    // the white thingy ontop
    backgroundColor: '#ffffff',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    paddingBottom: 34,
  },

  optionContainer: {
    rowGap: 30,
    paddingTop: 75,
    paddingBottom: 353,
  },
});
