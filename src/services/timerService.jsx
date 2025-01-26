import { saveTimerState, loadTimerState } from '@/utils/timerStorage';

export class TimerService {
  constructor(duration, onTick, onComplete) {
    this.duration = duration;
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
    };
    console.log('from timerService' + this.timeRemaining);
    await saveTimerState(state);
    // Notification handling is now managed by the useTimer hook
    //need for pomodoro too
  }

  async load() {
    const savedState = await loadTimerState();
    if (savedState) {
      const elapsedSeconds = Math.round((Date.now() - savedState.timeSaved) / 1000);
      this.timeRemaining = Math.max(0, savedState.timeRemaining - elapsedSeconds);

      this.onTick(this.timeRemaining);
    }
  }

  //stop here to die
}
