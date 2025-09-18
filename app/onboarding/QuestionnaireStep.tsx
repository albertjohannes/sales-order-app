import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface OutletForm {
  name: string;
  streetAddress: string;
  province: any;
  regency: any;
  district: any;
  village: any;
  postalCode: string;
  latitude: string;
  longitude: string;
  ktpPhoto: string; // File URI for upload
  outsidePhoto: string; // Single outside photo
  insidePhotos: string[]; // File URIs for upload
  inventoryPhotos: string[]; // File URIs for upload
  // Questionnaire fields
  quizTopSellingItems: string[];
  quizPrimaryDistributor: string;
  quizReorderFrequency: string;
  quizBusinessType: string;
  quizYearsInBusiness: number | null;
}

interface QuestionnaireStepProps {
  formData: OutletForm;
  updateFormData: (field: keyof OutletForm, value: string | string[] | number | null) => void;
}

export default function QuestionnaireStep({ formData, updateFormData }: QuestionnaireStepProps) {
  const { t } = useLanguage();
  
  // Modal states
  const [showBusinessTypeModal, setShowBusinessTypeModal] = useState(false);
  const [showReorderFrequencyModal, setShowReorderFrequencyModal] = useState(false);

  // Business type options
  const businessTypes = [
    'Warung',
    'Toko Kelontong',
    'Minimarket',
    'Supermarket',
    'Pasar Tradisional',
    'Toko Elektronik',
    'Apotek',
    'Toko Baju',
    'Restoran/Warung Makan',
    'Lainnya'
  ];

  // Reorder frequency options
  const reorderFrequencies = [
    'Harian',
    '2-3 kali seminggu',
    'Mingguan',
    '2 minggu sekali',
    'Bulanan',
    '2 bulan sekali',
    '3 bulan sekali',
    'Sesuai kebutuhan'
  ];

  const handleBusinessTypeSelect = (type: string) => {
    updateFormData('quizBusinessType', type);
    setShowBusinessTypeModal(false);
  };

  const handleReorderFrequencySelect = (frequency: string) => {
    updateFormData('quizReorderFrequency', frequency);
    setShowReorderFrequencyModal(false);
  };

  const handleTopSellingItemAdd = () => {
    if (formData.quizTopSellingItems.length < 3) {
      const newItems = [...formData.quizTopSellingItems, ''];
      updateFormData('quizTopSellingItems', newItems);
    }
  };

  const handleTopSellingItemRemove = (index: number) => {
    const newItems = formData.quizTopSellingItems.filter((_, i) => i !== index);
    updateFormData('quizTopSellingItems', newItems);
  };

  const handleTopSellingItemChange = (index: number, value: string) => {
    const newItems = [...formData.quizTopSellingItems];
    newItems[index] = value;
    updateFormData('quizTopSellingItems', newItems);
  };

  const handleYearsInBusinessChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue === '') {
      updateFormData('quizYearsInBusiness', null);
    } else {
      const num = parseInt(numericValue);
      if (num >= 0 && num <= 9999) {
        updateFormData('quizYearsInBusiness', num);
      }
    }
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('businessInformation')}</Text>
      <Text style={styles.stepDescription}>{t('businessInformationDesc')}</Text>
      
      {/* Top Selling Items */}
      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('topSellingItems')} *</Text>
        <Text style={styles.fieldSubtitle}>{t('topSellingItemsDesc')}</Text>
        
        {formData.quizTopSellingItems.map((item, index) => (
          <View key={index} style={styles.sellingItemContainer}>
            <TextInput
              style={styles.textInput}
              value={item}
              onChangeText={(text) => handleTopSellingItemChange(index, text)}
              placeholder={`${t('item')} ${index + 1}`}
              placeholderTextColor="#999"
            />
            {formData.quizTopSellingItems.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleTopSellingItemRemove(index)}
              >
                <IconSymbol name="minus.circle.fill" size={20} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {formData.quizTopSellingItems.length < 3 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleTopSellingItemAdd}
          >
            <IconSymbol name="plus.circle.fill" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>{t('addItem')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Primary Distributor */}
      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('primaryDistributor')}</Text>
        <TextInput
          style={styles.textInput}
          value={formData.quizPrimaryDistributor}
          onChangeText={(text) => updateFormData('quizPrimaryDistributor', text)}
          placeholder={t('enterPrimaryDistributor')}
          placeholderTextColor="#999"
        />
      </View>

      {/* Business Type */}
      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('businessType')}</Text>
        <TouchableOpacity 
          style={styles.selectionButton}
          onPress={() => setShowBusinessTypeModal(true)}
        >
          <View style={styles.selectionContent}>
            <IconSymbol name="building.2" size={24} color="#007AFF" />
            <View style={styles.selectionText}>
              <Text style={styles.selectionLabel}>
                {formData.quizBusinessType || t('selectBusinessType')}
              </Text>
            </View>
            <IconSymbol name="chevron.down" size={20} color="#999" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Reorder Frequency */}
      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('reorderFrequency')}</Text>
        <TouchableOpacity 
          style={styles.selectionButton}
          onPress={() => setShowReorderFrequencyModal(true)}
        >
          <View style={styles.selectionContent}>
            <IconSymbol name="clock" size={24} color="#007AFF" />
            <View style={styles.selectionText}>
              <Text style={styles.selectionLabel}>
                {formData.quizReorderFrequency || t('selectReorderFrequency')}
              </Text>
            </View>
            <IconSymbol name="chevron.down" size={20} color="#999" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Years in Business */}
      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('yearsInBusiness')}</Text>
        <TextInput
          style={styles.textInput}
          value={formData.quizYearsInBusiness?.toString() || ''}
          onChangeText={handleYearsInBusinessChange}
          placeholder={t('enterYearsInBusiness')}
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      {/* Business Type Selection Modal */}
      <Modal
        visible={showBusinessTypeModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectBusinessType')}</Text>
            <TouchableOpacity onPress={() => setShowBusinessTypeModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={businessTypes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleBusinessTypeSelect(item)}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{item}</Text>
                  {formData.quizBusinessType === item && (
                    <IconSymbol name="checkmark" size={20} color="#007AFF" />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Reorder Frequency Selection Modal */}
      <Modal
        visible={showReorderFrequencyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectReorderFrequency')}</Text>
            <TouchableOpacity onPress={() => setShowReorderFrequencyModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={reorderFrequencies}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleReorderFrequencySelect(item)}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{item}</Text>
                  {formData.quizReorderFrequency === item && (
                    <IconSymbol name="checkmark" size={20} color="#007AFF" />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContent: {
    marginTop: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fieldSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  sellingItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
});
