import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { moderateScale, fontScale } from '@/utils/responsive';

import SessionButtons from '@/components/SessionButtons';

import { faTag, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useTimerStore from '@/store/timerStore';
import COLORS from '@/utils/color';
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

const TimerBlock = ({ handleOpenTask, handleOpenDuration }) => {
  const duration = useTimerStore((state) => state.duration);

  const color = useTimerStore((state) => state.color);
  const task = useTimerStore((state) => state.task);

  const getEstimatedFinishTime = () => {
    const now = new Date();
    const finishTime = new Date(now.getTime() + duration * 1000); // convert seconds to milliseconds
    return finishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <BottomSheetView style={styles.contentContainer}>
      <View className="flex-row items-center">
        <Text style={styles.text}>Task Goal</Text>
        <View className="px-8">
          {/* Section for selecting task */}

          <TouchableOpacity onPress={handleOpenTask}>
            <View style={styles.taskContainer}>
              <FontAwesomeIcon icon={faTag} size={22} color={color} />
              <Text style={styles.taskText}>{task}</Text>
              <FontAwesomeIcon icon={faCaretDown} size={22} color="#000" />
            </View>
          </TouchableOpacity>

          {/* Section for selecting duration */}
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
        <Text style={styles.finishText}>Estimated Finish: {getEstimatedFinishTime()}</Text>
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

  contentContainer: {
    flex: 1,
    padding: moderateScale(24),
    paddingBottom: moderateScale(34),
  },

  optionContainer: {
    rowGap: moderateScale(30),
    paddingTop: moderateScale(75),
    paddingBottom: moderateScale(100),
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
    fontFamily: 'PixelCodeMedium',
    fontSize: fontScale(18),
    color: '#000',
  },

  taskText: {
    fontFamily: 'PixelCodeBold',
    color: '#000',
    fontSize: 14,
    marginHorizontal: 16,
  },

  finishText: {
    fontFamily: 'PixelCodeMedium',
    fontSize: fontScale(18),
    color: '#9CA3AF',
  },
});
