import { useGlobalContext } from '@/context/GlobalProvider';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
const useNotifications = () => {
  const { isNotificationsEnabled } = useGlobalContext();

  const checkAndRequestNotificationPermission = async () => {
    // Android handles notifications differently - permissions are granted by default for local notifications
    if (Platform.OS === 'android') {
      // On Android, local notifications don't require explicit permission for API < 33
      // For Android 13+ (API 33+), the permission is requested automatically when scheduling
      return Promise.resolve(true);
    }

    // iOS notification permission flow
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

    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllPendingNotificationRequests();
      PushNotificationIOS.addNotificationRequest({
        id: 'timer',
        title: 'Timer done!',
        body: 'Come back to start another session!',
        fireDate: new Date(Date.now() + duration * 1000),
        isCritical: true,
      });
    } else {
      // Android: Use Expo Notifications or react-native-push-notification
      // For now, log that Android notifications need to be implemented
      console.log('Android notification scheduled for:', duration, 'seconds');
      // TODO: Implement Android notification with expo-notifications or react-native-push-notification
    }
  };

  return {
    checkAndRequestNotificationPermission,
    createTimerCompletionNotification,
  };
};

export default useNotifications;
