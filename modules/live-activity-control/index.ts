// Import the native module. On web, it will be resolved to LiveActivityControl.web.ts
// and on native platforms to LiveActivityControl.ts
import LiveActivityControlModule from './src/LiveActivityControlModule';

export function areActivitiesEnabled(): boolean {
  return LiveActivityControlModule.areActivitiesEnabled();
}

interface StartActivityOptions {
  startTime: Date;
  endTime: Date;
  title: string;
  headline: string;
  widgetUrl: string;
  countsDown?: boolean;
}

interface EndActivityOptions {
  title: string;
  headline: string;
  widgetUrl: string;
}

/**
 * Starts an iOS Live Activity.
 * @param options Options for the activity.
 */
export function startActivity(options: StartActivityOptions): boolean {
  return LiveActivityControlModule.startActivity(
    options.startTime.getTime() / 1000, // Convert to Unix timestamp
    options.endTime.getTime() / 1000, // Convert to Unix timestamp
    options.title,
    options.headline,
    options.widgetUrl,
    options.countsDown ?? false
  );
}

/**
 * Ends an iOS Live Activity.
 * @param options Options for the activity.
 */
export function endActivity(options: EndActivityOptions): void {
  endActivityInner(options.title, options.headline, options.widgetUrl);
}

function endActivityInner(title: string, headline: string, widgetUrl: string): void {
  LiveActivityControlModule.endActivity(title, headline, widgetUrl);
}
