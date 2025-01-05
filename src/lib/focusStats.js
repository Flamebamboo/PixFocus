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
        "task": "task",
        "color": "red",
        "user_id": "123",
        "email": "email"
      }
      and more from the current day
    ]
     
     */

    //adding today session to the total focus time in seconds
    const totalFocusTime = sessions.reduce((accu, current) => {
      return accu + current.total_duration;
    }, 0);

    const groupTask = sessions.reduce((accumulated, session) => {
      const existingTaskIndex = accumulated.findIndex((task) => task.label === session.task);

      if (existingTaskIndex !== -1) {
        accumulated[existingTaskIndex].value += session.total_duration;
      } else {
        accumulated.push({
          value: session.total_duration,
          label: session.task,
          color: session.color,
        });
      }

      return accumulated;
    }, []);

    /*
groupTask = [
  {
    value: 3000,  // 1000 + 2000
    label: "Math",
    frontColor: "red"
  },
  {
    value: 1500,
    label: "Reading",
    frontColor: "blue"
  }
]
*/
    // console.log('groupTask', groupTask);

    return {
      totalFocusTime,
      groupTask,
    };
  } catch (error) {
    console.error('Failed to get focus stats:', error);
    return { totalFocusTime: 0, groupTask: [] };
  }
}

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
