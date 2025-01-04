// hooks/useTimer.js
import { useState, useEffect, useCallback } from 'react';
import { TimerService } from '@/services/timerService';
import { SessionTracker } from '@/utils/sessionTracker';

export const useTimer = (initialDuration) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(null);

  const [sessionTracker] = useState(() => new SessionTracker());

  useEffect(() => {
    const newTimer = new TimerService(
      initialDuration,
      (time) => setTimeRemaining(time),
      () => {
        setIsActive(false);
        sessionTracker.stop();
      }
    );
    setTimer(newTimer);

    return () => newTimer.cleanup();
  }, [initialDuration]);

  const start = useCallback(() => {
    if (timer) {
      timer.start();
      setIsActive(true);

      sessionTracker.start();
    }
  }, [timer]);

  const pause = useCallback(() => {
    if (timer) {
      timer.pause();
      setIsActive(false);
      sessionTracker.pause();
    }
  }, [timer]);

  const stop = useCallback(() => {
    if (timer) {
      const stats = sessionTracker.stop();
      timer.stop();
      setIsActive(false);
      // console.log(`stats from useTimer ${stats}`);
      return stats;
    }
  }, [timer]);

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
  };
};
