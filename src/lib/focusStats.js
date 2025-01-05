import { Client, Databases, ID, Query } from 'react-native-appwrite';
import { appwriteConfig } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
const databases = new Databases(client);

/* I want to create focus stats for now only duration stats 
this requires me to fetch data from the focus hooks suck as 
useTimer and usePomodoro afterwards we will send that data to 
a store containing date started, date ended, calculate those time 
and append to the the total focus time, there will also filter 
function to sort the date by day e.g total focus today, etc. 
the next thing is from the focusStats.js we send that data to the */

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
        color: color || '#FF6B6B', // default color if none provided
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

export async function getByDay(user) {
  if (!user || !user.userId) {
    return { totalFocusTime: 0, groupTask: [] };
  }

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusSessionCollectionId, [
      Query.equal('user_id', user.userId),
      Query.greaterThanEqual('start_time', startOfDay.toISOString()),
      Query.lessThanEqual('end_time', endOfDay.toISOString()),
    ]);

    const sessions = response.documents;

    /*
    sessions looks like this 
    [
      {
        "start_time": "2021-07-01T00:00:00.000Z",
        "end_time": "2021-07-01T00:00:00.000Z",
        "total_duration": 1000, // in seconds
        "completion": true/false
        "task": "task",
        "color": "red",
        "user_id": "123",
        "email": "email"
      }
      and more from the current day
    ]
    */

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

export const getByWeek = async (user) => {
  if (!user || !user.userId) {
    return { totalFocusTime: 0, groupTask: [] };
  }

  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusSessionCollectionId, [
      Query.equal('user_id', user.userId),
      Query.greaterThanEqual('start_time', weekAgo.toISOString()),
      Query.lessThanEqual('end_time', now.toISOString()), // Add this line
    ]);

    const sessions = response.documents;
    const formattedSessions = sessions.map((session) => ({
      taskName: session.task,
      focusTime: session.total_duration,
      color: session.color,
      completion: session.completion,
    }));

    return aggregateTaskData(formattedSessions); // Pass formatted sessions
  } catch (error) {
    console.error('Failed to get focus stats:', error);
    return { totalFocusTime: 0, groupTask: [] };
  }
};

export const getByMonth = async (user) => {
  if (!user || !user.userId) {
    return { totalFocusTime: 0, groupTask: [] };
  }

  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusSessionCollectionId, [
      Query.equal('user_id', user.userId),
      Query.greaterThanEqual('start_time', monthAgo.toISOString()),
      Query.lessThanEqual('end_time', now.toISOString()), //damn so it turns out my brain cant operate properly before i put start_time here lmfao
    ]);
    const sessions = response.documents;

    const formattedSessions = sessions.map((session) => ({
      taskName: session.task,
      focusTime: session.total_duration,
      color: session.color,
      completion: session.completion,
    }));

    return aggregateTaskData(formattedSessions); // Pass formatted sessions
  } catch (error) {
    console.error('Failed to get focus stats:', error);
    return { totalFocusTime: 0, groupTask: [] };
  }
};

export const getByYear = async (user) => {
  if (!user || !user.userId) {
    return { totalFocusTime: 0, groupTask: [] };
  }

  try {
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    yearAgo.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.focusSessionCollectionId, [
      Query.equal('user_id', user.userId),
      Query.greaterThanEqual('start_time', yearAgo.toISOString()),
      Query.lessThanEqual('end_time', now.toISOString()), // Add this line
    ]);

    const sessions = response.documents;
    const formattedSessions = sessions.map((session) => ({
      taskName: session.task,
      focusTime: session.total_duration,
      color: session.color,
      completion: session.completion,
    }));

    return aggregateTaskData(formattedSessions); // Pass formatted sessions
  } catch (error) {
    console.error('Failed to get focus stats:', error);
    return { totalFocusTime: 0, groupTask: [] };
  }
};

export async function saveFocusStats(stats, task, color, user) {
  if (!stats || !user || !user.userId) return null;

  const sessionData = {
    start_time: stats.startTime.toISOString(),
    end_time: stats.endTime.toISOString(),
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

//TO DO create index for focus stats in appwrite
