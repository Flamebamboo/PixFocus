import BackgroundTimer from 'react-native-background-timer';

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
      this.interval = BackgroundTimer.setInterval(() => {
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
      BackgroundTimer.clearInterval(this.interval);
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
}
