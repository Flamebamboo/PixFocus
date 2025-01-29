import { useGlobalContext } from '@/context/GlobalProvider';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React from 'react';
const useNotifications = () => {
  const { isNotificationsEnabled } = useGlobalContext();

  // Initialize notifications on hook mount
  React.useEffect(() => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      popInitialNotification: true,
      requestPermissions: true,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    });

    PushNotification.createChannel(
      {
        channelId: 'timer',
        channelName: 'Timer notifications',
        channelDescription: 'Notifications for timer completion',
      },
      () => {}
    );
  }, []);

  const checkAndRequestNotificationPermission = async () => {
    // Permission is handled by PushNotification.configure
    return PushNotification.checkPermissions((permissions) => {
      return permissions.alert;
    });
  };

  const createTimerCompletionNotification = async (duration) => {
    if (!isNotificationsEnabled) return;

    PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotificationSchedule({
      channelId: 'timer',
      title: 'Timer done!',
      message: 'Come back to start another session!',
      date: new Date(Date.now() + duration * 1000),
      allowWhileIdle: true, // Work even when app is in background
    });
  };

  return {
    checkAndRequestNotificationPermission,
    createTimerCompletionNotification,
  };
};

export default useNotifications;
