// hooks/useTimer.js
import { useState, useEffect, useCallback } from 'react';
import { TimerService } from '@/services/timerService';
import { SessionTracker } from '@/utils/sessionTracker';
import { ActivityManager } from '../utils/activityManager';
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

      // Calculate proper end time based on timer duration
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + initialDuration * 1000); // convert to milliseconds

      ActivityManager.startNewActivity({
        startTime,
        endTime,
        title: 'Focus Timer',
        headline: `Focus Session - ${Math.floor(initialDuration / 60)} minutes`,
        widgetUrl: 'aurahub://focus-timer',
      });

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

      // End the live activity when timer stops
      ActivityManager.endExistingActivity({
        title: 'Focus Timer',
        headline: 'Focus Session Ended',
        widgetUrl: 'aurahub://focus-timer',
      });

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
