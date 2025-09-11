import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Updates from 'expo-updates';

interface UpdateCheckerProps {
  children: React.ReactNode;
}

export function UpdateChecker({ children }: UpdateCheckerProps) {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      if (__DEV__) {
        // Skip update check in development
        return;
      }

      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        setIsUpdateAvailable(true);
        Alert.alert(
          'Update Available',
          'A new version of the app is available. Would you like to download and install it now?',
          [
            {
              text: 'Later',
              style: 'cancel',
            },
            {
              text: 'Update Now',
              onPress: downloadAndInstallUpdate,
            },
          ]
        );
      }
    } catch (error) {
      console.log('Error checking for updates:', error);
    }
  };

  const downloadAndInstallUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      console.log('Error downloading update:', error);
      Alert.alert('Update Failed', 'Failed to download update. Please try again later.');
    }
  };

  return <>{children}</>;
}
