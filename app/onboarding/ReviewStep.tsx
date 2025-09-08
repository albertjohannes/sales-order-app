import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import {
    StyleSheet,
    Text,
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
  ktpPhoto: string;
  outsidePhotos: string[];
  insidePhotos: string[];
  inventoryPhotos: string[];
}

interface ReviewStepProps {
  formData: OutletForm;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('reviewOutletInfo')}</Text>
      <Text style={styles.stepDescription}>{t('reviewOutletInfoDesc')}</Text>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>{t('basicInfo')}</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('outletName')}:</Text>
          <Text style={styles.reviewValue}>{formData.name || t('notProvided')}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('streetAddress')}:</Text>
          <Text style={styles.reviewValue}>{formData.streetAddress || t('notProvided')}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('province')}:</Text>
          <Text style={styles.reviewValue}>{formData.province?.name || t('notProvided')}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('regency')}:</Text>
          <Text style={styles.reviewValue}>{formData.regency?.name || t('notProvided')}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('district')}:</Text>
          <Text style={styles.reviewValue}>{formData.district?.name || t('notProvided')}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('village')}:</Text>
          <Text style={styles.reviewValue}>{formData.village?.name || t('notProvided')}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('outletPostalCode')}:</Text>
          <Text style={styles.reviewValue}>{formData.postalCode || t('notProvided')}</Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>{t('location')}</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('coordinates')}:</Text>
          <Text style={styles.reviewValue}>
            {formData.latitude && formData.longitude 
              ? `${formData.latitude}, ${formData.longitude}`
              : t('notProvided')
            }
          </Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>{t('photos')}</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('ktpPhoto')}:</Text>
          <Text style={styles.reviewValue}>
            {formData.ktpPhoto ? t('uploaded') : t('notProvided')}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('outletOutsidePhotos')}:</Text>
          <Text style={styles.reviewValue}>
            {formData.outsidePhotos.filter(p => p).length}/3 {t('uploaded')}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('outletInsidePhotos')}:</Text>
          <Text style={styles.reviewValue}>
            {formData.insidePhotos.filter(p => p).length}/3 {t('uploaded')}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>{t('outletInventoryPhotos')}:</Text>
          <Text style={styles.reviewValue}>
            {formData.inventoryPhotos.filter(p => p).length}/3 {t('uploaded')}
          </Text>
        </View>
      </View>
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
  reviewSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  reviewValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});
