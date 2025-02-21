// hooks/useTimer.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerService } from '@/services/timerService';
import { SessionTracker } from '@/utils/sessionTracker';
import useNotifications from './useNotifications';
import { AppState } from 'react-native';
// import { loadTimerState } from '@/utils/timerStorage';

export const useTimer = (initialDuration) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionTracker] = useState(() => new SessionTracker(initialDuration));
  const appState = useRef(AppState.currentState);
  const notifications = useNotifications();

  useEffect(() => {
    const newTimer = new TimerService(initialDuration, (time) => setTimeRemaining(time), handleTimerComplete);
    setTimer(newTimer);

    return () => {
      newTimer.cleanup();
    };
  }, [initialDuration, handleTimerComplete]);

  //this useEffect handle app state changes and save/load data from timerStorage
  useEffect(() => {
    if (!timer) return;

    const handleAppStateChange = async (nextAppState) => {
      console.log(`App state changed from ${appState.current} to ${nextAppState}`);

      // If coming to foreground from background, try to load
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        await timer.load();
      }
      // If going inactive/background from active, save and schedule notification
      else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        timer.save();

        const currentTimeRemaining = timer.getTimeRemaining();
        console.log('Current time remaining:', currentTimeRemaining);
        await notifications.createTimerCompletionNotification(currentTimeRemaining);
      }

      // Finally, update the ref to the new state
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [timer]);

  const start = useCallback(() => {
    if (timer) {
      timer.start();

      setIsActive(true);

      sessionTracker.start();
    }
  }, [timer, sessionTracker, initialDuration]);

  const pause = useCallback(() => {
    if (timer) {
      timer.pause();

      setIsActive(false);
      sessionTracker.pause();
    }
  }, [timer, sessionTracker]);

  const stop = useCallback(() => {
    if (timer) {
      const stats = sessionTracker.stop(isComplete);
      timer.stop();
      setIsComplete(false);
      setIsActive(false);

      return stats;
    }
  }, [timer, isComplete, sessionTracker]);

  const getProgress = useCallback(() => {
    return timer ? timer.getProgress() : 0;
  }, [timer]);

  const handleTimerComplete = useCallback(() => {
    setIsComplete(true);
    setIsActive(false);
  }, [initialDuration]);

  return {
    timeRemaining,
    isActive, //for split buttons
    start,
    pause,
    stop,
    getProgress,
    isComplete,
  };
};
