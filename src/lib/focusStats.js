import { Client, Databases, ID, Query } from 'react-native-appwrite';
import { appwriteConfig } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

// timezone stuff
import * as Localization from 'expo-localization';
import { fromZonedTime } from 'date-fns-tz';
import { getTimeRange } from '@/utils/dateTimezone';

const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
const databases = new Databases(client);

/* I want to create focus stats for now only duration stats 
this requires me to fetch data from the focus hooks suck as 
useTimer and usePomodoro afterwards we will send that data to 
a store containing date started, date ended, calculate those time 
and append to the the total focus time, there will also filter 
function to sort the date by day e.g total focus today, etc. 
the next thing is from the focusStats.js we send that data to the */

const getTimezone = () => {
  try {
    const [calendar] = Localization.getCalendars();
    console.log(calendar.timeZone);
    return calendar.timeZone;
  } catch (error) {
    console.error('timezone failed: ', error);
    return 'UTC';
  }
};

const aggregateTaskData = (focusSessions) => {
  const taskGroups = {};
  let totalFocusTime = 0;
  let completedSessions = 0;
  let failedSessions = 0;

  focusSessions.forEach((session) => {
    const { taskName, focusTime, color, completion } = session;
    totalFocusTime += focusTime;

    // Track completion status
    if (completion) {
      completedSessions++;
    } else {
      failedSessions++;
    }

    if (taskGroups[taskName]) {
      taskGroups[taskName].value += focusTime;
    } else {
      taskGroups[taskName] = {
        label: taskName,
        value: focusTime,
        color: color,
      };
    }
  });

  return {
    groupTask: Object.values(taskGroups),
    totalFocusTime,
    completionData: {
      completed: completedSessions,
      failed: failedSessions,
      total: focusSessions.length,
    },
  };
};

export async function getByDay(user, dateParams = {}) {
  if (!user || !user.userId) {
    return { totalFocusTime: 0, groupTask: [] };
  }

  try {
    // Get the UTC start and end times based on the user's timezone
    const timezone = getTimezone();

    // Use provided date parameter or default to today
    let targetDate = new Date();
    if (dateParams.date) {
      targetDate = new Date(dateParams.date);
    }

    // Create start/end of day for the specified date
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    // Format for API
    const startTime = start.toISOString();
    const endTime = end.toISOString();

    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusSessionCollectionId, [
      Query.equal('user_id', user.userId),
      Query.greaterThanEqual('start_time', startTime),
      Query.lessThanEqual('end_time', endTime),
    ]);

    const sessions = response.documents;

    const formattedSessions = sessions.map((session) => ({
      taskName: session.task,
      focusTime: session.total_duration,
      color: session.color,
      completion: session.completion,
    }));

    return aggregateTaskData(formattedSessions);
  } catch (error) {
    console.error('Failed to get focus stats:', error);
    return { totalFocusTime: 0, groupTask: [] };
  }
}

export const getByWeek = async (user, dateParams = {}) => {
  if (!user || !user.userId) {
    return { totalFocusTime: 0, groupTask: [] };
  }

  try {
    // Use provided date parameters or defaults
    let startDate, endDate;

    if (dateParams.startDate && dateParams.endDate) {
      startDate = new Date(dateParams.startDate);
      endDate = new Date(dateParams.endDate);
    } else {
      const timezone = getTimezone();
      const { start, end } = getTimeRange('week', timezone);
      startDate = new Date(start);
      endDate = new Date(end);
    }

    // Set time to beginning/end of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Format for API
    const startTime = startDate.toISOString();
    const endTime = endDate.toISOString();

    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusSessionCollectionId, [
      Query.equal('user_id', user.userId),
      Query.greaterThanEqual('start_time', startTime),
      Query.lessThanEqual('end_time', endTime),
    ]);

    const sessions = response.documents;
    const formattedSessions = sessions.map((session) => ({
      taskName: session.task,
      focusTime: session.total_duration,
      color: session.color,
      completion: session.completion,
    }));

    return aggregateTaskData(formattedSessions);
  } catch (error) {
    console.error('Failed to get focus stats:', error);
    return { totalFocusTime: 0, groupTask: [] };
  }
};

export const getByMonth = async (user, dateParams = {}) => {
  if (!user || !user.userId) {
    return { totalFocusTime: 0, groupTask: [] };
  }

  try {
    // Use provided month/year or default to current month
    let month, year;

    if (dateParams.month !== undefined && dateParams.year !== undefined) {
      month = dateParams.month;
      year = dateParams.year;
    } else {
      const now = new Date();
      month = now.getMonth();
      year = now.getFullYear();
    }

    // Create start/end dates for the month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of month

    // Set time to beginning/end of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Format for API
    const startTime = startDate.toISOString();
    const endTime = endDate.toISOString();

    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusSessionCollectionId, [
      Query.equal('user_id', user.userId),
      Query.greaterThanEqual('start_time', startTime),
      Query.lessThanEqual('end_time', endTime),
    ]);

    const sessions = response.documents;
    const formattedSessions = sessions.map((session) => ({
      taskName: session.task,
      focusTime: session.total_duration,
      color: session.color,
      completion: session.completion,
    }));

    return aggregateTaskData(formattedSessions);
  } catch (error) {
    console.error('Failed to get focus stats:', error);
    return { totalFocusTime: 0, groupTask: [] };
  }
};

export const getByYear = async (user, dateParams = {}) => {
  if (!user || !user.userId) {
    return { totalFocusTime: 0, groupTask: [] };
  }

  try {
    // Use provided year or default to current year
    const year = dateParams.year !== undefined ? dateParams.year : new Date().getFullYear();

    // Create start/end dates for the year
    const startDate = new Date(year, 0, 1); // January 1
    const endDate = new Date(year, 11, 31); // December 31

    // Set time to beginning/end of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Format for API
    const startTime = startDate.toISOString();
    const endTime = endDate.toISOString();

    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusSessionCollectionId, [
      Query.equal('user_id', user.userId),
      Query.greaterThanEqual('start_time', startTime),
      Query.lessThanEqual('end_time', endTime),
    ]);

    const sessions = response.documents;
    const formattedSessions = sessions.map((session) => ({
      taskName: session.task,
      focusTime: session.total_duration,
      color: session.color,
      completion: session.completion,
    }));

    return aggregateTaskData(formattedSessions);
  } catch (error) {
    console.error('Failed to get focus stats:', error);
    return { totalFocusTime: 0, groupTask: [] };
  }
};

export async function saveFocusStats(stats, task, color, user) {
  if (!stats || !user || !user.userId) return null;

  const userTimezone = getTimezone();

  const sessionData = {
    start_time: fromZonedTime(stats.startTime, userTimezone).toISOString(),
    end_time: fromZonedTime(stats.endTime, userTimezone).toISOString(),
    total_duration: stats.totalDuration,
    completion: stats.isComplete,
    task,
    color,
    user_id: user.userId,
    email: user.email,
  };

  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.focusSessionCollectionId,
      ID.unique(), // Generate unique document ID
      sessionData
    );
    return sessionData;
  } catch (error) {
    console.error('Failed to save focus stats:', error);
    return null;
  }
}
