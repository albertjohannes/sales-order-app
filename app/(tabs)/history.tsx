import HeaderWithSettings from '@/components/HeaderWithSettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { Outlet, PaymentCollection, Transaction } from '@/data/mockData';
import { getOutlets, getPaymentCollections, getTransactions } from '@/services/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type TabType = 'orders' | 'collections' | 'onboard';

export default function HistoryTabScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get initial tab from URL params or default to collections
  const initialTab = (params.tab as TabType) || 'collections';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentCollections, setPaymentCollections] = useState<PaymentCollection[]>([]);
  const [onboardingRecords, setOnboardingRecords] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [storedTransactions, storedCollections, storedOutlets] = await Promise.all([
        getTransactions(),
        getPaymentCollections(),
        getOutlets()
      ]);
      setTransactions(storedTransactions);
      setPaymentCollections(storedCollections);
      setOnboardingRecords(storedOutlets);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleOnboardingRecordTap = (outlet: Outlet) => {
    // Show detailed outlet information in an alert
    Alert.alert(
      outlet.name,
      `${t('outletAddress')}: ${outlet.streetAddress}\n` +
      `${t('outletProvince')}: ${outlet.province?.name || t('notAvailable')}\n` +
      `${t('outletCity')}: ${outlet.regency?.name || t('notAvailable')}\n` +
      `${t('district')}: ${outlet.district?.name || t('notAvailable')}\n` +
      `${t('village')}: ${outlet.village?.name || t('notAvailable')}\n` +
      `${t('postalCode')}: ${outlet.postalCode}\n` +
      `${t('coordinates')}: ${outlet.latitude && outlet.longitude ? `${outlet.latitude}, ${outlet.longitude}` : t('notAvailable')}\n` +
      `${t('photos')}: ${t('ktp')} ${outlet.ktpPhoto ? '✓' : '✗'}, ${t('outside')} ${outlet.outsidePhotos.filter(p => p).length}/3, ${t('inside')} ${outlet.insidePhotos.filter(p => p).length}/3, ${t('inventory')} ${outlet.inventoryPhotos.filter(p => p).length}/3\n` +
      `Created: ${formatDateTime(outlet.createdAt)}\n` +
      `Last Updated: ${formatDateTime(outlet.updatedAt)}`,
      [
        { text: t('close'), style: 'cancel' }
      ]
    );
  };





  // Group payment collections by date
  const groupedCollections = paymentCollections.reduce((groups, collection) => {
    const date = new Date(collection.collectionDate).toLocaleDateString('en-CA');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(collection);
    return groups;
  }, {} as Record<string, PaymentCollection[]>);

  // Group onboarding records by date
  const groupedOnboardingRecords = onboardingRecords.reduce((groups, record) => {
    const date = new Date(record.createdAt).toLocaleDateString('en-CA');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, any[]>);

  // Sort dates in descending order
  const sortedCollectionDates = Object.keys(groupedCollections).sort((a, b) => 
    new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()
  );

  const sortedOnboardingDates = Object.keys(groupedOnboardingRecords).sort((a, b) => 
    new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()
  );

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  const renderCollection = ({ item }: { item: PaymentCollection }) => (
    <TouchableOpacity 
      style={[
        styles.transactionCard,
        item.status === 'completed' && styles.completedCollection,
        item.status === 'pending' && styles.pendingCollection,
        item.status === 'failed' && styles.failedCollection
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTime}>{formatDate(item.collectionDate)}</Text>
          <Text style={styles.transactionId} numberOfLines={1}>
            {item.id}
          </Text>
          <View style={[
            styles.statusBadge,
            item.status === 'completed' && styles.statusCompleted,
            item.status === 'pending' && styles.statusPending,
            item.status === 'failed' && styles.statusFailed
          ]}>
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.transactionAmountContainer}>
        <Text style={styles.transactionTotal}>{formatPrice(item.invoiceAmount)}</Text>
      </View>
      
      <View style={styles.collectionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('outlet')}:</Text>
          <Text style={styles.detailValue}>{item.outletName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('invoice')}:</Text>
          <Text style={styles.detailValue}>{item.invoiceId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('authCode')}:</Text>
          <Text style={styles.detailValue} numberOfLines={1}>{item.authorizationCode}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderOnboardingRecord = ({ item }: { item: Outlet }) => (
    <TouchableOpacity 
      style={[
        styles.transactionCard,
        styles.completedCollection // All stored outlets are considered completed
      ]}
      activeOpacity={0.8}
      onPress={() => handleOnboardingRecordTap(item)}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTime}>{formatDateTime(item.createdAt)}</Text>
          <Text style={styles.transactionId} numberOfLines={1}>
            {item.id}
          </Text>
          <View style={[
            styles.statusBadge,
            styles.statusCompleted
          ]}>
            <Text style={styles.statusText}>
              {t('completed')}
            </Text>
          </View>
        </View>
        <View style={styles.photoSummary}>
          <Text style={styles.photoSummaryText}>
            📸 {item.ktpPhoto ? '✓' : '✗'} • {item.outsidePhotos.filter(p => p).length}/3 • {item.insidePhotos.filter(p => p).length}/3 • {item.inventoryPhotos.filter(p => p).length}/3
          </Text>
        </View>
      </View>
      
      <View style={styles.collectionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('outletName')}:</Text>
          <Text style={styles.detailValue}>{item.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('outletAddress')}:</Text>
          <Text style={styles.detailValue} numberOfLines={2}>{item.streetAddress}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('outletCity')}:</Text>
                          <Text style={styles.detailValue}>{item.regency?.name || t('notAvailable')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('outletProvince')}:</Text>
                <Text style={styles.detailValue}>{item.province?.name || t('notAvailable')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('district')}:</Text>
                <Text style={styles.detailValue}>{item.district?.name || t('notAvailable')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('village')}:</Text>
                <Text style={styles.detailValue}>{item.village?.name || t('notAvailable')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('postalCode')}:</Text>
                <Text style={styles.detailValue}>{item.postalCode}</Text>
              </View>
              {item.latitude && item.longitude && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('coordinates')}:</Text>
                  <Text style={styles.detailValue}>{item.latitude}, {item.longitude}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('photos')}:</Text>
                <Text style={styles.detailValue}>
                  {item.ktpPhoto ? '✓' : '✗'} • 
                  {item.outsidePhotos.filter(p => p).length}/3 • 
                  {item.insidePhotos.filter(p => p).length}/3 • 
                  {item.inventoryPhotos.filter(p => p).length}/3
                </Text>
              </View>
              <View style={styles.photoLegend}>
                <Text style={styles.photoLegendText}>{t('ktp')} • {t('outside')} • {t('inside')} • {t('inventory')}</Text>
              </View>
      </View>
    </TouchableOpacity>
  );

  const renderDateSection = ({ item }: { item: string }) => (
    <View style={styles.dateSection}>
      <Text style={styles.dateHeader}>{formatDate(item)}</Text>
      {activeTab === 'collections' ? (
        groupedCollections[item]?.map((collection: PaymentCollection, index: number) => (
          <View key={collection.id} style={styles.transactionWrapper}>
            {renderCollection({ item: collection })}
          </View>
        ))
      ) : (
        groupedOnboardingRecords[item]?.map((record: Outlet, index: number) => (
          <View key={record.id} style={styles.transactionWrapper}>
            {renderOnboardingRecord({ item: record })}
          </View>
        ))
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyHistory}>
      <Text style={styles.emptyHistoryText}>
        {activeTab === 'collections' ? t('noCollections') : 
         t('noOnboardingRecords')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderWithSettings title={t('history')} />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'collections' && styles.activeTabButton]}
          onPress={() => setActiveTab('collections')}
        >
          <Text style={[styles.tabText, activeTab === 'collections' && styles.activeTabText]}>
            {t('collections')}
          </Text>
          {paymentCollections.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{paymentCollections.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'onboard' && styles.activeTabButton]}
          onPress={() => setActiveTab('onboard')}
        >
          <Text style={[styles.tabText, activeTab === 'onboard' && styles.activeTabText]}>
            {t('onboard')}
          </Text>
          {onboardingRecords.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{onboardingRecords.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={
            activeTab === 'collections' ? sortedCollectionDates : 
            sortedOnboardingDates
          }
          renderItem={renderDateSection}
          keyExtractor={(item) => item}
          style={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  transactionsList: {
    flex: 1,
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  transactionWrapper: {
    marginBottom: 8,
  },
  transactionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.05)',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionIds: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionId: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  loanIdContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  transactionAmountContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    alignItems: 'flex-end',
  },
  loanIdBanner: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  loanIdText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },

  receiptComplete: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
  },
  receiptPendingButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  receiptPending: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginTop: 4,
  },
  itemsList: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyHistoryText: {
    fontSize: 18,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingTransaction: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  completedCollection: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  pendingCollection: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  failedCollection: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  // New styles for collections tab
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
  statusFailed: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  collectionDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  photoLegend: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  photoLegendText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  photoSummary: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  photoSummaryText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
}); 