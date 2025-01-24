import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

import useCoinsStore from '@/store/coinsStore';

import { calculateCoins } from '@/utils/coinCalculator';
import usePomodoroStore from '@/store/pomodoroStore';
import { saveFocusStats } from '@/lib/focusStats';
import { usePomodoro } from '@/hooks/usePomodoro';
import { TimerDisplay } from '@/components/TimerConfig/TimerDisplay';
import { formatStatsTime } from '@/utils/statsFormat';

const { width, height } = Dimensions.get('window');
import SplitButton from '@/components/SplitButton';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useTimerVariant from '@/store/timerVariantStore';
import useMessageStore from '@/store/messageStatus';
import { TimerArt } from '@/components/TimerArt/TimerArt';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import SessionModal from '@/components/SessionModal';
import COLORS from '@/utils/color';

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
  useKeepAwake();
  const { user } = useGlobalContext();
  const setMessage = useMessageStore((state) => state.setMessage);
  const currentVariant = useTimerVariant((state) => state.variant);

  const { duration, shortRest, longRest, cycles, task, color } = usePomodoroStore();

  const { addCoins, initializeCoins } = useCoinsStore();
  const { currentCycle, phase, timeRemaining, isActive, start, pause, reset, stop, skip, getProgress, isComplete } =
    usePomodoro(
      duration * 60, // Convert focus duration from minutes to seconds
      cycles,
      shortRest * 60, // Convert short rest from minutes to seconds
      longRest * 60 // Convert long rest from minutes to seconds
    );

  const [isStopping, setIsStopping] = useState(false);
  const [bgColor, setBgColor] = useState('#000');

  const handleBg = (color) => {
    setBgColor(color);
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

  const handleStop = async () => {
    if (isStopping) return;
    setIsStopping(true);
    const stats = stop(); // Call stop from usePomodoro
    console.log('stats', stats);

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
          if (isComplete) {
            const message = `Great job! Earned ${coinChange} coins! for ${formatStatsTime(sessionDuration)}`;
            setMessage(`Pomodoro Session Completed: ${currentCycle} cycles of ${duration} minutes. ${message}`);
            router.replace('/(focus)/exit-loading');
          } else {
            setMessage(`Pomodoro Session Failed: ${currentCycle} cycles of ${duration} minutes.`);
            router.replace('/(focus)/exit-loading');
          }

          //less than 5 minures
        } else {
          setMessage('Session too short (less than 5 minutes are not saved)');
          router.replace('/(focus)/exit-loading');
        }
      } catch (error) {
        setMessage('Failed to save session stats');
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
    console.log('Session complete ' + isComplete);
    if (isComplete) {
      handleStop();
    }
  }, [isComplete]);

  function renderContent() {
    // if (isComplete) {
    //   return (
    //     <View className="w-full h-full items-center justify-center flex-1 border-2 border-red-500">
    //       <SessionModal reset={reset} />
    //     </View>
    //   );
    // }
    return (
      <>
        {phase === 'work' ? (
          <TouchableOpacity onPress={() => router.push('/(shop)/focus-design')}>
            <TimerArt onColorChange={handleBg} variant={currentVariant} progress={getProgress()} />
          </TouchableOpacity>
        ) : (
          <View className="items-center justify-center">
            <Text style={styles.phaseText}>{phase === 'shortRest' ? 'Short Break' : 'Long Break'}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => router.push('/(shop)/focus-design')}>
          <TimerDisplay time={timeRemaining} />
        </TouchableOpacity>
        <View style={styles.cycleContainer}>{renderCycleIndicators(cycles, currentCycle)}</View>
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
        {!isComplete && (
          <View className="mb-10 items-center w-full justify-center">
            {phase === 'work' ? (
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
            ) : (
              <TouchableOpacity onPress={skip} style={styles.skipButton}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            )}
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
    justifyContent: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'ReadexProSemiBold',
  },

  task: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'PixelCode',
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
  skipButton: {
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
    height: height * 0.08,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#000',
  },
  skipButtonText: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'ReadexProSemiBold',
  },

  phaseText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'ReadexProSemiBold',
  },
});

export default PomodoroTimer;
