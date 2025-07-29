import HeaderWithSettings from '@/components/HeaderWithSettings';
import ProductImage from '@/components/ProductImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { Transaction } from '@/data/mockData';
import { getTransactions, saveTransaction } from '@/services/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetailScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transactionId) {
      loadTransaction();
    }
  }, [transactionId]);

  const loadTransaction = async () => {
    try {
      const transactions = await getTransactions();
      const foundTransaction = transactions.find(t => t.transaction_id === transactionId);
      setTransaction(foundTransaction || null);
    } catch (error) {
      console.error('Error loading transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async () => {
    if (!transaction || transaction.has_good_receipt) {
      return;
    }

    // Show alert with amount input
    Alert.prompt(
      t('confirmReceipt'),
      t('enterReceiptAmount', { defaultAmount: formatPrice(transaction.total) }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: async (receiptAmount) => {
            try {
              // Parse the receipt amount (remove "Rp " prefix and commas)
              const amountString = receiptAmount?.replace(/[^\d]/g, '') || transaction.total.toString();
              const amount = parseInt(amountString, 10);
              
              if (isNaN(amount) || amount <= 0) {
                Alert.alert(t('error'), t('invalidAmount'));
                return;
              }

              // Simulate API delay
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Mock confirmation
              const mockResult = { status: true, message: 'Receipt confirmed successfully!' };
              
              if (mockResult.status === true) {
                // Update transaction with receipt confirmation
                const updatedTransaction: Transaction = {
                  ...transaction,
                  has_good_receipt: true,
                  good_receipt_total: amount,
                };
                
                // Save updated transaction
                await saveTransaction(updatedTransaction);
                
                // Update local state
                setTransaction(updatedTransaction);
                
                // Navigate directly to success screen for receipt confirmation
                router.push('/success?type=receipt');
              } else {
                Alert.alert(t('error'), t('receiptConfirmFailed'));
              }
            } catch (error) {
              console.error('Error confirming transaction:', error);
              Alert.alert(t('error'), t('receiptConfirmError'));
            }
          }
        }
      ],
      'plain-text',
      transaction.total.toString()
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <HeaderWithSettings title={t('orderDetail')} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <HeaderWithSettings title={t('orderDetail')} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('transactionNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <HeaderWithSettings title={t('orderDetail')} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transaction Header */}
        <View style={styles.headerSection}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
            <Text style={styles.transactionId}>{transaction.transaction_id}</Text>
            {transaction.loan_id && (
              <View style={styles.loanIdBanner}>
                <Text style={styles.loanIdText}>#{transaction.loan_id}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.statusSection}>
            <View style={styles.statusRow}>
              <View style={styles.statusLeft}>
                {transaction.has_good_receipt ? (
                  <View style={styles.statusBadgeComplete}>
                    <Text style={styles.statusTextComplete}>{t('receiptComplete')}</Text>
                  </View>
                ) : (
                  <View style={styles.statusBadgePending}>
                    <Text style={styles.statusTextPending}>{t('receiptPending')}</Text>
                  </View>
                )}
              </View>
              <View style={styles.amountRight}>
                <Text style={styles.totalAmount}>{formatPrice(transaction.total)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>{t('orderItems')}</Text>
          {transaction.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
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
            </View>
          ))}
        </View>

        {/* Transaction Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>{t('orderSummary')}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('totalItems')}:</Text>
            <Text style={styles.summaryValue}>{transaction.items.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('totalAmount')}:</Text>
            <Text style={styles.summaryValue}>{formatPrice(transaction.total)}</Text>
          </View>
          {transaction.has_good_receipt && transaction.good_receipt_total && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('receiptAmount')}:</Text>
              <Text style={styles.summaryValue}>{formatPrice(transaction.good_receipt_total)}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {transaction.has_good_receipt ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmReceipt}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{t('confirmReceipt')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>{t('back')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  headerSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionInfo: {
    marginBottom: 16,
  },
  transactionDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  loanIdBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  loanIdText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusLeft: {
    alignItems: 'flex-start',
  },
  amountRight: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  statusBadgeComplete: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusTextComplete: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgePending: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusTextPending: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemSku: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  itemBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
  summarySection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 8,
    marginBottom: 20,
  },
}); 