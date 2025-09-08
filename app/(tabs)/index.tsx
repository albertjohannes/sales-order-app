import BannerCarousel from '@/components/BannerCarousel';
import HeaderWithSettings from '@/components/HeaderWithSettings';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const { t } = useLanguage();
  const router = useRouter();

  // Banner images
  const bannerImages = [
    require('@/assets/images/banners/banner_1.png'),
    require('@/assets/images/banners/banner_2.png'),
    require('@/assets/images/banners/banner_3.png'),
  ];

  const handleOnboard = () => {
    router.push('/onboarding');
  };



  const handleCollection = () => {
    router.push('/collection');
  };

  const ActionCard = ({ 
    title, 
    description, 
    icon, 
    onPress, 
    color,
    gradient 
  }: { 
    title: string; 
    description: string; 
    icon: string; 
    onPress: () => void; 
    color: string;
    gradient: string[];
  }) => (
    <TouchableOpacity 
      style={styles.actionCard} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardGradient}>
        <View style={styles.cardPattern} />
        <View style={styles.actionContent}>
          <View style={styles.actionLeft}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
              <IconSymbol name={icon} size={24} color="white" />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{title}</Text>
              <Text style={styles.actionDescription}>{description}</Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <IconSymbol name="chevron.right" size={16} color="white" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

    return (
    <View style={styles.container}>
      <HeaderWithSettings title={t('welcome')} />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
        <View style={styles.wave1} />
        <View style={styles.wave2} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>{t('salesApp')}</Text>
          <Text style={styles.subtitle}>{t('chooseAction')}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <ActionCard
            title={t('onboard')}
            description={t('onboardDesc')}
            icon="person.badge.plus"
            onPress={handleOnboard}
            color="#667eea"
            gradient={['#667eea', '#764ba2']}
          />
          
          <ActionCard
            title={t('collection')}
            description={t('collectionDesc')}
            icon="creditcard"
            onPress={handleCollection}
            color="#f093fb"
            gradient={['#f093fb', '#f5576c']}
          />
        </View>

        {/* Banner Carousel */}
        <View style={styles.bannerSection}>
          <BannerCarousel banners={bannerImages} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  circle1: {
    position: 'absolute',
    top: 80,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
  },
  circle2: {
    position: 'absolute',
    top: 250,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(240, 147, 251, 0.08)',
  },
  circle3: {
    position: 'absolute',
    bottom: 150,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(118, 75, 162, 0.08)',
  },
  wave1: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(102, 126, 234, 0.04)',
    transform: [{ rotate: '-3deg' }],
  },
  wave2: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(240, 147, 251, 0.04)',
    transform: [{ rotate: '2deg' }],
  },
  headerSection: {
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingTop: 20,
    paddingHorizontal: 4,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'left',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#666',
    textAlign: 'left',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  actionsContainer: {
    gap: 20,
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  bannerSection: {
    marginTop: 10,
  },
  actionCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },
  cardGradient: {
    backgroundColor: '#007AFF',
    padding: 24,
    minHeight: 120,
    position: 'relative',
    overflow: 'hidden',
  },
  cardPattern: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    opacity: 0.9,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 