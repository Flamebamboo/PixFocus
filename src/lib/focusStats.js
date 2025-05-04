import { Client, Databases, ID, Query } from 'react-native-appwrite';
import { appwriteConfig } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

// timezone stuff
import * as Localization from 'expo-localization';
import { fromZonedTime } from 'date-fns-tz';

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
    username: user.username,
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

export async function getLeaderboardData() {
  try {
    // 1. Fetch all users who opted into the leaderboard
    const userResponse = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collectionId, [
      Query.equal('leaderboard', true),
    ]);

    // create a users variable to store the users documents remember that listDocuments returns a promise  an object with total and documents
    const users = userResponse.documents;

    // 2. define the date for this leaderboard data

    // create a logic to only fetch the data from the current week ~ data resets everyweek
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + now.getDay());
    endOfWeek.setHours(23, 59, 59, 999);

    const startTime = startOfWeek.toISOString();
    const endTime = endOfWeek.toISOString();

    // 3. Aggregate focus time wuth focusSession collection  for each user

    // const fakeNames = [
    //   'Tungtung Sahur',
    //   'Peppa Pig',
    //   'Shinchan',
    //   'Doraemon',
    //   'Ultraman',
    //   'Saitama',
    //   'Bald Martin',
    //   'Beluga',
    //   'Gigachad',
    //   'Skibidi Toilet',
    //   'Quandale Dingle',
    //   'Sigma Patrick',
    //   'Bingus',
    //   'Shrek',
    //   'Minions',
    //   'Ronaldo Zoo Celebration',
    //   'Mr. Bean',
    //   'Gojo',
    //   'Walter White',
    //   'Saul Goodman',
    //   'Barbie',
    //   'Cocomelon',
    //   'Megalodon',
    //   'Mickey Mouse',
    //   'Ratatouille',
    //   'Grimace',
    //   'Tinky Winky',
    //   'Boohbah',
    //   'Big Smoke',
    //   'CJ',
    //   'San Andreas Police',
    //   'Om Nom',
    //   'Talking Ben',
    //   'Talking Tom',
    //   'Doge',
    //   'Cheems',
    //   'Zaza Zoom',
    //   'Ben 10',
    //   'Finn and Jake',
    //   'Gumball',
    //   'Darwin',
    //   'Pibby',
    //   'Kermit',
    //   'Elmo',
    //   'SpongeBob',
    //   'Squidward',
    //   'Giga Peppa',
    //   'Nyan Cat',
    //   'Hello Kitty',
    //   'Zabivaka',
    //   'LankyBox',
    //   'Meowbahh',
    //   'Jeff the Killer',
    //   'Slenderman',
    //   'Momo',
    //   'Nikocado Avocado',
    //   'MrBeast',
    //   'Dream',
    //   'Minecraft Steve',
    //   'Among Us',
    //   'Sus Remy',
    //   'Baldi',
    //   'Granny',
    //   'Roblox Noob',
    //   'Shaggy Ultra Instinct',
    //   'Choo Choo Charles',
    //   'Banban',
    //   'Jellybean',
    //   'Skibidibop mm dada',
    //   'Womp Womp',
    //   'Skull Emoji Guy',
    //   'Subway Surfers Guy',
    //   'Barry Bee Benson',
    //   'Lightning McQueen',
    //   'Mater',
    //   'Tow Mater Drip',
    //   'Spider-Man (PS1 Swing)',
    //   'Morbius',
    //   'Jesse Pinkman',
    //   'Heisenberg',
    //   'Megamind',
    //   'Gru',
    //   'Vector',
    //   'Robbie Rotten',
    //   'LazyTown Pixel',
    //   'Bert and Ernie',
    //   'Aggressive Elmo',
    //   'Badtz-Maru',
    //   'Chipi Chipi Chapa Chapa',
    //   'Zamzam Zoom',
    //   'Onii-Chan',
    //   'UwU Slayer',
    //   'Siren Head',
    //   'Cartoon Cat',
    //   'Wendigo',
    //   'Wojak',
    //   'NPC TikToker',
    //   'Barney (Scary Edition)',
    //   'Thanos Twerking',
    //   'Toothless on Drugs',
    //   'Kirby but Gigachad',
    //   'Yoshi Drip',
    //   'Luigi Death Stare',
    //   'Mario Judging You',
    //   'Waluigi Thirst Trap',
    //   'Chad Pikachu',
    //   'Piplup Supreme',
    //   'Angry Bird',
    //   'Flappy Bird Ghost',
    //   'Minion Mafia',
    //   'Angry Dora',
    //   'Swiper No Swiping',
    //   'Boots with a Glock',
    //   'Elsa vs Spiderman (Weird YouTube)',
    //   'Boss Baby',
    //   'Baby Shark Mafia Remix',
    // ];

    // const leaderboard = fakeNames.map((name) => ({
    //   totalFocusTime: Math.floor(Math.random() * 10000) + 1945, // random focus time between 1000 and 10999
    //   username: name,
    // }));

    for (const user of users) {
      //for every single user in the response document we want to combine all focus session
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.focusSessionCollectionId,
        [
          Query.equal('user_id', user.userId),
          Query.greaterThanEqual('start_time', startTime),
          Query.lessThanEqual('end_time', endTime),
        ]
      );
      console.log('Response for user:', user.userId, response);
      const sessions = response.documents;
      const totalFocusTime = sessions.reduce((sum, session) => sum + (session.total_duration || 0), 0);

      leaderboard.push({
        userId: user.userId,
        username: user.username,
        totalFocusTime,
      });
    }

    // 4. Sort by totalFocusTime descending and return top 10
    return leaderboard.sort((a, b) => b.totalFocusTime - a.totalFocusTime).slice(0, 10);
  } catch (error) {
    console.error('Failed to get leaderboard data:', error);
    return [];
  }
}
