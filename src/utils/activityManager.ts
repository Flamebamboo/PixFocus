import { areActivitiesEnabled, startActivity, endActivity } from '../../modules/live-activity-control';

export class ActivityManager {
  private static isActivityRunning = false;

  static startNewActivity(params: {
    startTime: Date;
    endTime: Date;
    title: string;
    headline: string;
    widgetUrl: string;
  }): boolean {
    console.debug('[ActivityManager] Attempting to start activity...', params);

    if (!areActivitiesEnabled()) {
      console.error('[ActivityManager] Live activities not supported/enabled on this device');
      return false;
    }

    // Validate parameters
    if (!params.title || !params.headline || !params.widgetUrl) {
      console.error('[ActivityManager] Missing required parameters');
      return false;
    }

    try {
      if (params.endTime <= params.startTime) {
        console.error('[ActivityManager] Invalid time range');
        throw new Error('End time must be after start time');
      }

      const success = startActivity({
        startTime: params.startTime,
        endTime: params.endTime,
        title: params.title,
        headline: params.headline,
        widgetUrl: params.widgetUrl,
      });

      if (success) {
        this.isActivityRunning = true;
        console.debug('[ActivityManager] Activity started successfully');
      } else {
        console.error('[ActivityManager] Failed to start activity - returned false');
      }

      return success;
    } catch (error) {
      console.error('[ActivityManager] Error starting activity:', error);
      return false;
    }
  }

  static endExistingActivity(params: { title: string; headline: string; widgetUrl: string }): void {
    if (!areActivitiesEnabled()) {
      console.warn('Live activities are not supported on this device');
      return;
    }

    try {
      endActivity({
        title: params.title,
        headline: params.headline,
        widgetUrl: params.widgetUrl,
      });
    } catch (error) {
      console.error('Failed to end activity:', error);
    }
  }

  static isActive(): boolean {
    return this.isActivityRunning;
  }
}
