//by o1-mini

import {
  fromZonedTime,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns-tz';

/**
 * Calculates the start and end times for a given period based on timezone.
 * @param {string} period - The time period ('day', 'week', 'month', 'year').
 * @param {string} timezone - The user's timezone (e.g., 'America/New_York').
 * @returns {Object} - An object containing start and end times in UTC ISO format.
 */
export const getTimeRange = (period, timezone) => {
  const now = new Date();

  let start, end;

  switch (period) {
    case 'day':
      start = startOfDay(now);
      //e.g
      end = endOfDay(now);
      break;
    case 'week':
      start = startOfWeek(now);
      end = endOfWeek(now);
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'year':
      start = startOfYear(now);
      end = endOfYear(now);
      break;
    default:
      throw new Error('Invalid period specified');
  }

  // Convert local times to UTC based on user's timezone
  const utcStart = fromZonedTime(start, timezone).toISOString();
  const utcEnd = fromZonedTime(end, timezone).toISOString();

  return { start: utcStart, end: utcEnd };
};

// Explanation:

// Purpose: This function calculates the start and end times for a specified period (day, week, month, year) based on the user's timezone.
// Process:
// Determine the local start and end times using date-fns functions.
// Convert these local times to UTC using zonedTimeToUtc from date-fns-tz.
// Return the UTC times in ISO string format for database querying.
