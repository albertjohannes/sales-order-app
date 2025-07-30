import HeaderWithSettings from '@/components/HeaderWithSettings';
import TermsModal from '@/components/TermsModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import { Invoice, mockInvoices, mockOutlets, Outlet, PaymentCollection } from '@/data/mockData';

import { savePaymentCollection } from '@/services/storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
  return (
    <View style={styles.scannerContainer}>
      <IconSymbol name="qrcode.viewfinder" size={64} color="white" />
      <Text style={styles.scannerText}>Tap to scan authorization QR</Text>
    </View>
  );
};

export default function PaymentScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Handle QR scan
  const handleScanQR = () => {
    setIsScanning(true);
    // Simulate QR scan - in real app this would open camera
    setTimeout(() => {
      const mockAuthCode = 'WA-2024-ABC123';
      setAuthorizationCode(mockAuthCode);
      setIsScanning(false);
    }, 2000);
  };

  // Handle manual input
  const handleManualInput = (text: string) => {
    setAuthorizationCode(text);
  };

  // Validate authorization code
  const validateAuthCode = (code: string) => {
    return code.startsWith('WA-') || code.startsWith('AUTH-') || code.startsWith('WARUNG-');
  };

  // Get available invoices for selected outlet
  const getAvailableInvoices = () => {
    if (!selectedOutlet) return [];
    return mockInvoices.filter(invoice => 
      invoice.outletId === selectedOutlet.id && invoice.status === 'pending'
    );
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleConfirmTransaction = async () => {
    if (!selectedOutlet) {
      Alert.alert('Error', 'Please select an outlet first');
      return;
    }
    
    if (!selectedInvoice) {
      Alert.alert('Error', 'Please select an invoice');
      return;
    }
    
    if (!authorizationCode || !validateAuthCode(authorizationCode)) {
      Alert.alert('Error', 'Please scan or enter a valid authorization code');
      return;
    }
    
    Alert.alert(
      'Confirm Transaction',
      `Confirm payment of ${formatCurrency(selectedInvoice.amount)} for ${selectedOutlet.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
            try {
              // Create payment collection record
              const paymentCollection: PaymentCollection = {
                id: `PAY-${Date.now()}`,
                outletId: selectedOutlet.id,
                outletName: selectedOutlet.name,
                invoiceId: selectedInvoice.id,
                invoiceAmount: selectedInvoice.amount,
                authorizationCode: authorizationCode,
                collectionDate: new Date().toISOString(),
                status: 'completed',
                notes: `Payment collected for invoice ${selectedInvoice.id}`
              };
              
              // Save to local storage
              await savePaymentCollection(paymentCollection);
              
              // Navigate to success page with redirect to collections tab
              router.push('/success?type=payment&redirect=collections');
            } catch (error) {
              console.error('Error saving payment collection:', error);
              Alert.alert('Error', 'Failed to save payment collection');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with consistent styling */}
      <HeaderWithSettings title="Payment Collection" />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Select Outlet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Outlet</Text>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => setShowOutletModal(true)}
          >
            <View style={styles.selectionContent}>
              <IconSymbol name="building.2" size={24} color="#007AFF" />
              <View style={styles.selectionText}>
                <Text style={styles.selectionLabel}>
                  {selectedOutlet ? selectedOutlet.name : 'Choose outlet'}
                </Text>
                {selectedOutlet && (
                  <Text style={styles.selectionSubtext}>{selectedOutlet.address}</Text>
                )}
              </View>
              <IconSymbol name="chevron.down" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Step 2: Select Invoice */}
        {selectedOutlet && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Select Invoice</Text>
            <TouchableOpacity 
              style={styles.selectionButton}
              onPress={() => setShowInvoiceModal(true)}
            >
              <View style={styles.selectionContent}>
                <IconSymbol name="doc.text" size={24} color="#007AFF" />
                <View style={styles.selectionText}>
                  <Text style={styles.selectionLabel}>
                    {selectedInvoice ? `Invoice ${selectedInvoice.id}` : 'Choose invoice'}
                  </Text>
                  {selectedInvoice && (
                    <Text style={styles.selectionSubtext}>
                      {formatCurrency(selectedInvoice.amount)} • {selectedInvoice.date}
                    </Text>
                  )}
                </View>
                <IconSymbol name="chevron.down" size={20} color="#999" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Authorization QR */}
        {selectedInvoice && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Authorization</Text>
            <View style={styles.qrCard}>
              <TouchableOpacity 
                style={styles.scannerButton}
                onPress={handleScanQR}
                disabled={isScanning}
              >
                <QRScanner onScan={setAuthorizationCode} />
              </TouchableOpacity>
              
              {/* Manual Input Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Authorization Code:</Text>
                <TextInput
                  style={styles.inputField}
                  value={authorizationCode}
                  onChangeText={handleManualInput}
                  placeholder="Enter authorization code manually or scan QR"
                  placeholderTextColor="#999"
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
                      {validateAuthCode(authorizationCode) ? "Valid authorization code" : "Invalid authorization code"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Submit Button */}
        {selectedOutlet && selectedInvoice && authorizationCode && validateAuthCode(authorizationCode) && (
          <View style={styles.submitSection}>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleConfirmTransaction}
            >
              <Text style={styles.submitButtonText}>
                Submit Payment Collection
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>
            Scan QR codes from Warung Adil app for quick authorization. Manual entry also available.
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
            <Text style={styles.modalTitle}>Select Outlet</Text>
            <TouchableOpacity onPress={() => setShowOutletModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockOutlets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedOutlet(item);
                  setSelectedInvoice(null); // Reset invoice when outlet changes
                  setShowOutletModal(false);
                }}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                  <Text style={styles.modalItemSubtitle}>{item.address}</Text>
                  <Text style={styles.modalItemId}>{item.id}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Invoice Selection Modal */}
      <Modal
        visible={showInvoiceModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Invoice</Text>
            <TouchableOpacity onPress={() => setShowInvoiceModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={getAvailableInvoices()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedInvoice(item);
                  setShowInvoiceModal(false);
                }}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Invoice {item.id}</Text>
                  <Text style={styles.modalItemSubtitle}>{formatCurrency(item.amount)}</Text>
                  <Text style={styles.modalItemId}>{item.date}</Text>
                </View>
              </TouchableOpacity>
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
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
  qrCard: {
    backgroundColor: '#00B4D8',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
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
    marginTop: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
}); 