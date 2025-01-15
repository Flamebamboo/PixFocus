import React, { useEffect, useState, useCallback } from 'react';
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

import SessionModal from '@/components/SessionModal';

function renderCycleIndicators(cycles, currentCycle) {
  const indicators = [];
  for (let i = 0; i < cycles; i++) {
    indicators.push(
      <View key={i} style={[styles.cycleIndicator, { backgroundColor: i < currentCycle ? '#4CAF50' : '#555' }]} />
    );
  }
  return indicators;
}

const PomodoroTimer = () => {
  const { user } = useGlobalContext();
  const setMessage = useMessageStore((state) => state.setMessage);
  const currentVariant = useTimerVariant((state) => state.variant);

  const { duration, shortRest, longRest, cycles, task, color } = usePomodoroStore();

  const { currentCycle, phase, timeRemaining, isActive, start, pause, reset, stop, getProgress, completed } =
    usePomodoro(
      duration, // Convert minutes to seconds
      cycles,
      shortRest,
      longRest
    );

  const [isStopping, setIsStopping] = useState(false);
  const [bgColor, setBgColor] = useState('#000');

  const handleBg = (color) => {
    setBgColor(color);
  };

  useEffect(() => {
    start();
    console.log('Pomodoro timer started');
  }, [start]);

  const handleStop = async () => {
    if (isStopping) return;
    setIsStopping(true);

    try {
      const stats = stop(); // Call stop from usePomodoro
      if (stats && user) {
        await saveFocusStats(stats, task, color, user);
        setMessage(`Pomodoro Session Completed: ${currentCycle} cycles`);
        router.replace('/(focus)/exit-loading');
      } else {
        setMessage('Session Failed!!! Something went wrong');
        router.replace('/(focus)/exit-loading');
      }
    } catch (error) {
      setMessage('Failed to save session stats');
      console.error('Failed to save session stats:', error);
    } finally {
      setIsStopping(false);
    }
  };

  function renderContent() {
    if (completed) {
      return (
        <View className="w-full h-full items-center justify-center flex-1 border-2 border-red-500">
          <SessionModal reset={reset} />
        </View>
      );
    }
    return (
      <>
        {phase === 'work' ? (
          <TimerArt onColorChange={handleBg} variant={currentVariant} progress={getProgress()} />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.phaseText}>{phase === 'shortRest' ? 'Short Break' : 'Long Break'}</Text>
          </View>
        )}
        <View style={styles.cycleContainer}>{renderCycleIndicators(cycles, currentCycle)}</View>
        <TimerDisplay time={timeRemaining} />
      </>
    );
  }

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
        <View className="flex-1 w-full justify-center items-center flex-col">{renderContent()}</View>
        {!completed && (
          <View className="mb-10">
            <SplitButton
              splitted={!isActive}
              leftAction={{
                label: 'resume',
                onPress: start,
              }}
              mainAction={{
                label: isActive ? 'pause' : 'end',
                onPress: isActive ? pause : start,
              }}
              rightAction={{
                label: 'end',
                onPress: handleStop,
              }}
            />
          </View>
        )}
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
});

export default PomodoroTimer;
