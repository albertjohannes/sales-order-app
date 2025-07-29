import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsModal({ visible, onClose }: TermsModalProps) {
  const { t } = useLanguage();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.termsModal}>
          <View style={styles.termsModalHeader}>
            <Text style={styles.termsModalTitle}>{t('termsAndConditionsLink')}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.termsModalCloseButton}
            >
              <IconSymbol name="xmark" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.termsModalContent}>
            <Text style={styles.termsModalText}>
              Dengan menggunakan layanan Warung Adil Pay, Anda menyetujui ketentuan berikut:
            </Text>
            
            <Text style={styles.termsModalSubtitle}>1. Penggunaan Layanan</Text>
            <Text style={styles.termsModalText}>
              Layanan pembayaran ini hanya tersedia untuk pengguna terdaftar dan transaksi yang sah.
            </Text>
            
            <Text style={styles.termsModalSubtitle}>2. Keamanan</Text>
            <Text style={styles.termsModalText}>
              Kami berkomitmen untuk melindungi data pribadi dan keamanan transaksi Anda.
            </Text>
            
            <Text style={styles.termsModalSubtitle}>3. Batasan</Text>
            <Text style={styles.termsModalText}>
              Layanan ini hanya berlaku untuk transaksi yang dilakukan melalui aplikasi Warung Adil.
            </Text>
            
            <Text style={styles.termsModalSubtitle}>4. Pembayaran</Text>
            <Text style={styles.termsModalText}>
              Pembayaran akan diproses menggunakan saldo Fairbanc yang tersedia.
            </Text>
            
            <Text style={styles.termsModalSubtitle}>5. Kebijakan Privasi</Text>
            <Text style={styles.termsModalText}>
              Data transaksi Anda akan disimpan dengan aman sesuai dengan kebijakan privasi kami.
            </Text>
            
            <Text style={styles.termsModalSubtitle}>6. Dukungan</Text>
            <Text style={styles.termsModalText}>
              Untuk bantuan teknis, silakan hubungi tim dukungan kami melalui aplikasi.
            </Text>
          </ScrollView>
          
          <TouchableOpacity
            style={styles.termsModalButton}
            onPress={onClose}
          >
            <Text style={styles.termsModalButtonText}>{t('confirm')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  termsModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  termsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  termsModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  termsModalCloseButton: {
    padding: 4,
  },
  termsModalContent: {
    padding: 20,
    maxHeight: 300,
  },
  termsModalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 12,
  },
  termsModalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  termsModalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  termsModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 