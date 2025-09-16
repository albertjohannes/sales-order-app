import { AuthGuard } from '@/components/AuthGuard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import HeaderWithSettings from '@/components/HeaderWithSettings';
import { API_CONFIG } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApi } from '@/services/api';
import { saveOutlet } from '@/services/storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import PhotoUploadStep from './PhotoUploadStep';
import QuestionnaireStep from './QuestionnaireStep';
import ReviewStep from './ReviewStep';

interface OutletForm {
  name: string;
  ownerName: string;
  ownerPhone: string;
  streetAddress: string;
  province: any;
  regency: any;
  district: any;
  village: any;
  postalCode: string;
  latitude: string;
  longitude: string;
  ktpPhoto: string; // File URI for upload
  outsidePhotos: string[]; // File URIs for upload
  insidePhotos: string[]; // File URIs for upload
  inventoryPhotos: string[]; // File URIs for upload
  // Questionnaire fields
  quizTopSellingItems: string[];
  quizPrimaryDistributor: string;
  quizReorderFrequency: string;
  quizBusinessType: string;
  quizYearsInBusiness: number | null;
}

// Tiny 1x1 transparent PNG as dummy base64 image for fallback
const DUMMY_BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

// Helper function to convert form data to FormData for multipart upload
const createFormData = (outletData: any): FormData => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('name', outletData.name);
  formData.append('ownerName', outletData.ownerName);
  formData.append('ownerPhone', outletData.ownerPhone);
  formData.append('streetAddress', outletData.streetAddress);
  
  // Add region data as JSON strings
  if (outletData.province) {
    formData.append('province', JSON.stringify({
      id: outletData.province.code || outletData.province.id,
      name: outletData.province.name
    }));
  }
  if (outletData.regency) {
    formData.append('regency', JSON.stringify({
      id: outletData.regency.code || outletData.regency.id,
      name: outletData.regency.name
    }));
  }
  if (outletData.district) {
    formData.append('district', JSON.stringify({
      id: outletData.district.code || outletData.district.id,
      name: outletData.district.name
    }));
  }
  if (outletData.village) {
    formData.append('village', JSON.stringify({
      id: outletData.village.code || outletData.village.id,
      name: outletData.village.name
    }));
  }
  
  formData.append('postalCode', outletData.postalCode || '');
  formData.append('latitude', outletData.latitude || '');
  formData.append('longitude', outletData.longitude || '');
  
  // Add questionnaire fields
  if (outletData.quizTopSellingItems) {
    formData.append('quizTopSellingItems', JSON.stringify(outletData.quizTopSellingItems));
  }
  formData.append('quizPrimaryDistributor', outletData.quizPrimaryDistributor || '');
  formData.append('quizReorderFrequency', outletData.quizReorderFrequency || '');
  formData.append('quizBusinessType', outletData.quizBusinessType || '');
  formData.append('quizYearsInBusiness', outletData.quizYearsInBusiness?.toString() || '');
  
  // Add photo files
  if (outletData.ktpPhoto) {
    // Check if it's an asset URI (starts with file://) or a real file URI
    const isAssetUri = outletData.ktpPhoto.startsWith('file://') && !outletData.ktpPhoto.includes('test-');
    formData.append('ktpPhoto', {
      uri: outletData.ktpPhoto,
      type: isAssetUri ? 'image/png' : 'image/jpeg',
      name: isAssetUri ? 'ktp_test.png' : 'ktp.jpg',
    } as any);
  } else if (__DEV__) {
    // In development, use a test image if no KTP photo provided
    formData.append('ktpPhoto', {
      uri: require('../../assets/images/sales_logo.png'),
      type: 'image/png',
      name: 'ktp_test.png',
    } as any);
  }
  
  // Add outside photos
  if (outletData.outsidePhotos && outletData.outsidePhotos.length > 0) {
    outletData.outsidePhotos.forEach((photoUri: string, index: number) => {
      if (photoUri) {
        // Check if it's an asset URI (starts with file://) or a real file URI
        const isAssetUri = photoUri.startsWith('file://') && !photoUri.includes('test-');
        formData.append('outsidePhotos', {
          uri: photoUri,
          type: isAssetUri ? 'image/png' : 'image/jpeg',
          name: isAssetUri ? `outside_test_${index + 1}.png` : `outside_${index + 1}.jpg`,
        } as any);
      }
    });
  } else if (__DEV__) {
    // In development, use test images if no outside photos provided
    formData.append('outsidePhotos', {
      uri: require('../../assets/images/banners/banner_1.png'),
      type: 'image/png',
      name: 'outside_test_1.png',
    } as any);
    formData.append('outsidePhotos', {
      uri: require('../../assets/images/banners/banner_2.png'),
      type: 'image/png',
      name: 'outside_test_2.png',
    } as any);
  }
  
  // Add inside photos
  if (outletData.insidePhotos && outletData.insidePhotos.length > 0) {
    outletData.insidePhotos.forEach((photoUri: string, index: number) => {
      if (photoUri) {
        // Check if it's an asset URI (starts with file://) or a real file URI
        const isAssetUri = photoUri.startsWith('file://') && !photoUri.includes('test-');
        formData.append('insidePhotos', {
          uri: photoUri,
          type: isAssetUri ? 'image/png' : 'image/jpeg',
          name: isAssetUri ? `inside_test_${index + 1}.png` : `inside_${index + 1}.jpg`,
        } as any);
      }
    });
  } else if (__DEV__) {
    // In development, use test images if no inside photos provided
    formData.append('insidePhotos', {
      uri: require('../../assets/images/banners/banner_3.png'),
      type: 'image/png',
      name: 'inside_test_1.png',
    } as any);
  }
  
  // Add inventory photos
  if (outletData.inventoryPhotos && outletData.inventoryPhotos.length > 0) {
    outletData.inventoryPhotos.forEach((photoUri: string, index: number) => {
      if (photoUri) {
        // Check if it's an asset URI (starts with file://) or a real file URI
        const isAssetUri = photoUri.startsWith('file://') && !photoUri.includes('test-');
        formData.append('inventoryPhotos', {
          uri: photoUri,
          type: isAssetUri ? 'image/png' : 'image/jpeg',
          name: isAssetUri ? `inventory_test_${index + 1}.png` : `inventory_${index + 1}.jpg`,
        } as any);
      }
    });
  } else if (__DEV__) {
    // In development, use test images if no inventory photos provided
    formData.append('inventoryPhotos', {
      uri: require('../../assets/images/icon.png'),
      type: 'image/png',
      name: 'inventory_test_1.png',
    } as any);
    formData.append('inventoryPhotos', {
      uri: require('../../assets/images/favicon.png'),
      type: 'image/png',
      name: 'inventory_test_2.png',
    } as any);
  }
  
  return formData;
};

function OnboardingScreenContent() {
  const { t } = useLanguage();
  const { email } = useAuth();
  const api = useApi();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OutletForm>({
    name: '',
    ownerName: '',
    ownerPhone: '',
    streetAddress: '',
    province: null,
    regency: null,
    district: null,
    village: null,
    postalCode: '',
    latitude: '',
    longitude: '',
    ktpPhoto: '',
    outsidePhotos: [],
    insidePhotos: [],
    inventoryPhotos: [],
    // Questionnaire fields
    quizTopSellingItems: [''],
    quizPrimaryDistributor: '',
    quizReorderFrequency: '',
    quizBusinessType: '',
    quizYearsInBusiness: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Submit preview modal state
  const [showPreview, setShowPreview] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any | null>(null);

  const isProduction = !__DEV__;

  // Load existing outlet data if editing (for future functionality)
  useEffect(() => {
    // This could be expanded to load existing outlet data for editing
    // For now, it's just a placeholder for future enhancement
  }, []);

  const updateFormData = (field: keyof OutletForm, value: string | string[] | number | any | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitOnboarding = async (outletData: any) => {
    setIsSubmitting(true);
    try {
      let backendId: string | null = null;
      let syncStatus: 'synced' | 'pending' | 'failed' = 'pending';

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 60 seconds')), 60000);
      });

      try {
        // In development, always use real files for testing
        // In production, check if we have actual photo files to upload
        const hasPhotos = outletData.ktpPhoto || 
          (outletData.outsidePhotos && outletData.outsidePhotos.some((photo: string) => photo)) ||
          (outletData.insidePhotos && outletData.insidePhotos.some((photo: string) => photo)) ||
          (outletData.inventoryPhotos && outletData.inventoryPhotos.some((photo: string) => photo));

        let result;
        if (hasPhotos || __DEV__) {
          // Use file upload for real photos or in development mode
          console.log('Uploading with file upload (FormData)');
          const formData = createFormData(outletData);
          result = await Promise.race([
            api.createOnboardingWithFiles(formData),
            timeoutPromise
          ]);
        } else {
          // Fallback to JSON with dummy images for testing
          console.log('Uploading with JSON (no photos)');
          const payloadToSend = {
            ...outletData,
            ktpPhoto: DUMMY_BASE64_IMAGE,
            outsidePhotos: [DUMMY_BASE64_IMAGE, DUMMY_BASE64_IMAGE],
            insidePhotos: [DUMMY_BASE64_IMAGE, DUMMY_BASE64_IMAGE],
            inventoryPhotos: [DUMMY_BASE64_IMAGE, DUMMY_BASE64_IMAGE],
          };
          result = await Promise.race([
            api.createOnboarding(payloadToSend),
            timeoutPromise
          ]);
        }
        
        console.log('Onboarding data sent to backend:', result);
        backendId = (result as any)?.data?.id || null;
        syncStatus = 'synced';
      } catch (error) {
        console.error('Error sending to backend:', error);
        syncStatus = 'failed';
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        Alert.alert(
          'Backend Error Details',
          `Full Error: ${errorMessage}\n\nThis will help us debug the issue. Please copy this error message.`,
          [ { text: 'OK', style: 'default' } ]
        );
        return;
      }

      await saveOutlet({ 
        ...outletData, 
        id: backendId || outletData.id,
        syncStatus 
      });

      // Navigate to shared success with actions (history/home)
      router.push('/shared/success?type=onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmAndSubmit = async () => {
    if (!pendingPayload) return;
    await submitOnboarding(pendingPayload);
    setShowPreview(false);
    setPendingPayload(null);
  };

  const canProceedToNextStep = (): boolean => {
    switch (currentStep) {
      case 1: // Basic Info
        return formData.name.trim() !== '' && 
               formData.ownerName.trim() !== '' && 
               formData.ownerPhone.trim() !== '' && 
               formData.streetAddress.trim() !== '' && 
               formData.province !== null && 
               formData.regency !== null && 
               formData.district !== null && 
               formData.village !== null && 
               formData.postalCode.trim() !== '';
      case 2: // Location
        return formData.latitude !== '' && formData.longitude !== '';
      case 3: // Photos
        // Require at least 1 photo per category
        const ktpValid = formData.ktpPhoto.trim() !== '';
        const outsideValid = formData.outsidePhotos.filter(p => p).length >= 1;
        const insideValid = formData.insidePhotos.filter(p => p).length >= 1;
        const inventoryValid = formData.inventoryPhotos.filter(p => p).length >= 1;

        return ktpValid && outsideValid && insideValid && inventoryValid;
      case 4: // Questionnaire
        // At least one top selling item is required
        return formData.quizTopSellingItems.some(item => item.trim() !== '');
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      // Check if current step is complete before proceeding
      if (!canProceedToNextStep()) {
        Alert.alert(
          t('error'),
          t('completeRequiredFields'),
          [
            { text: t('ok'), style: 'cancel' }
          ]
        );
        return;
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Validate required fields before submission
      if (!formData.name.trim() || !formData.ownerName.trim() || !formData.ownerPhone.trim() || 
          !formData.streetAddress.trim() || !formData.province || 
          !formData.regency || !formData.district || !formData.village || !formData.postalCode.trim()) {
        Alert.alert(
          t('error'),
          t('fillRequiredFieldsAndPhotos'),
          [
            { text: t('ok'), style: 'cancel' }
          ]
        );
        return;
      }

      // Build payload
      const outletData = {
          id: `OUTLET-${Date.now()}`,
          name: formData.name.trim(),
          ownerName: formData.ownerName.trim(),
          ownerPhone: formData.ownerPhone.trim(),
          streetAddress: formData.streetAddress.trim(),
          province: formData.province ? {
            id: formData.province.id || formData.province.code,
            name: formData.province.name
          } : { id: '', name: '' },
          regency: formData.regency ? {
            id: formData.regency.id || formData.regency.code,
            name: formData.regency.name
          } : { id: '', name: '' },
          district: formData.district ? {
            id: formData.district.id || formData.district.code,
            name: formData.district.name
          } : { id: '', name: '' },
          village: formData.village ? {
            id: formData.village.id || formData.village.code,
            name: formData.village.name
          } : { id: '', name: '' },
          postalCode: formData.postalCode.trim(),
          latitude: formData.latitude,
          longitude: formData.longitude,
          ktpPhoto: formData.ktpPhoto,
          outsidePhotos: formData.outsidePhotos,
          insidePhotos: formData.insidePhotos,
          inventoryPhotos: formData.inventoryPhotos,
          // Questionnaire fields
          quizTopSellingItems: formData.quizTopSellingItems,
          quizPrimaryDistributor: formData.quizPrimaryDistributor,
          quizReorderFrequency: formData.quizReorderFrequency,
          quizBusinessType: formData.quizBusinessType,
          quizYearsInBusiness: formData.quizYearsInBusiness,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      setPendingPayload(outletData);

      if (isProduction) {
        // In production, skip modal and submit immediately
        await submitOnboarding(outletData);
      } else {
        // In development, show modal for inspection
        setShowPreview(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepIndicatorBackground}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <React.Fragment key={i}>
            <View style={styles.stepContainer}>
              <View style={styles.stepContentContainer}>
                <View style={[
                  styles.stepCircle,
                  currentStep > i + 1 ? styles.stepCompleted : 
                  currentStep === i + 1 ? styles.stepActive : styles.stepInactive
                ]}>
                  {currentStep > i + 1 ? (
                    <Text style={styles.checkmarkText}>✓</Text>
                  ) : (
                    <Text style={[
                      styles.stepNumber,
                      currentStep === i + 1 ? styles.stepNumberActive : styles.stepNumberInactive
                    ]}>
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.stepLabel,
                  currentStep === i + 1 ? styles.stepLabelActive : 
                  currentStep > i + 1 ? styles.stepLabelCompleted : styles.stepLabelInactive
                ]}>
                  {i === 0 ? t('basicInfoShort') : 
                   i === 1 ? t('location') : 
                   i === 2 ? t('photos') : 
                   i === 3 ? t('businessInfoShort') : t('review')}
                </Text>
              </View>
            </View>
            {i < totalSteps - 1 && (
              <View style={[
                styles.stepLine,
                currentStep > i + 1 ? styles.stepLineCompleted : styles.stepLineInactive
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );







  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <LocationStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PhotoUploadStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <QuestionnaireStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewStep formData={formData} />;
      default:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Settings */}
      <HeaderWithSettings title={t('onboard')} />
      
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 1 && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            currentStep === totalSteps && styles.submitButton,
            (!canProceedToNextStep() || isSubmitting) && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!canProceedToNextStep() || isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={[styles.nextButtonText, { marginLeft: 8 }]}>
                {t('submitting')}...
              </Text>
            </View>
          ) : (
            <Text style={[
              styles.nextButtonText,
              (!canProceedToNextStep() || isSubmitting) && styles.nextButtonTextDisabled
            ]}>
              {currentStep === totalSteps ? t('submitOutlet') : t('next')}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Submit Confirmation Modal (development only) */}
      {showPreview && !isProduction && (
        <Modal
          visible={showPreview}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPreview(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, maxHeight: '85%' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Confirm Submission</Text>
              <ScrollView style={{ maxHeight: '70%' }}>
                <Text style={{ fontWeight: '700', marginBottom: 4 }}>Endpoint</Text>
                <Text selectable style={{ marginBottom: 12 }}>{`${API_CONFIG.getCurrentUrl()}/onboarding`}</Text>

                <Text style={{ fontWeight: '700', marginBottom: 4 }}>Headers</Text>
                <Text selectable style={{ marginBottom: 12 }}>{JSON.stringify({
                  'Content-Type': 'application/json',
                  'X-Agent-Email': email || '(not logged)'
                }, null, 2)}</Text>

                <Text style={{ fontWeight: '700', marginBottom: 4 }}>Payload</Text>
                <Text selectable>{JSON.stringify(pendingPayload, null, 2)}</Text>
              </ScrollView>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                <TouchableOpacity
                  style={[styles.backButton, { flex: 1 }]}
                  onPress={() => setShowPreview(false)}
                >
                  <Text style={styles.backButtonText}>{t('back')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.nextButton, styles.submitButton, { flex: 1 }]}
                  onPress={confirmAndSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="white" />
                      <Text style={[styles.nextButtonText, { marginLeft: 8 }]}>
                        {t('submitting')}...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.nextButtonText}>Confirm & Send</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

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
    paddingBottom: 100,
  },
  stepIndicator: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  stepIndicatorBackground: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.08)',
    width: '100%',
  },
  stepContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  stepContentContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepCompleted: {
    backgroundColor: '#667eea',
  },
  stepActive: {
    backgroundColor: '#667eea',
  },
  stepInactive: {
    backgroundColor: '#f0f0f0',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepNumberInactive: {
    color: '#666',
  },
  stepLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 1,
  },
  stepLineCompleted: {
    backgroundColor: '#667eea',
  },
  stepLineInactive: {
    backgroundColor: '#e0e0e0',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
    textAlign: 'center',
    lineHeight: 12,
    maxWidth: 60,
  },
  stepLabelActive: {
    color: '#667eea',
  },
  stepLabelCompleted: {
    color: '#667eea',
  },
  stepLabelInactive: {
    color: '#999',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },

  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Main component with error boundary and auth guard
export default function OnboardingScreen() {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <OnboardingScreenContent />
      </AuthGuard>
    </ErrorBoundary>
  );
} 