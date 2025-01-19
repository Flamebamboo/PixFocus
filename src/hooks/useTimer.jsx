// hooks/useTimer.js
import { useState, useEffect, useCallback } from 'react';
import { TimerService } from '@/services/timerService';
import { SessionTracker } from '@/utils/sessionTracker';
import useNotifications from './useNotifications';

export const useTimer = (initialDuration) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const notifications = useNotifications();
  const [sessionTracker] = useState(() => new SessionTracker());

  useEffect(() => {
    const newTimer = new TimerService(initialDuration, (time) => setTimeRemaining(time), handleTimerComplete);
    setTimer(newTimer);

    return () => newTimer.cleanup();
  }, [initialDuration, handleTimerComplete]);

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

    // Will only show notification in background
    notifications.createTimerCompletionNotification(
      'Focus Session Complete! 🎉',
      `You've completed ${Math.floor(initialDuration / 60)} minutes of focused work!`
    );
  }, [initialDuration, notifications]);

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
