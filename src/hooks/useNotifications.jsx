import { useGlobalContext } from '@/context/GlobalProvider';
import * as Notifications from 'expo-notifications';

const useNotifications = () => {
  const { isNotificationsEnabled } = useGlobalContext();
  // const

  /*

  1) functions that Check if the app has permission to show notifications and request it if not

  2) functions that schedule a notification to be shown when timer ends
  when the user leaves the app save() from timerStorage are called from there we can get the time remaining 
  and schedule a notification to be shown when the timer is complete by using Date.now() + timeRemaining



  */

  const checkAndRequestNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
  };

  const schedulePushNotification = async ({ title, body, date }) => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        date,
      },
    });
    return id;
  };

  //since handleTimerCompletion cannot be called in the background to create this notification we need
  //to call this function when user leaves the app
  //sample didnt work

  const createTimerCompletionNotification = async (duration) => {
    if (!isNotificationsEnabled) return;
    const notificationId = await schedulePushNotification({
      title: 'Timer done!',
      body: 'Come back to start another session!',
      date: new Date(Date.now() + duration * 1000),
    });
    console.log('Notification scheduled with ID:', notificationId);
  };

  // First, set the handler that will cause the notification
  // to show the alert
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  //broken function need fix

  return {
    checkAndRequestNotificationPermission,
    createTimerCompletionNotification,
  };
};

export default useNotifications;
