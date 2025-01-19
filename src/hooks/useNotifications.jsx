import { useGlobalContext } from '@/context/GlobalProvider';
import notifee from '@notifee/react-native';

const useNotifications = () => {
  const { isNotificationsEnabled } = useGlobalContext();

  const createTimerCompletionNotification = async (title, body) => {
    if (!isNotificationsEnabled) return;

    try {
      // Only show notification if app is in background or inactive
      await notifee.requestPermission();

      await notifee.displayNotification({
        title,
        body,
        ios: {
          sound: 'default',
          foregroundPresentationOptions: {
            sound: true,
            banner: true,
          },
        },
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    await notifee.cancelAllNotifications();
  };

  return {
    createTimerCompletionNotification,
    cancelAllNotifications,
  };
};

export default useNotifications;
