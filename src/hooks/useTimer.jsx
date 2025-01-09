// hooks/useTimer.js
import { useState, useEffect, useCallback } from 'react';
import { TimerService } from '@/services/timerService';
import { SessionTracker } from '@/utils/sessionTracker';
import { NativeModules } from 'react-native';
const { TimerWidgetModule } = NativeModules;

export const useTimer = (initialDuration) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const [sessionTracker] = useState(() => new SessionTracker());

  useEffect(() => {
    const newTimer = new TimerService(
      initialDuration,
      (time) => setTimeRemaining(time),
      () => {
        setIsComplete(true);
        setIsActive(false);
      }
    );
    setTimer(newTimer);

    return () => newTimer.cleanup();
  }, [initialDuration]);

  const start = useCallback(() => {
    if (timer) {
      timer.start();
      setIsActive(true);
      TimerWidgetModule.startLiveActivity();

      sessionTracker.start();
    }
  }, [timer, sessionTracker]);

  const pause = useCallback(() => {
    if (timer) {
      timer.pause();
      setIsActive(false);
      sessionTracker.pause();
      TimerWidgetModule.stopLiveActivity();
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
