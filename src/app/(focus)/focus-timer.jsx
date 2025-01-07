import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

//core logic
import useTimerStore from '@/store/timerStore';
import { saveFocusStats } from '@/lib/focusStats';

import { useTimer } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/TimerConfig/TimerDisplay';

import { formatStatsTime } from '@/utils/statsFormat';

//UI
import SplitButton from '@/components/SplitButton';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useTimerVariant from '@/store/timerVariantStore';
import useMessageStore from '@/store/messageStatus';
import { TimerArt } from '@/components/TimerArt/TimerArt';

const FocusTimer = () => {
  const duration = useTimerStore((state) => state.duration);
  const { user } = useGlobalContext();
  const setMessage = useMessageStore((state) => state.setMessage);
  const color = useTimerStore((state) => state.color);
  const task = useTimerStore((state) => state.task);

  const currentVariant = useTimerVariant((state) => state.variant);
  const { timeRemaining, isActive, start, pause, stop, getProgress, isComplete } = useTimer(duration);

  const [isStopping, setIsStopping] = useState(false);

  //create logic to not save the focus session if the duration is less then 5 minutes

  const handleStop = async () => {
    if (isStopping) return;
    setIsStopping(true);
    const stats = stop();

    if (stats && user) {
      if (stats.totalDuration > 300) {
        try {
          await saveFocusStats(stats, task, color, user);
          // console.log('Session stats saved:', stats.task);
          console.log(stats.isComplete);
          setMessage(`Session Completed, You did ${task} for ${formatStatsTime(stats.totalDuration)}`);
          router.replace('/(focus)/exit-loading');
        } catch (error) {
          setMessage('Failed to save session stats');
          console.error('Failed to save session stats:', error);
        } finally {
          setIsStopping(false);
        }
      } else {
        setIsStopping(false);
        setMessage('Session Failed!!! duration was less than 5 minutes');
        router.replace('/(focus)/exit-loading');
      }
    } else {
      setIsStopping(false);
      setMessage('Session Failed!!! Something went wrong');
      router.replace('/(focus)/exit-loading');
    }
  };

  useEffect(() => {
    start();
    console.log('Timer started');
  }, [start]);

  useEffect(() => {
    if (isComplete) {
      handleStop();
    }
  }, [isComplete]);

  const [bgColor, setBgColor] = useState('#000');
  const handleBg = (color) => {
    setBgColor(color);
  };

  return (
    <SafeAreaView style={{ backgroundColor: bgColor, flex: 1 }}>
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
          <View className="mt-5">
            <TimerDisplay time={timeRemaining} />
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
              onPress: isActive ? pause : start,
            }}
            rightAction={{
              label: 'end',
              onPress: handleStop,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default FocusTimer;
