{
  /*
  
Pomodoro Timer:

How Traditional Pomodoro Techniques Works:
    - User can start a 25 minute timer 
    - User cannot pause the timer
    - goes through 4 cycles of 25 minutes with a 5 minute rest in between
    - After 4 cycles, user gets a 15 minute rest
   


In App Pomodoro Timer Features:
    - Total Session Duration
    - Customizable number of cycles,
    - Customizable short rest time,
    - Customizable long rest time,
    - User can end the timer at any time
    

    TO DO:
    get current cycle with switch statement

    handle phase completion

    initiate timer 

    get progress
    */
}

import { useState, useEffect, useCallback } from 'react';
import { TimerService } from '@/services/timerService';
import { SessionTracker } from '@/utils/sessionTracker';
import useNotifications from './useNotifications';

export const usePomodoro = (initialDuration, cycles, shortRest, longRest) => {
  const notifications = useNotifications();
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState('work');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(null);
  const [sessionTracker] = useState(() => new SessionTracker());
  const [completed, setCompleted] = useState(false);

  const getCurrentDuration = useCallback(() => {
    switch (phase) {
      case 'work':
        return initialDuration;
      case 'shortRest':
        return shortRest;
      case 'longRest':
        return longRest;
      default:
        return initialDuration;
    }
  }, [phase, initialDuration, shortRest, longRest]);

  const handlePhaseCompletion = useCallback(() => {
    if (phase === 'work') {
      setCurrentCycle((prevCycle) => {
        const nextCycle = prevCycle + 1;
        if (nextCycle >= cycles) {
          setPhase('longRest');
        } else {
          setPhase('shortRest');
        }
        return nextCycle;
      });
    } else if (phase === 'longRest' && currentCycle >= cycles) {
      // End session after long break of last cycle
      handleTimerComplete();
    } else {
      setPhase('work');
    }
  }, [phase, cycles, currentCycle]);

  // Separate useEffect for timer initialization
  useEffect(() => {
    const duration = getCurrentDuration();
    setTimeRemaining(duration);

    const newTimer = new TimerService(
      duration,
      (time) => setTimeRemaining(time),
      () => {
        setIsComplete(true);
        setIsActive(false);
        handlePhaseCompletion();
      }
    );

    setTimer(newTimer);

    // If timer was active, restart it with new duration
    if (isActive) {
      newTimer.start();
    }

    return () => {
      if (newTimer) {
        newTimer.cleanup();
      }
    };
  }, [getCurrentDuration, handlePhaseCompletion, phase]);

  const start = useCallback(() => {
    if (timer) {
      timer.start();
      setIsActive(true);
      sessionTracker.start();
    }
  }, [timer, sessionTracker]);

  const pause = useCallback(() => {
    if (timer) {
      timer.pause();
      setIsActive(false);
      sessionTracker.pause();
    }
  }, [timer, sessionTracker]);

  const reset = useCallback(() => {
    if (timer) {
      timer.stop();
      setIsActive(false);
      setCurrentCycle(0);
      setPhase('work');
      setTimeRemaining(initialDuration);
      sessionTracker.reset();
    }
  }, [timer, initialDuration, sessionTracker]);

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

  useEffect(() => {
    setTimeRemaining(getCurrentDuration());
  }, [phase, getCurrentDuration]);

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
    currentCycle,
    phase,
    timeRemaining,
    isActive,
    start,
    pause,
    reset,
    stop,
    getProgress,
    completed,
  };
};
