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

  async save() {
    await saveTimerState({
      timeSaved: Date.now(),
      timeRemaining: this.timeRemaining,
    });
  }

  async load() {
    const savedState = await loadTimerState();
    if (savedState) {
      this.timeRemaining = savedState.timeRemaining - Math.round((Date.now() - savedState.timeSaved) / 1000);

      this.onTick(this.timeRemaining);
    }
  }

  //stop here to die
}
