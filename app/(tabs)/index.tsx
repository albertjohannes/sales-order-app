import HeaderWithSettings from '@/components/HeaderWithSettings';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Index() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleOnboard = () => {
    router.push('/onboarding');
  };

  const handleOrder = () => {
    router.push('/order');
  };

  const handleCollection = () => {
    router.push('/collection');
  };

  const ActionCard = ({ 
    title, 
    description, 
    icon, 
    onPress, 
    color 
  }: { 
    title: string; 
    description: string; 
    icon: string; 
    onPress: () => void; 
    color: string; 
  }) => (
    <TouchableOpacity 
      style={[styles.actionCard, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionContent}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <IconSymbol name={icon} size={32} color="white" />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderWithSettings title={t('welcome')} />
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>{t('chooseAction')}</Text>
        
        <View style={styles.actionsContainer}>
          <ActionCard
            title={t('onboard')}
            description={t('onboardDesc')}
            icon="person.badge.plus"
            onPress={handleOnboard}
            color="#28a745"
          />
          
          <ActionCard
            title={t('order')}
            description={t('orderDesc')}
            icon="cart"
            onPress={handleOrder}
            color="#007AFF"
          />
          
          <ActionCard
            title={t('collection')}
            description={t('collectionDesc')}
            icon="creditcard"
            onPress={handleCollection}
            color="#FF6B35"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 