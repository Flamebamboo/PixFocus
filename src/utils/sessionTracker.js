export class SessionTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.startTime = null;
    this.endTime = null;
    this.pauseIntervals = [];
    this.currentPause = null;
    this.isComplete = null;
  }

  start() {
    if (this.currentPause) {
      //occurs when we pause and then start again
      this.pauseIntervals.push({
        start: this.currentPause,
        end: new Date(),
      });
      this.currentPause = null;
    } else {
      //first start
      this.startTime = new Date();
    }
  }

  pause() {
    if (!this.currentPause) {
      this.currentPause = new Date();
    }
  }

  stop(complete) {
    this.endTime = new Date();
    //make it so that it aslo push the pause intervals if stop during pause
    if (this.currentPause) {
      this.pauseIntervals.push({
        start: this.currentPause,
        end: new Date(),
      });
      this.currentPause = null;
    }
    // Get the stats before resetting the session
    this.isComplete = complete; //returns either true or false
    const stats = this.getStats();
    // console.log(`stats from session Tracker${stats}`);
    // Reset the session state
    this.reset();
    // Return the stats
    return stats;
  }

  getStats() {
    if (!this.startTime || !this.endTime) return null;

    const totalPauseDuration = this.pauseIntervals.reduce(
      (total, interval) => total + (interval.end - interval.start),
      0
    );

    const actualDuration = Math.round((this.endTime - this.startTime - totalPauseDuration) / 1000);

    const cappedDuration = Math.min(actualDuration, this.initialDuration);

    return {
      startTime: this.startTime,
      endTime: this.endTime,
      totalDuration: cappedDuration,
      isComplete: this.isComplete,
    };
  }
}
