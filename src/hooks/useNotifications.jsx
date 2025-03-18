import { useGlobalContext } from '@/context/GlobalProvider';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
const useNotifications = () => {
  const { isNotificationsEnabled } = useGlobalContext();

  const checkAndRequestNotificationPermission = async () => {
    // First check current permission status
    return new Promise((resolve) => {
      PushNotificationIOS.checkPermissions(async (permissions) => {
        // If permissions are not granted, request them
        if (!permissions.alert) {
          try {
            const result = await PushNotificationIOS.requestPermissions();
            // If still not granted after request (means user denied before)
            if (!result.alert) {
              // Show custom alert to direct user to settings
              Alert.alert(
                'Notifications Disabled',
                'We need notifications to alert you when your timer ends. Please enable them in Settings.',
                [
                  {
                    text: 'Later',
                    style: 'cancel',
                    onPress: () => resolve(false),
                  },
                  {
                    text: 'Go to Settings',
                    onPress: () => {
                      Linking.openSettings();
                      resolve(false);
                    },
                  },
                ]
              );
            } else {
              resolve(result.alert);
            }
          } catch (error) {
            console.error('Error requesting permissions:', error);
            resolve(false);
          }
        } else {
          resolve(permissions.alert);
        }
      });
    });
  };

  const createTimerCompletionNotification = async (duration) => {
    if (!isNotificationsEnabled) return;

    PushNotificationIOS.removeAllPendingNotificationRequests();
    PushNotificationIOS.addNotificationRequest({
      id: 'timer',
      title: 'Timer done!',
      body: 'Come back to start another session!',
      fireDate: new Date(Date.now() + duration * 1000),
      isCritical: true,
    });
  };

  return {
    checkAndRequestNotificationPermission,
    createTimerCompletionNotification,
  };
};

export default useNotifications;
