import { useLanguage } from '@/contexts/LanguageContext';
import { BalanceData } from '@/services/storage';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface BalanceDetailsModalProps {
  visible: boolean;
  balanceData: BalanceData | null;
  onClose: () => void;
}

export default function BalanceDetailsModal({
  visible,
  balanceData,
  onClose,
}: BalanceDetailsModalProps) {
  const { t } = useLanguage();

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!balanceData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('balanceDetails')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('outletInfo')}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>{t('outletInfo')} ID:</Text>
                <Text style={styles.value}>{balanceData.outlet_id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('outletInfo')} Name:</Text>
                <Text style={styles.value}>
                  {balanceData.outlet_Name || t('notAvailable')}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('distributorInfo')}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>{t('distributorInfo')} ID:</Text>
                <Text style={styles.value}>{balanceData.distributor_id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('distributorInfo')} Name:</Text>
                <Text style={styles.value}>{balanceData.distributor_name}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('limitInfo')}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>{t('limitType')}:</Text>
                <Text style={styles.value}>{balanceData.limit_type}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('plafondAmount')}:</Text>
                <Text style={styles.value}>{formatPrice(balanceData.plafond_amount)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('availableAmount')}:</Text>
                <Text style={[styles.value, styles.availableAmount]}>
                  {formatPrice(balanceData.available_amount)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('outstandingAmount')}:</Text>
                <Text style={[styles.value, styles.outstandingAmount]}>
                  {formatPrice(balanceData.outstanding_amount)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('holdAmount')}:</Text>
                <Text style={[styles.value, styles.holdAmount]}>
                  {formatPrice(balanceData.hold_amount)}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('lastUpdated')}</Text>
              <Text style={styles.lastUpdated}>
                {formatLastUpdated(balanceData.lastUpdated)}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  availableAmount: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  outstandingAmount: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  holdAmount: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
}); 