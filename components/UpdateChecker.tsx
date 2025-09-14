import { useLanguage } from '@/contexts/LanguageContext';
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UpdateCheckerProps {
  children: React.ReactNode;
}

export function UpdateChecker({ children }: UpdateCheckerProps) {
  const { t } = useLanguage();
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
          t('updateAvailable'),
          t('updateAvailableMessage'),
          [
            {
              text: t('later'),
              style: 'cancel',
            },
            {
              text: t('updateNow'),
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
      Alert.alert(
        t('updateDownloaded'),
        t('updateRestartMessage'),
        [
          {
            text: t('restartNow'),
            onPress: () => Updates.reloadAsync(),
          },
        ]
      );
    } catch (error) {
      console.log('Error downloading update:', error);
      Alert.alert(t('updateFailed'), t('updateFailedMessage'));
    }
  };

  return <>{children}</>;
}
