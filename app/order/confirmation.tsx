import HeaderWithSettings from '@/components/HeaderWithSettings';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import ProductImage from '@/components/ProductImage';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { BalanceData, CartItem, Outlet, Transaction, mockBalanceData, mockOutlets } from '@/data/mockData';
import { getBalanceData, getOutlets, saveBalanceData, saveTransaction } from '@/services/storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmationScreen() {
  const { t } = useLanguage();
  const { cart, getTotal, clearCart, removeFromCart } = useCart();
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [showOutletModal, setShowOutletModal] = useState(false);

  const total = getTotal();

  useEffect(() => {
    loadBalanceData();
    loadOutlets();
  }, []);

  const loadOutlets = async () => {
    try {
      // First try to load from local storage
      const storedOutlets = await getOutlets();
      if (storedOutlets.length > 0) {
        setOutlets(storedOutlets);
        setSelectedOutlet(storedOutlets[0]); // Select first outlet by default
      } else {
        // Fallback to mock data if no stored outlets
        setOutlets(mockOutlets);
        setSelectedOutlet(mockOutlets[0]);
      }
    } catch (error) {
      console.error('Error loading outlets:', error);
      // Fallback to mock data
      setOutlets(mockOutlets);
      setSelectedOutlet(mockOutlets[0]);
    }
  };

  const loadBalanceData = async () => {
    try {
      const savedData = await getBalanceData();
      if (savedData) {
        setBalanceData(savedData);
      }
    } catch (error) {
      console.error('Error loading balance data:', error);
    }
  };

  const fetchBalance = async () => {
    setRefreshing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBalanceData: BalanceData = {
        ...mockBalanceData,
        lastUpdated: new Date().toISOString()
      };

      setBalanceData(newBalanceData);
      await saveBalanceData(newBalanceData);
    } catch (error) {
      console.error('Error fetching balance:', error);
      Alert.alert(t('error'), t('connectionError'));
    } finally {
      setRefreshing(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!balanceData || balanceData.available_amount < total) {
      Alert.alert(t('error'), t('insufficientBalance'));
      return;
    }

    setConfirming(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create transaction object with mock data
      const today = new Date();
      const dateString = today.toLocaleDateString('en-CA');
      const timestamp = Date.now();
      const transactionId = `TXN-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${mockBalanceData.distributor_id}-${timestamp}`;

      const newTransaction: Transaction = {
        transaction_id: transactionId,
        loan_id: `LOAN-${timestamp}`,
        items: cart,
        total: total,
        date: today.toISOString(),
        raw_date: dateString,
        transaction_date: dateString,
        description: `Submit new order for ${selectedOutlet?.name || 'Unknown Outlet'}`,
        has_good_receipt: false // Will be updated when good receipt is processed
      };

      // Save transaction to storage
      await saveTransaction(newTransaction);
      
      // Clear cart and navigate to success
      clearCart();
      router.push('/shared/success?type=order');
    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert(t('error'), t('connectionError'));
    } finally {
      setConfirming(false);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const isBalanceSufficient = balanceData && balanceData.available_amount >= total;

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <ProductImage
        imageUrl={item.imageUrl}
        style={styles.itemImage}
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSku}>{item.sku}</Text>
        </View>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemPrice}>{formatPrice(item.price)} / {t('unit')}</Text>
          <Text style={styles.itemQuantity}>x{item.quantity}</Text>
        </View>
        <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
      </View>
      
      {/* Remove Button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          Alert.alert(
            t('removeItem'),
            t('deleteItemConfirm'),
            [
              { text: t('cancel'), style: 'cancel' },
              { 
                text: t('delete'), 
                style: 'destructive',
                onPress: () => removeFromCart(item.id)
              }
            ]
          );
        }}
        activeOpacity={0.7}
      >
        <IconSymbol name="trash" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <HeaderWithSettings title={t('orderConfirmation')} />

      {/* Outlet Selection */}
      <View style={styles.outletSection}>
        <Text style={styles.sectionTitle}>{t('selectOutlet')}</Text>
        <TouchableOpacity 
          style={styles.outletSelector}
          onPress={() => setShowOutletModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.outletInfo}>
            <Text style={styles.outletName}>
              {selectedOutlet ? selectedOutlet.name : t('selectOutlet')}
            </Text>
            {selectedOutlet && (
              <Text style={styles.outletAddress}>{selectedOutlet.streetAddress}</Text>
            )}
          </View>
          <IconSymbol name="chevron.down" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Payment Method with Balance */}
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>{t('paymentMethod')}</Text>
        <PaymentMethodCard
          balanceData={balanceData}
          isLoadingBalance={false}
          onRefresh={fetchBalance}
          showChevron={false}
          showRefreshButton={true}
          isRefreshing={refreshing}
          showLastUpdated={true}
        />
      </View>

      {/* Cart Items */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>{t('orderItems')}</Text>
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          style={styles.itemsList}
          contentContainerStyle={styles.itemsListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>{t('noItems')}</Text>
            </View>
          }
        />
      </View>

      {/* Total and Confirm */}
      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>{t('totalAmount')}:</Text>
          <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
        </View>
        
        {!isBalanceSufficient && balanceData && (
          <View style={styles.insufficientBalance}>
            <Text style={styles.insufficientText}>
              {t('insufficientBalanceMessage')}
            </Text>
            <Text style={styles.insufficientAmount}>
              {t('shortage')}: {formatPrice(total - balanceData.available_amount)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!isBalanceSufficient || confirming) && styles.confirmButtonDisabled
          ]}
          onPress={handleConfirmOrder}
          disabled={!isBalanceSufficient || confirming}
          activeOpacity={0.8}
        >
          {confirming ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.confirmButtonText}>{t('confirmOrder')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Outlet Selection Modal */}
      <Modal
        visible={showOutletModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectOutlet')}</Text>
            <TouchableOpacity onPress={() => setShowOutletModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={outlets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedOutlet(item);
                  setShowOutletModal(false);
                }}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                  <Text style={styles.modalItemSubtitle}>{item.streetAddress}</Text>
                  <Text style={styles.modalItemId}>{item.id}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <IconSymbol name="building.2" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No outlets found</Text>
                <Text style={styles.emptyStateSubtext}>Complete onboarding to add your first outlet</Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    marginRight: 12,
  },
  partnerLogo: {
    width: 40,
    height: 40,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 4,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  refreshButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
  },
  refreshIcon: {
    fontSize: 20,
    color: '#007AFF',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    opacity: 0.7,
    marginTop: 8,
  },
  outletSection: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  outletSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  outletInfo: {
    flex: 1,
  },
  outletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  outletAddress: {
    fontSize: 14,
    color: '#666',
  },
  paymentSection: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemsSection: {
    backgroundColor: 'white',
    marginTop: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    flex: 1,
    marginBottom: 12,
    padding: 16,
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    paddingTop: 0,
  },
  cartItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 80,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  itemSku: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  itemBrand: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  insufficientBalance: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  insufficientText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  insufficientAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
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
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemContent: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  modalItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalItemId: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 