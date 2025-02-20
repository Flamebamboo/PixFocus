import { saveTimerState, loadTimerState } from '@/utils/timerStorage';

export class TimerService {
  constructor(duration, onTick, onComplete) {
    this.duration = duration;
    this.initialDuration = duration;
    this.timeRemaining = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.interval = null;
    this.isActive = false;
  }

  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.interval = setInterval(() => {
        this.timeRemaining--;
        this.onTick(this.timeRemaining);
        if (this.timeRemaining <= 0) {
          this.stop();
          this.onComplete();
        }
      }, 1000);
    }
  }

  pause() {
    this.isActive = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  stop() {
    this.pause();
    this.timeRemaining = this.duration;
  }

  getProgress() {
    return 1 - this.timeRemaining / this.duration;
  }

  getTimeRemaining() {
    return this.timeRemaining;
  }

  cleanup() {
    this.pause();
  }

  /*Bug Report: When user reopens the app after a long period of time the timer were shown negative for few seconds
  
    Caused because of the Date.now() value is higher that the timeRemaining during saved
    it's not handling the case where more time has passed than what was remaining in the timer.
  */

  /* 

  current logic: 
  1) save time when user leaves the app with date.now()
  2) user reopens we call load() and change the time remaining by getting the date of reopen - left app
  */
  async save() {
    const state = {
      timeSaved: Date.now(),
      timeRemaining: this.timeRemaining,
      initialDuration: this.initialDuration,
      startTime: this.startTime,
    };
    await saveTimerState(state);
  }

  async load() {
    try {
      const savedState = await loadTimerState();

      //savedState is the state that we save at the top using saveTimerState from timerStorage

      if (!savedState) return;

      if (!this.validateSavedState(savedState)) {
        this.reset();
        return;
      }

      const elapsedSeconds = this.calculateElapsedSeconds(savedState);

      this.timeRemaining = Math.max(0, Math.min(savedState.timeRemaining - elapsedSeconds, savedState.initialDuration));

      // if (savedState) {
      // this.timeRemaining = Math.max(0, savedState.timeRemaining - elapsedSeconds); FUCK ME A MONTH AGO!?! stupid af calculations dont fucking know how to use max and min with MATH

      this.onTick(this.timeRemaining);
    } catch (error) {
      console.error('from timerService load()', error);
    }
  }
  validateSavedState(savedState) {
    return (
      savedState.timeSaved &&
      savedState.timeRemaining >= 0 &&
      savedState.initialDuration > 0 &&
      savedState.timeRemaining <= savedState.initialDuration
    );
  }

  calculateElapsedSeconds(savedState) {
    const now = Date.now();
    const elapsed = Math.round((now - savedState.timeSaved) / 1000);
    return Math.min(elapsed, savedState.initialDuration);
  }

  reset() {
    this.timeRemaining = this.initialDuration;
    this.isActive = false;
    clearInterval(this.interval);
    this.interval = null;
  }
}
