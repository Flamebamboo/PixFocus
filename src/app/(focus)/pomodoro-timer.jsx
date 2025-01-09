import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

import usePomodoroStore from '@/store/pomodoroStore';
import { saveFocusStats } from '@/lib/focusStats';
import { usePomodoro } from '@/hooks/usePomodoro';
import { TimerDisplay } from '@/components/TimerConfig/TimerDisplay';
import { formatStatsTime } from '@/utils/statsFormat';

import SplitButton from '@/components/SplitButton';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useTimerVariant from '@/store/timerVariantStore';
import useMessageStore from '@/store/messageStatus';
import { TimerArt } from '@/components/TimerArt/TimerArt';

const PomodoroTimer = () => {
  const { user } = useGlobalContext();
  const setMessage = useMessageStore((state) => state.setMessage);
  const currentVariant = useTimerVariant((state) => state.variant);

  const { duration, shortRest, longRest, cycles, task, color } = usePomodoroStore();

  const { currentCycle, phase, timeRemaining, isActive, start, pause, reset } = usePomodoro(
    duration * 60,
    cycles,
    shortRest * 60,
    longRest * 60
  );

  const [isStopping, setIsStopping] = useState(false);
  const [bgColor, setBgColor] = useState('#000');

  const handleBg = (color) => {
    setBgColor(color);
  };

  const getProgress = () => {
    const currentDuration = phase === 'work' ? duration * 60 : phase === 'shortRest' ? shortRest * 60 : longRest * 60;
    return 1 - timeRemaining / currentDuration;
  };

  const renderCycleIndicators = () => {
    return Array(cycles)
      .fill(0)
      .map((_, index) => (
        <View
          key={index}
          style={[
            styles.cycleIndicator,
            {
              backgroundColor: index < currentCycle ? '#4CAF50' : '#ffffff33',
            },
          ]}
        />
      ));
  };

  const handleStop = async () => {
    if (isStopping) return;
    setIsStopping(true);

    try {
      // Save stats logic here
      setMessage(`Pomodoro Session Completed: ${currentCycle} cycles`);
      router.replace('/(focus)/exit-loading');
    } catch (error) {
      setMessage('Failed to save session stats');
      console.error('Failed to save session stats:', error);
    } finally {
      setIsStopping(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View className="flex flex-row justify-between items-center m-7">
        <Text style={styles.logo}>PixFocus</Text>
        <View style={styles.taskContainer}>
          <FontAwesomeIcon icon={faTag} size={22} color={color} />
          <Text style={styles.task}>{task}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View className="flex-1 justify-center items-center flex-col">
          <TouchableOpacity onPress={() => router.push('/(shop)/focus-design')}>
            <TimerArt onColorChange={handleBg} variant={currentVariant} progress={getProgress()} />
          </TouchableOpacity>

          <View style={styles.cycleContainer}>{renderCycleIndicators()}</View>

          <View className="mt-5">
            <TimerDisplay time={timeRemaining} />
            <Text style={styles.phaseText}>
              {phase === 'work' ? 'Focus Time' : phase === 'shortRest' ? 'Short Break' : 'Long Break'}
            </Text>
          </View>
        </View>

        <View className="mb-10">
          <SplitButton
            splitted={!isActive}
            leftAction={{
              label: 'resume',
              onPress: start,
            }}
            mainAction={{
              label: isActive ? 'pause' : 'end',
              onPress: isActive ? pause : handleStop,
            }}
            rightAction={{
              label: 'reset',
              onPress: reset,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'BhalooBold',
  },
  task: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'PixelifySans',
  },
  cycleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  cycleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  phaseText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'PixelifySans',
  },
});

export default PomodoroTimer;
