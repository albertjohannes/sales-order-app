import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useUpdates } from 'expo-updates';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HeaderWithSettingsProps {
  title: string;
  backgroundColor?: string;
  showCartIcon?: boolean;
  onCartPress?: () => void;
  cartItemCount?: number;
}

export default function HeaderWithSettings({ 
  title, 
  backgroundColor = '#007AFF',
  showCartIcon = false,
  onCartPress,
  cartItemCount = 0
}: HeaderWithSettingsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { currentlyRunning } = useUpdates();

  // Version labels (robust across dev/production)
  const expoConfig: any = (Constants as any).expoConfig || (Constants as any).manifest?.extra?.expoClient || {};
  const nativeAppVersion = (Constants as any).nativeAppVersion as string | undefined;
  const nativeBuildVersion = (Constants as any).nativeBuildVersion as string | undefined;
  const configVersion = (expoConfig?.version as string) || '';
  const iosBuildNumber = (expoConfig?.ios?.buildNumber as string) || '';
  const androidVersionCode = (expoConfig?.android?.versionCode as number | string) || '';

  // Prefer native values when available, else fall back to config
  const appVersion = nativeAppVersion || configVersion || '';
  let buildLabel = nativeBuildVersion || '';
  if (!buildLabel) {
    buildLabel = Platform.OS === 'ios' ? iosBuildNumber : String(androidVersionCode || '');
  }

  // Try to resolve commit id from multiple sources (Expo Updates manifest / extras / env)
  const manifest: any = (currentlyRunning as any)?.manifest || {};
  const commitFromManifest = manifest?.metadata?.commit
    || manifest?.metadata?.gitCommit
    || manifest?.gitCommitHash
    || manifest?.commit
    || manifest?.extra?.commit
    || manifest?.extra?.gitCommitHash
    || manifest?.extra?.git?.commit;
  const commitFromExtras = (expoConfig?.extra?.commit as string)
    || ((Constants as any).manifest?.extra?.commit as string);
  const commitFromEnv = (process as any)?.env?.EXPO_PUBLIC_GIT_SHA
    || (process as any)?.env?.EAS_BUILD_GIT_SHA
    || (process as any)?.env?.GIT_COMMIT
    || (process as any)?.env?.COMMIT_SHA;
  const commitRaw = commitFromManifest || commitFromExtras || commitFromEnv || '';
  const commitShort = typeof commitRaw === 'string' && commitRaw.length > 0 ? commitRaw.slice(0, 7) : '';

  // Try to resolve channel name
  const channelFromManifest = (currentlyRunning as any)?.metadata?.channel
    || manifest?.metadata?.channel
    || manifest?.metadata?.branchName
    || manifest?.extra?.channel
    || manifest?.extra?.branch
    || manifest?.extra?.eas?.channel
    || manifest?.extra?.expoClient?.channel;
  const channelFromExtras = expoConfig?.extra?.channel
    || ((Constants as any).manifest?.extra?.channel);
  const channelFromEnv = (process as any)?.env?.EXPO_PUBLIC_EAS_CHANNEL
    || (process as any)?.env?.EAS_CHANNEL
    || (process as any)?.env?.UPDATES_CHANNEL;
  const channelName = (channelFromManifest || channelFromExtras || channelFromEnv || '') as string;

  const appVersionLabelBase = appVersion ? `v${appVersion}` : '';
  const buildAndCommit = [buildLabel || '', commitShort || ''].filter(Boolean).join(', ');
  const appVersionLabel = appVersionLabelBase
    ? (buildAndCommit ? `${appVersionLabelBase} (${buildAndCommit})` : appVersionLabelBase)
    : '';


  const handleSignOut = () => {
    Alert.alert(
      t('signOut'),
      t('signOutConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('yes'),
          onPress: () => {
            setShowSettings(false);
            router.replace('/login');
          },
        },
      ]
    );
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.headerButtons}>
        {showCartIcon && onCartPress && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={onCartPress}
          >
            <IconSymbol name="cart" size={24} color="white" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.settingsIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSettings}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettings(false)}
        >
          <View style={styles.settingsMenu}>
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={toggleLanguage}
            >
              <Text style={styles.settingsOptionText}>
                {t('language')}: {language === 'id' ? t('indonesia') : t('english')}
              </Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={handleSignOut}
            >
              <Text style={styles.settingsOptionText}>{t('signOut')}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            {!!appVersionLabel && (
              <View style={styles.versionItem}>
                <Text style={styles.versionText}>App {appVersionLabel}</Text>
                {!!channelName && (
                  <Text style={styles.versionText}>Channel {channelName}</Text>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  settingsMenu: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  settingsOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  settingsOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  versionItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  versionText: {
    fontSize: 13,
    color: '#999',
  },
}); 