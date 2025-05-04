import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
//core logic
import useTimerStore from '@/store/timerStore';
import { saveFocusStats } from '@/lib/focusStats';

import { useTimer } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/TimerConfig/TimerDisplay';

import { formatStatsTime } from '@/utils/statsFormat';

//UI
import PressableScale from '@/components/PressableScale';
import SplitButton from '@/components/SplitButton';
import { faTag, faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useTimerVariant from '@/store/timerVariantStore';
import useMessageStore from '@/store/messageStatus';
import useCoinsStore from '@/store/coinsStore';

import { TimerArt } from '@/components/TimerArt/TimerArt';

import { calculateCoins } from '@/utils/coinCalculator';
import COLORS from '@/utils/color';
import useThemeStore from '@/store/themeStore';

const FocusTimer = () => {
  useKeepAwake();
  const duration = useTimerStore((state) => state.duration);
  const { addCoins, coins: currentCoins, initializeCoins } = useCoinsStore();

  const { user } = useGlobalContext();
  const setMessage = useMessageStore((state) => state.setMessage);
  const color = useTimerStore((state) => state.color);
  const task = useTimerStore((state) => state.task);

  const currentVariant = useTimerVariant((state) => state.variant);
  const { timeRemaining, isActive, start, pause, stop, getProgress, isComplete } = useTimer(duration);

  const [isStopping, setIsStopping] = useState(false);
  const colors = useThemeStore((state) => state.colors);

  //create logic to not save the focus session if the duration is less then 5 minutes

  const handleStop = async () => {
    if (isStopping) return;
    setIsStopping(true);
    const stats = stop();

    if (stats && user) {
      try {
        const sessionDuration = stats.totalDuration;
        const isComplete = stats.isComplete;

        if (sessionDuration > 300) {
          // Calculate coins earned/lost
          const coinChange = calculateCoins(sessionDuration, isComplete);

          if (coinChange >= 0) {
            await addCoins(coinChange, user);
          }
          await saveFocusStats(stats, task, color, user);
          const message = `Earned ${coinChange} coins! for ${formatStatsTime(sessionDuration)}`;
          setMessage(`${task} for ${formatStatsTime(sessionDuration)}. ${message}`);
          router.replace('/(focus)/exit-loading');

          //less than 5 minures
        } else {
          setMessage('Session too short (less than 5 minutes are not saved)');
          router.replace('/(focus)/exit-loading');
        }
      } catch (error) {
        setMessage('Failed to save session stat');
        console.error('Failed to save session stats:', error);
      } finally {
        setIsStopping(false);
      }
    } else {
      setIsStopping(false);
      setMessage('Session Failed, Something went wrong');
      router.replace('/(focus)/exit-loading');
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        await initializeCoins(user); // Initialize coins first to get documentId
        start();
      } catch (error) {
        console.error('Failed to initialize session:', error);
        setMessage('Failed to start session');
      }
    };

    initializeSession();
  }, [start, initializeCoins, user]);

  useEffect(() => {
    if (isComplete) {
      handleStop();
    }
  }, [isComplete]);

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
      <View className="flex flex-row justify-between items-center m-7">
        <Text style={[styles.logo, { color: colors.text }]}>PixFocus</Text>
        <View style={[styles.taskContainer, { backgroundColor: colors.accent, borderColor: colors.buttonBorder }]}>
          <FontAwesomeIcon icon={faTag} size={22} color={color} />
          <Text style={[styles.task, { color: colors.iconFill }]}>{task}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View className="flex-1 justify-center items-center flex-col">
          <TouchableOpacity onPress={() => router.push('/(shop)/focus-design')}>
            <TimerArt variant={currentVariant} progress={getProgress()} />
          </TouchableOpacity>
          <View className="mt-5">
            <TimerDisplay time={timeRemaining} color={colors.text} />
          </View>
        </View>

        <View className="mb-10 w-full ">
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
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 4,
    borderCurve: 'continuous',
  },

  logo: {
    fontSize: 20,
    fontFamily: 'PixelCode',
  },

  task: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'PixelCode',
  },
});

export default FocusTimer;
