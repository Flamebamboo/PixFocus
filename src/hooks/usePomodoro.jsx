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

import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerService } from '@/services/timerService';
import { SessionTracker } from '@/utils/sessionTracker';

import { AppState } from 'react-native';

export const usePomodoro = (initialDuration, cycles, shortRest, longRest) => {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState('work');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(null);
  const [sessionTracker] = useState(() => new SessionTracker());

  const appState = useRef(AppState.currentState);

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

  // called by  when each phase is completed

  const handlePhaseCompletion = useCallback(() => {
    console.log('Handling phase completion:', currentCycle);
    if (phase === 'work') {
      setCurrentCycle((prevCycle) => {
        const nextCycle = prevCycle + 1;
        if (nextCycle >= cycles) {
          if (longRest === 0) {
            handleTimerComplete();
          } else {
            setPhase('longRest');
          }
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
        handlePhaseCompletion();
      }
    );

    setTimer(newTimer);

    if (isActive) {
      newTimer.start();
    }

    return () => {
      if (newTimer) {
        newTimer.cleanup();
      }
    };
  }, [phase, getCurrentDuration, handlePhaseCompletion]);

  //this useEffect handle app state changes and save/load data from timerStorage
  useEffect(() => {
    if (!timer) return;

    const handleAppStateChange = async (nextAppState) => {
      console.log(`App state changed from ${appState.current} to ${nextAppState}`);

      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        await timer.load();
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        timer.save();
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [timer]);

  //the rest of timer logics
  const start = useCallback(() => {
    if (timer) {
      timer.start();
      setIsActive(true);
      if (phase === 'work') {
        sessionTracker.start();
      }
    }
  }, [timer, sessionTracker]);

  const pause = useCallback(() => {
    if (timer) {
      timer.pause();
      setIsActive(false);
      if (phase === 'work') {
        sessionTracker.pause();
      }
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

  const skip = useCallback(() => {
    if (timer) {
      timer.stop();
      setIsActive(false); // Ensure we're stopped before phase change
      handlePhaseCompletion();
    }
  }, [timer, handlePhaseCompletion, getCurrentDuration]);

  const getProgress = useCallback(() => {
    return timer ? timer.getProgress() : 0;
  }, [timer]);

  const handleTimerComplete = useCallback(() => {
    console.log('Handle timer complete');
    setIsComplete(true);
    setIsActive(false);
    timer.stop();
  }, [initialDuration, notifications]);
  return { currentCycle, phase, timeRemaining, isActive, start, pause, reset, stop, skip, getProgress, isComplete };
};
