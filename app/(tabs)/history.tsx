import { ErrorBoundary } from '@/components/ErrorBoundary';
import HeaderWithSettings from '@/components/HeaderWithSettings';
import OutletDetailModal from '@/components/OutletDetailModal';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Outlet, PaymentCollection, Transaction } from '@/data/mockData';
import { useApi } from '@/services/api';
import { getOutlets, getPaymentCollections, getTransactions, savePaymentCollection } from '@/services/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

function HistoryTabScreenContent() {
  const { t } = useLanguage();
  const { email } = useAuth();
  const api = useApi();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get initial tab from URL params or default to collections
  const initialTab = (params.tab as TabType) || 'collections';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentCollections, setPaymentCollections] = useState<PaymentCollection[]>([]);
  const [onboardingRecords, setOnboardingRecords] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

  // Reload data when screen comes into focus (includes initial load)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load from local storage
      const [storedTransactions, storedCollections, storedOutlets] = await Promise.all([
        getTransactions(),
        getPaymentCollections(),
        getOutlets()
      ]);
      
      console.log(`[HISTORY] Loaded from local storage:`, {
        transactions: storedTransactions.length,
        collections: storedCollections.length,
        outlets: storedOutlets.length
      });
      
      // Debug local collections
      console.log('[HISTORY] Local collections:', storedCollections);
      
      setTransactions(storedTransactions);
      
      // Merge local and API data for collections
      let mergedCollections = [...storedCollections];
      let mergedOutlets = [...storedOutlets];
      
      // Also try to load from backend API (optional - don't fail if backend is down)
      if (email) {
        try {
          const [backendCollections, backendOnboarding] = await Promise.all([
            api.getCollections(),
            api.getOnboarding()
          ]);

          // Map collections API data to PaymentCollection shape if available
          if (backendCollections?.data && Array.isArray(backendCollections.data)) {
            console.log('[HISTORY] Raw API collections data:', backendCollections.data.length, 'items');
            console.log('[HISTORY] Raw API collections:', backendCollections.data);
            
            const apiCollections: PaymentCollection[] = backendCollections.data.map((r: any) => ({
              id: r.id || r.collectionId || `COL-${r.created_at || Date.now()}`,
              outletId: r.outletId || r.outlet_id || '',
              outletName: r.outletName || r.outlet_name || r.outletId || '-',
              invoiceId: r.invoiceId || r.invoice_id || r.id || '-',
              authorizationCode: r.authorizationCode || r.authorization_code || '-',
              invoiceAmount: r.amount || r.invoiceAmount || 0,
              collectionDate: r.createdAt || r.created_at || new Date().toISOString(),
              status: (r.status as any) || 'completed',
              syncStatus: 'synced', // API data is always synced
              // extra display fields not in PaymentCollection type
              ...(r.method ? { method: r.method } : {}),
              ...(r.note || r.notes ? { notes: r.note || r.notes } : {}),
            }));
            
            console.log('[HISTORY] Mapped API collections:', apiCollections);
            
            // Merge API and local collections, prioritizing API data
            // Create a map to track collections by backend ID to prevent duplicates
            const collectionMap = new Map();
            
            // First, add all API collections (these take priority)
            apiCollections.forEach(collection => {
              collectionMap.set(collection.id, collection);
            });
            
            // Then, add local collections only if they don't already exist
            // Check by both ID and other identifying fields to prevent duplicates
            storedCollections.forEach(localCollection => {
              const exists = Array.from(collectionMap.values()).some(apiCollection => {
                // Exact ID match
                if (apiCollection.id === localCollection.id) {
                  return true;
                }
                
                // Check if this is the same transaction with different IDs
                // This happens when a local collection gets synced and gets a new database ID
                const sameAmount = Math.abs((apiCollection.invoiceAmount || 0) - (localCollection.invoiceAmount || 0)) < 0.01;
                const sameTime = Math.abs(new Date(apiCollection.collectionDate).getTime() - new Date(localCollection.collectionDate).getTime()) < 300000; // Within 5 minutes
                const sameOutlet = (apiCollection.outletId || apiCollection.outletName || '') === (localCollection.outletId || localCollection.outletName || '');
                
                // If all three match, it's likely the same transaction
                if (sameAmount && sameTime && sameOutlet) {
                  console.log(`[HISTORY] Detected duplicate collection:`, {
                    apiId: apiCollection.id,
                    localId: localCollection.id,
                    amount: apiCollection.invoiceAmount,
                    date: apiCollection.collectionDate,
                    outlet: apiCollection.outletId || apiCollection.outletName
                  });
                  return true;
                }
                
                return false;
              });
              
              if (!exists) {
                collectionMap.set(localCollection.id, localCollection);
              }
            });
            
            // Convert map back to array
            mergedCollections = Array.from(collectionMap.values());
          }

          // Map onboarding API data to Outlet shape if available
          if (backendOnboarding?.data && Array.isArray(backendOnboarding.data)) {
            const apiOutlets = backendOnboarding.data.map((r: any) => ({
              id: r.id || r.outletId || `OUTLET-${r.created_at || Date.now()}`,
              name: r.name || '',
              streetAddress: r.streetAddress || r.street_address || '',
              province: r.province || null,
              regency: r.regency || null,
              district: r.district || null,
              village: r.village || null,
              postalCode: r.postalCode || r.postal_code || '',
              latitude: r.latitude || '',
              longitude: r.longitude || '',
              ktpPhoto: r.ktpPhoto || r.ktp_photo || '',
              outsidePhotos: r.outsidePhotos || r.outside_photos || [],
              insidePhotos: r.insidePhotos || r.inside_photos || [],
              inventoryPhotos: r.inventoryPhotos || r.inventory_photos || [],
              // Questionnaire fields
              quizTopSellingItems: r.quizTopSellingItems || r.quiz_top_selling_items || [],
              quizPrimaryDistributor: r.quizPrimaryDistributor || r.quiz_primary_distributor || '',
              quizReorderFrequency: r.quizReorderFrequency || r.quiz_reorder_frequency || '',
              quizBusinessType: r.quizBusinessType || r.quiz_business_type || '',
              quizYearsInBusiness: r.quizYearsInBusiness || r.quiz_years_in_business || null,
              createdAt: r.createdAt || r.created_at || new Date().toISOString(),
              updatedAt: r.updatedAt || r.updated_at || r.createdAt || new Date().toISOString(),
              syncStatus: 'synced' as const, // API data is always synced
            }));
            
            // Merge API and local outlets, prioritizing API data
            // Create a map to track outlets by backend ID to prevent duplicates
            const outletMap = new Map();
            
            // First, add all API outlets (these take priority)
            apiOutlets.forEach(outlet => {
              outletMap.set(outlet.id, outlet);
            });
            
            // Then, add local outlets only if they don't already exist
            // Check by both ID and other identifying fields to prevent duplicates
            storedOutlets.forEach(localOutlet => {
              const exists = Array.from(outletMap.values()).some(apiOutlet => 
                apiOutlet.id === localOutlet.id ||
                (apiOutlet.name === localOutlet.name && 
                 apiOutlet.streetAddress === localOutlet.streetAddress &&
                 Math.abs(new Date(apiOutlet.createdAt).getTime() - new Date(localOutlet.createdAt).getTime()) < 60000) // Within 1 minute
              );
              
              if (!exists) {
                outletMap.set(localOutlet.id, localOutlet);
              }
            });
            
            // Convert map back to array
            mergedOutlets = Array.from(outletMap.values());
          }
        } catch (apiError) {
          // Don't show error to user, just log it
        }
      }
      
      console.log(`[HISTORY] Final merged data:`, {
        collections: mergedCollections.length,
        outlets: mergedOutlets.length
      });
      // Debug print collections list (Riwayat -> Koleksi)
      try {
        console.log('[HISTORY] Final merged collections list:');
        console.log('[HISTORY] Total collections:', mergedCollections.length);
        mergedCollections.forEach((c, idx) => {
          console.log(`[HISTORY] #${idx + 1}`, {
            id: c.id,
            outletId: c.outletId,
            outletName: (c as any).outletName,
            invoiceId: c.invoiceId,
            amount: c.invoiceAmount,
            status: c.status,
            date: c.collectionDate,
            sync: c.syncStatus || 'n/a'
          });
        });
      } catch (e) {
        console.error('[HISTORY] Error logging collections:', e);
      }
      
      setPaymentCollections(mergedCollections);
      setOnboardingRecords(mergedOutlets);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleOnboardingRecordTap = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setDetailVisible(true);
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

  // Retry sync for a failed collection
  const handleRetrySync = async (collection: PaymentCollection) => {
    try {
      // Update sync status to pending
      const pendingCollection = { ...collection, syncStatus: 'pending' as const };
      await savePaymentCollection(pendingCollection);
      
      // Reload data to show updated status
      loadData();
      
      // Try to sync with backend
      try {
        await api.createCollection({
          outletId: collection.outletId,
          amount: collection.invoiceAmount,
          method: 'cash',
          note: collection.notes,
          attachments: []
        });
        
        // Update to synced
        const syncedCollection = { ...collection, syncStatus: 'synced' as const };
        await savePaymentCollection(syncedCollection);
        
        Alert.alert(
          'Success',
          'Sync successful'
        );
      } catch (error) {
        // Update to failed
        const failedCollection = { ...collection, syncStatus: 'failed' as const };
        await savePaymentCollection(failedCollection);
        
        Alert.alert(
          'Error',
          'Sync failed'
        );
      }
      
      // Reload data to show final status
      loadData();
    } catch (error) {
      console.error('Error during retry sync:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
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
          <View style={styles.statusRow}>
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
            {/* Sync Status Indicator */}
            {item.syncStatus && (
              <View style={[
                styles.syncBadge,
                item.syncStatus === 'synced' && styles.syncSynced,
                item.syncStatus === 'pending' && styles.syncPending,
                item.syncStatus === 'failed' && styles.syncFailed
              ]}>
                <Text style={styles.syncText}>
                  {item.syncStatus === 'synced' ? '☁️' : 
                   item.syncStatus === 'pending' ? '📱' : '❌'}
                </Text>
              </View>
            )}
            {/* Retry Button for Failed Syncs */}
            {item.syncStatus === 'failed' && (
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => handleRetrySync(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.retryButtonText}>🔄</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.transactionAmountContainer}>
        <Text style={styles.transactionTotal}>{formatPrice(item.invoiceAmount)}</Text>
      </View>
      
      <View style={styles.collectionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('outletName')}:</Text>
          <Text style={styles.detailValue}>{(item as any).outlet_name || item.outletName || item.outletId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Method:</Text>
          <Text style={styles.detailValue}>{(item as any).method || '-'}</Text>
        </View>
        {!!(item as any).notes && (
          <View style={[styles.detailRow, { alignItems: 'flex-start' }]}>
            <Text style={styles.detailLabel}>Note:</Text>
            <Text style={[styles.detailValue, styles.multilineValue]}>{(item as any).notes}</Text>
          </View>
        )}
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
          <View style={styles.statusRow}>
            <View style={[
              styles.statusBadge,
              styles.statusCompleted
            ]}>
              <Text style={styles.statusText}>
                {t('completed')}
              </Text>
            </View>
            {/* Sync Status Indicator */}
            {item.syncStatus && (
              <View style={[
                styles.syncBadge,
                item.syncStatus === 'synced' && styles.syncSynced,
                item.syncStatus === 'pending' && styles.syncPending,
                item.syncStatus === 'failed' && styles.syncFailed
              ]}>
                <Text style={styles.syncText}>
                  {item.syncStatus === 'synced' ? '☁️' : 
                   item.syncStatus === 'pending' ? '📱' : '❌'}
                </Text>
              </View>
            )}
          </View>
        </View>
        {item.syncStatus !== 'synced' && (
          <TouchableOpacity
            style={styles.syncNowButton}
            onPress={async () => {
              try {
                // Attempt re-sync: send minimal payload to backend
                const payload = {
                  name: item.name,
                  streetAddress: item.streetAddress,
                  province: item.province ? { code: item.province.code, name: item.province.name } : null,
                  regency: item.regency ? { code: item.regency.code, name: item.regency.name } : null,
                  district: item.district ? { code: item.district.code, name: item.district.name } : null,
                  village: item.village ? { code: item.village.code, name: item.village.name } : null,
                  postalCode: item.postalCode,
                  latitude: item.latitude,
                  longitude: item.longitude,
                  ktpPhoto: item.ktpPhoto,
                  outsidePhotos: item.outsidePhotos,
                  insidePhotos: item.insidePhotos,
                  inventoryPhotos: item.inventoryPhotos,
                  quizTopSellingItems: item.quizTopSellingItems || [],
                  quizPrimaryDistributor: item.quizPrimaryDistributor || '',
                  quizReorderFrequency: item.quizReorderFrequency || '',
                  quizBusinessType: item.quizBusinessType || '',
                  quizYearsInBusiness: item.quizYearsInBusiness || null,
                } as any;
                await api.createOnboarding(payload);
              } catch (e) {
              } finally {
                // Refresh list regardless of success/failure
                loadData();
              }
            }}
          >
            <Text style={styles.syncNowButtonText}>{t('refresh')}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.photoSummary}>
          <Text style={styles.photoSummaryText}>
            📸 {item.ktpPhoto ? '✓' : '✗'} • {(item.outsidePhotos || []).filter(p => p).length}/3 • {(item.insidePhotos || []).filter(p => p).length}/3 • {(item.inventoryPhotos || []).filter(p => p).length}/3
          </Text>
        </View>
      </View>
      
      <View style={styles.collectionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('outletName')}:</Text>
          <Text style={styles.detailValue}>{item.name}</Text>
        </View>
        <View style={[styles.detailRow, { alignItems: 'flex-start' }]}>
          <Text style={styles.detailLabel}>{t('outletAddress')}:</Text>
          <Text style={[styles.detailValue, styles.multilineValue]} numberOfLines={3}>
            {item.streetAddress}
          </Text>
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
                  {(item.outsidePhotos || []).filter(p => p).length}/3 • 
                  {(item.insidePhotos || []).filter(p => p).length}/3 • 
                  {(item.inventoryPhotos || []).filter(p => p).length}/3
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
      {detailVisible && selectedOutlet && (
        <OutletDetailModal
          visible={detailVisible}
          outlet={selectedOutlet}
          onClose={() => setDetailVisible(false)}
          t={t}
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    minHeight: 32,
  },
  syncBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
    minWidth: 24,
  },
  syncSynced: {
    backgroundColor: '#4CAF50',
  },
  syncPending: {
    backgroundColor: '#FF9800',
  },
  syncFailed: {
    backgroundColor: '#F44336',
  },
  syncText: {
    fontSize: 10,
    fontWeight: '600',
  },
  syncNowButton: {
    marginTop: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  syncNowButtonText: {
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
  overflowEllipsis: {
    flex: 1,
  },
  multilineValue: {
    flex: 1,
    textAlign: 'right',
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
  retryButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  retryButtonText: {
    fontSize: 12,
  },
});

// Main component with error boundary
export default function HistoryTabScreen() {
  return (
    <ErrorBoundary>
      <HistoryTabScreenContent />
    </ErrorBoundary>
  );
} 