import { useLanguage } from '@/contexts/LanguageContext';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  
  // Get success type from URL params
  const successType = params.type as string || 'order';
  
  // Determine success message based on type
  const getSuccessConfig = () => {
    switch (successType) {
      case 'receipt':
        return {
          title: t('receiptSuccess'),
          message: t('receiptSuccessMessage'),
          primaryButtonText: t('viewHistory'),
          secondaryButtonText: t('backToHome'),
          primaryAction: () => router.push('/(tabs)/history'),
          secondaryAction: () => router.push('/(tabs)'),
        };
      case 'order':
      default:
        return {
          title: t('orderSuccess'),
          message: t('thankYou'),
          primaryButtonText: t('viewOrder'),
          secondaryButtonText: t('backToHome'),
          primaryAction: () => router.push('/(tabs)/history'),
          secondaryAction: () => router.push('/(tabs)'),
        };
    }
  };

  const config = getSuccessConfig();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
        
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.message}>
          {config.message}
        </Text>
        
        <TouchableOpacity
          style={styles.historyButton}
          onPress={config.primaryAction}
        >
          <Text style={styles.historyButtonText}>{config.primaryButtonText}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.homeButton}
          onPress={config.secondaryAction}
        >
          <Text style={styles.homeButtonText}>{config.secondaryButtonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 32,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  historyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 200,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 