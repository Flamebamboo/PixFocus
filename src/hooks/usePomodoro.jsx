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

export const usePomodoro = (initialDuration, cycles, shortRest, longRest) => {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState('work');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(null);

  const getCurrentDuration = useCallback(() => {
    switch (phase) {
      case 'work':
        return initialDuration;
      case 'shortRest':
        return shortRest;
      case 'longRest':
        return shortRest;
      default:
        return initialDuration;
    }
  }, [phase, initialDuration, shortRest, longRest]);

  const handlePhaseCompletion = useCallback(() => {
    if (phase === 'work') {
      setCurrentCycle((prev) => prev + 1);
      if (currentCycle + 1 >= cycles) {
        setPhase('longRest');
      } else {
        setPhase('shortRest');
      }
    } else {
      setPhase('work');
    }
  }, [phase, currentCycle, cycles]);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setCurrentCycle(0);
    setPhase('work');
    setTimeRemaining(initialDuration);
  }, [initialDuration]);

  useEffect(() => {
    setTimeRemaining(getCurrentDuration());
  }, [phase, getCurrentDuration]);

  useEffect(() => {
    let interval;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            handlePhaseCompletion();
            return getCurrentDuration();
          }
          return time - 1;
        });
      }, 0.2);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, getCurrentDuration, handlePhaseCompletion]);

  return {
    currentCycle,
    phase,
    timeRemaining,
    isActive,
    start,
    pause,
    reset,
  };
};
