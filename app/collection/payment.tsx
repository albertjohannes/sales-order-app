import { AuthGuard } from '@/components/AuthGuard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import HeaderWithSettings from '@/components/HeaderWithSettings';
import TermsModal from '@/components/TermsModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Outlet, PaymentCollection } from '@/data/mockData';
import { useApi } from '@/services/api';
import { getOutlets, savePaymentCollection } from '@/services/storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// QR Scanner Component (placeholder for now)
const QRScanner = ({ onScan }: { onScan: (data: string) => void }) => {
  const { t } = useLanguage();
  return (
    <View style={styles.scannerContainer}>
      <IconSymbol name="qrcode.viewfinder" size={64} color="white" />
      <Text style={styles.scannerText}>{t('tapToScanQR')}</Text>
    </View>
  );
};

function CollectionScreenContent() {
  const { t, tText } = useLanguage();
  const { email } = useAuth();
  const api = useApi();
  const router = useRouter();
  
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [cashAmount, setCashAmount] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [storedOutlets, setStoredOutlets] = useState<Outlet[]>([]);
  const [isRequestingApproval, setIsRequestingApproval] = useState(false);
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [lockedOutlet, setLockedOutlet] = useState<Outlet | null>(null);
  const [lockedAmount, setLockedAmount] = useState('');

  // Load stored outlets on component mount
  useEffect(() => {
    const loadOutlets = async () => {
      try {
        const outlets = await getOutlets();
        setStoredOutlets(outlets);
      } catch (error) {
        console.error('Error loading outlets:', error);
        // Fallback to empty array if loading fails
        setStoredOutlets([]);
      }
    };

    loadOutlets();
  }, []);

  // Handle QR scan
  const handleScanQR = () => {
    setIsScanning(true);
    // Simulate QR scan - in real app this would open camera
    setTimeout(() => {
      // Don't auto-fill, just show scanning complete
      setIsScanning(false);
    }, 2000);
  };

  // Handle manual input
  const handleManualInput = (text: string) => {
    setAuthorizationCode(text);
  };

  // Handle cash amount input
  const handleCashAmountInput = (text: string) => {
    // Remove non-numeric characters except decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    setCashAmount(numericText);
  };

  // Validate authorization code
  const validateAuthCode = (code: string) => {
    // Only allow numeric codes with 6-8 digits
    return /^\d{6,8}$/.test(code);
  };

  // Validate cash amount
  const validateCashAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };

  // Handle approval request
  const handleRequestApproval = async () => {
    if (!selectedOutlet) {
      Alert.alert(t('error'), t('selectOutletFirst'));
      return;
    }
    
    if (!cashAmount || !validateCashAmount(cashAmount)) {
      Alert.alert(t('error'), 'Please enter a valid cash amount');
      return;
    }

    setIsRequestingApproval(true);
    
    // Simulate API call to request approval from outlet
    setTimeout(() => {
      setIsRequestingApproval(false);
      setApprovalRequested(true);
      // Lock the outlet and amount
      setLockedOutlet(selectedOutlet);
      setLockedAmount(cashAmount);
      Alert.alert(
        tText({ id: 'Permintaan Persetujuan Terkirim', en: 'Approval Request Sent' }),
        `Approval request sent to ${selectedOutlet.name}. They will receive an SMS with the authorization code.`,
        [{ text: t('ok'), style: 'default' }]
      );
    }, 2000);
  };

  // Handle cancel approval request
  const handleCancelApproval = () => {
    Alert.alert(
      tText({ id: 'Batalkan Permintaan Persetujuan', en: 'Cancel Approval Request' }),
      tText({ id: 'Apakah Anda yakin ingin membatalkan permintaan persetujuan? Outlet tidak akan menerima SMS lagi.', en: 'Are you sure you want to cancel the approval request? The outlet will not receive any more SMS.' }),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: tText({ id: 'Ya, Batalkan', en: 'Yes, Cancel' }), 
          style: 'destructive',
          onPress: () => {
            // Reset all states
            setApprovalRequested(false);
            setLockedOutlet(null);
            setLockedAmount('');
            setAuthorizationCode('');
            // Keep the current outlet and amount selected for easy re-request
          }
        }
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount <= 0) {
      return 'Rp 0';
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleConfirmTransaction = async () => {
    if (!selectedOutlet) {
      Alert.alert(t('error'), t('selectOutletFirst'));
      return;
    }
    
    if (!cashAmount || !validateCashAmount(cashAmount)) {
      Alert.alert(t('error'), 'Please enter a valid cash amount');
      return;
    }
    
    if (!authorizationCode || !validateAuthCode(authorizationCode)) {
      Alert.alert(t('error'), 'Please enter a valid 6-8 digit authorization code');
      return;
    }
    
    const amount = parseFloat(cashAmount);
    
    Alert.alert(
      t('confirmTransaction'),
      `Confirm payment collection of ${formatCurrency(amount)} for ${selectedOutlet.name}?`,
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('confirm'), 
          onPress: async () => {
            try {
              // Create payment collection record for local storage
              const paymentCollection: PaymentCollection = {
                id: `PAY-${Date.now()}`,
                outletId: selectedOutlet.id,
                outletName: selectedOutlet.name,
                invoiceId: `INV-${Date.now()}`, // Generate a generic invoice ID
                invoiceAmount: amount,
                authorizationCode: authorizationCode,
                collectionDate: new Date().toISOString(),
                status: 'completed',
                notes: `Payment collected for outlet ${selectedOutlet.name} - Amount: ${formatCurrency(amount)}`
              };
              
              // Save to local storage
              await savePaymentCollection(paymentCollection);
              
              // Send to backend API
              try {
                const result = await api.createCollection({
                  outletId: selectedOutlet.id,
                  amount: amount,
                  method: 'cash',
                  note: `Payment collected for outlet ${selectedOutlet.name} - Amount: ${formatCurrency(amount)}`,
                  attachments: [] // Add any receipt photos here if needed
                });
                console.log('Collection data sent to backend:', result);
              } catch (apiError) {
                console.error('Error sending to backend:', apiError);
                // Don't show error to user, just log it
              }
              
              // Navigate to success page with redirect to collections tab
              router.push('/shared/success?type=payment&redirect=collections');
            } catch (error) {
              console.error('Error saving payment collection:', error);
              Alert.alert(t('error'), t('failedSavePayment'));
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with Settings */}
      <HeaderWithSettings title={t('paymentCollection')} />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Select Outlet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. {t('selectOutlet')}</Text>
          <TouchableOpacity 
            style={[styles.selectionButton, approvalRequested && styles.lockedButton]}
            onPress={() => !approvalRequested && setShowOutletModal(true)}
            disabled={approvalRequested}
          >
            <View style={styles.selectionContent}>
              <IconSymbol name="building.2" size={24} color={approvalRequested ? "#999" : "#007AFF"} />
              <View style={styles.selectionText}>
                <Text style={[styles.selectionLabel, approvalRequested && styles.lockedText]}>
                  {selectedOutlet ? selectedOutlet.name : t('chooseOutlet')}
                </Text>
                {selectedOutlet && (
                  <Text style={[styles.selectionSubtext, approvalRequested && styles.lockedSubtext]}>
                    {selectedOutlet.streetAddress}
                  </Text>
                )}
              </View>
              {approvalRequested ? (
                <IconSymbol name="lock.fill" size={20} color="#999" />
              ) : (
                <IconSymbol name="chevron.down" size={20} color="#999" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Step 2: Cash Amount Input */}
        {selectedOutlet && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. {tText({ id: 'Jumlah Uang Tunai', en: 'Cash Amount' })}</Text>
            <View style={[styles.amountCard, approvalRequested && styles.lockedCard]}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{tText({ id: 'Masukkan Jumlah Uang Tunai:', en: 'Enter Cash Amount:' })}</Text>
                <TextInput
                  style={[styles.inputField, approvalRequested && styles.lockedInputField]}
                  value={cashAmount}
                  onChangeText={approvalRequested ? undefined : handleCashAmountInput}
                  placeholder="Enter amount (e.g., 1500000)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={!approvalRequested}
                />
                {cashAmount && (
                  <View style={styles.validationContainer}>
                    <IconSymbol 
                      name={validateCashAmount(cashAmount) ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                      size={16} 
                      color={validateCashAmount(cashAmount) ? "#28a745" : "#dc3545"} 
                    />
                    <Text style={[
                      styles.validationText, 
                      { color: validateCashAmount(cashAmount) ? "#28a745" : "#dc3545" }
                    ]}>
                      {validateCashAmount(cashAmount) ? `${tText({ id: 'Jumlah valid', en: 'Valid amount' })}: ${formatCurrency(parseFloat(cashAmount))}` : tText({ id: 'Jumlah tidak valid', en: 'Invalid amount' })}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Request Approval */}
        {selectedOutlet && cashAmount && validateCashAmount(cashAmount) && !approvalRequested && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. {tText({ id: 'Minta Persetujuan', en: 'Request Approval' })}</Text>
            <View style={styles.approvalCard}>
              <View style={styles.approvalContent}>
                <IconSymbol name="bell.badge" size={32} color="#007AFF" />
                <Text style={styles.approvalTitle}>{tText({ id: 'Minta Persetujuan dari Outlet', en: 'Request Outlet Approval' })}</Text>
                <Text style={styles.approvalDescription}>
                  {tText({ id: 'Kirim permintaan persetujuan ke {outlet} untuk mengumpulkan {amount}. Mereka akan menerima SMS dengan kode otorisasi.', en: 'Send approval request to {outlet} to collect {amount}. They will receive an SMS with the authorization code.' }).replace('{outlet}', selectedOutlet.name).replace('{amount}', formatCurrency(parseFloat(cashAmount)))}
                </Text>
                <TouchableOpacity 
                  style={[styles.approvalButton, isRequestingApproval && styles.approvalButtonDisabled]}
                  onPress={handleRequestApproval}
                  disabled={isRequestingApproval}
                >
                  <Text style={styles.approvalButtonText}>
                    {isRequestingApproval ? tText({ id: 'Meminta Persetujuan...', en: 'Requesting Approval...' }) : tText({ id: 'Minta Persetujuan', en: 'Request Approval' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Step 4: Authorization Code Input */}
        {approvalRequested && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. {t('authorization')}</Text>
            <View style={styles.qrCard}>
              <View style={styles.approvalStatusContainer}>
                <IconSymbol name="checkmark.circle.fill" size={24} color="#28a745" />
                <Text style={styles.approvalStatusText}>{tText({ id: 'Permintaan Persetujuan Terkirim', en: 'Approval Request Sent' })}</Text>
                <Text style={styles.approvalStatusSubtext}>
                  {tText({ id: 'Menunggu kode otorisasi dari {outlet}', en: 'Waiting for authorization code from {outlet}' }).replace('{outlet}', lockedOutlet?.name || '')}
                </Text>
                <Text style={styles.lockedAmountText}>
                  {tText({ id: 'Jumlah yang diminta: {amount}', en: 'Requested amount: {amount}' }).replace('{amount}', formatCurrency(parseFloat(lockedAmount)))}
                </Text>
              </View>
              
              {/* Cancel Button */}
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelApproval}
              >
                <IconSymbol name="xmark.circle" size={16} color="#dc3545" />
                <Text style={styles.cancelButtonText}>
                  {tText({ id: 'Batalkan Permintaan', en: 'Cancel Request' })}
                </Text>
              </TouchableOpacity>
              
              {/* Manual Input Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('authorizationCode')}</Text>
                <TextInput
                  style={styles.inputField}
                  value={authorizationCode}
                  onChangeText={handleManualInput}
                  placeholder="Enter 6-8 digit code from SMS"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={8}
                />
                {authorizationCode && (
                  <View style={styles.validationContainer}>
                    <IconSymbol 
                      name={validateAuthCode(authorizationCode) ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                      size={16} 
                      color={validateAuthCode(authorizationCode) ? "#28a745" : "#dc3545"} 
                    />
                    <Text style={[
                      styles.validationText, 
                      { color: validateAuthCode(authorizationCode) ? "#28a745" : "#dc3545" }
                    ]}>
                      {validateAuthCode(authorizationCode) ? t('validAuthCode') : t('invalidAuthCode')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Submit Button */}
        {selectedOutlet && cashAmount && validateCashAmount(cashAmount) && approvalRequested && authorizationCode && validateAuthCode(authorizationCode) && (
          <View style={styles.submitSection}>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleConfirmTransaction}
            >
              <Text style={styles.submitButtonText}>
                {t('submitPaymentCollection')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>
            {t('scanQRPromo')}
          </Text>
          <TouchableOpacity style={styles.promoCloseButton}>
            <IconSymbol name="xmark" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <IconSymbol name="checkmark.circle.fill" size={16} color="#007AFF" />
          <Text style={styles.termsText}>
            {t('termsAndConditions')}
            <Text 
              style={styles.termsLink}
              onPress={() => setShowTermsModal(true)}
            >
              {' '}{t('termsAndConditionsLink')}
            </Text>
          </Text>
        </View>
      </ScrollView>

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
            data={storedOutlets}
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



      {/* Terms Modal */}
      <TermsModal 
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
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
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  selectionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionText: {
    flex: 1,
    marginLeft: 12,
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectionSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  amountCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  qrCard: {
    backgroundColor: '#00B4D8',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  approvalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  approvalContent: {
    alignItems: 'center',
  },
  approvalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  approvalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  approvalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  approvalButtonDisabled: {
    backgroundColor: '#ccc',
  },
  approvalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  approvalStatusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  approvalStatusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  approvalStatusSubtext: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.9,
  },
  lockedAmountText: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '600',
  },
  lockedButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
  },
  lockedText: {
    color: '#999',
  },
  lockedSubtext: {
    color: '#ccc',
  },
  lockedCard: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
  },
  lockedInputField: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.3)',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  scannerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  scannerButton: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginTop: 12,
  },
  inputLabel: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  validationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  submitSection: {
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  promoBanner: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    flex: 1,
    fontSize: 14,
    color: '#2D5016',
    lineHeight: 20,
  },
  promoCloseButton: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 8,
    color: '#333',
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: '#007AFF',
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
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  invoiceDate: {
    fontSize: 12,
    color: '#999',
  },
  statusIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
  statusPaid: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  outletSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  summaryCount: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
});

// Main component with error boundary and auth guard
export default function CollectionScreen() {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <CollectionScreenContent />
      </AuthGuard>
    </ErrorBoundary>
  );
} 