import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { BalanceData } from '@/data/mockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface PaymentMethodCardProps {
  balanceData: BalanceData | null;
  isLoadingBalance: boolean;
  onPress?: () => void;
  onRefresh?: () => void;
  showChevron?: boolean;
  showRefreshButton?: boolean;
  isRefreshing?: boolean;
  showLastUpdated?: boolean;
}

export default function PaymentMethodCard({
  balanceData,
  isLoadingBalance,
  onPress,
  onRefresh,
  showChevron = true,
  showRefreshButton = false,
  isRefreshing = false,
  showLastUpdated = false
}: PaymentMethodCardProps) {
  const { t } = useLanguage();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Alert.alert(
        t('paymentMethod'),
        'Credit balance is the default payment method.',
        [{ text: t('confirm'), style: 'default' }]
      );
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.paymentMethodCard}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.paymentMethodContent}>
          <View style={styles.paymentMethodIcon}>
            <Image
              source={require('@/assets/images/sales_logo.png')}
              style={styles.warungLogo}
              contentFit="contain"
            />
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={[styles.paymentMethodText, { color: colors.text }]}>
              {t('warungBalance')}
            </Text>
            {isLoadingBalance ? (
              <Text style={[styles.balanceText, { color: colors.text }]}>
                {t('loading')}
              </Text>
            ) : balanceData ? (
              <Text style={[styles.balanceText, { color: colors.tint }]}>
                {formatCurrency(balanceData.available_amount)}
              </Text>
            ) : (
              <Text style={[styles.balanceText, { color: '#999' }]}>
               {t('error')}
              </Text>
            )}
          </View>
        </View>
        {showRefreshButton ? (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isRefreshing}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={isRefreshing ? 'clock' : 'arrow.clockwise'}
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>
        ) : showChevron ? (
          <IconSymbol name="chevron.down" size={20} color={colors.text} />
        ) : null}
      </TouchableOpacity>
      
      {showLastUpdated && balanceData && (
        <Text style={styles.lastUpdated}>
          {t('lastUpdated')}: {new Date(balanceData.lastUpdated).toLocaleString('id-ID')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  paymentMethodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warungLogo: {
    width: 32,
    height: 32,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
    marginLeft: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 