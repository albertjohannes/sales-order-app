import HeaderWithSettings from '@/components/HeaderWithSettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { saveOutlet } from '@/services/storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import PhotoUploadStep from './PhotoUploadStep';
import ReviewStep from './ReviewStep';

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

export default function OnboardingScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [formData, setFormData] = useState<OutletForm>({
    name: '',
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
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Load existing outlet data if editing (for future functionality)
  useEffect(() => {
    // This could be expanded to load existing outlet data for editing
    // For now, it's just a placeholder for future enhancement
  }, []);

  const updateFormData = (field: keyof OutletForm, value: string | string[] | any | null) => {
    console.log('updateFormData:', { field, value });
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('New form data:', newData);
      return newData;
    });
  };

  const canProceedToNextStep = (): boolean => {
    const result = (() => {
      switch (currentStep) {
        case 1: // Basic Info
          return formData.name.trim() !== '' && 
                 formData.streetAddress.trim() !== '' && 
                 formData.province !== null && 
                 formData.regency !== null && 
                 formData.district !== null && 
                 formData.village !== null && 
                 formData.postalCode.trim() !== '';
        case 2: // Location
          return formData.latitude !== '' && formData.longitude !== '';
        case 3: // Photos
          const ktpValid = formData.ktpPhoto !== '';
          const outsideValid = formData.outsidePhotos.filter(p => p).length >= 3;
          const insideValid = formData.insidePhotos.filter(p => p).length >= 3;
          const inventoryValid = formData.inventoryPhotos.filter(p => p).length >= 3;
          
          console.log('Photo validation:', {
            currentStep,
            ktpValid,
            outsideValid,
            insideValid,
            inventoryValid,
            ktpPhoto: formData.ktpPhoto,
            outsidePhotos: formData.outsidePhotos,
            insidePhotos: formData.insidePhotos,
            inventoryPhotos: formData.inventoryPhotos
          });
          
          return ktpValid && outsideValid && insideValid && inventoryValid;
        default:
          return true;
      }
    })();
    
    console.log('canProceedToNextStep:', { currentStep, result });
    return result;
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
      if (!formData.name.trim() || !formData.streetAddress.trim() || !formData.province || 
          !formData.regency || !formData.district || !formData.village || !formData.postalCode.trim() ||
          !formData.ktpPhoto || formData.outsidePhotos.filter(p => p).length < 3 ||
          formData.insidePhotos.filter(p => p).length < 3 || formData.inventoryPhotos.filter(p => p).length < 3) {
        Alert.alert(
          t('error'),
          t('fillRequiredFieldsAndPhotos'),
          [
            { text: t('ok'), style: 'cancel' }
          ]
        );
        return;
      }

      // Form completed - save outlet data and show success
      try {
        // Create outlet object from form data
        const outletData = {
          id: `OUTLET-${Date.now()}`, // Generate unique ID
          name: formData.name.trim(),
          streetAddress: formData.streetAddress.trim(),
          province: formData.province ? {
            code: formData.province.code,
            name: formData.province.name
          } : { code: '', name: '' },
          regency: formData.regency ? {
            code: formData.regency.code,
            name: formData.regency.name
          } : { code: '', name: '' },
          district: formData.district ? {
            code: formData.district.code,
            name: formData.district.name
          } : { code: '', name: '' },
          village: formData.village ? {
            code: formData.village.code,
            name: formData.village.name
          } : { code: '', name: '' },
          postalCode: formData.postalCode.trim(),
          latitude: formData.latitude,
          longitude: formData.longitude,
          ktpPhoto: formData.ktpPhoto,
          outsidePhotos: formData.outsidePhotos,
          insidePhotos: formData.insidePhotos,
          inventoryPhotos: formData.inventoryPhotos,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Save to local storage
        await saveOutlet(outletData);

        // Show success message
        Alert.alert(
          t('onboardingComplete'),
          t('onboardingCompleteMessage'),
          [
            { 
              text: t('ok'), 
              onPress: () => router.back()
            }
          ]
        );
      } catch (error) {
        console.error('Error saving outlet data:', error);
        Alert.alert(
          t('error'),
          t('failedSaveOutletData'),
          [
            { text: t('ok'), style: 'cancel' }
          ]
        );
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
          <View key={i} style={styles.stepContainer}>
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
                {i === 0 ? t('basicInfo') : 
                 i === 1 ? t('location') : 
                 i === 2 ? t('photos') : t('review')}
              </Text>
            </View>
            {i < totalSteps - 1 && (
              <View style={[
                styles.stepLine,
                currentStep > i + 1 ? styles.stepLineCompleted : styles.stepLineInactive
              ]} />
            )}
          </View>
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
            !canProceedToNextStep() && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!canProceedToNextStep()}
        >
          <Text style={[
            styles.nextButtonText,
            !canProceedToNextStep() && styles.nextButtonTextDisabled
          ]}>
            {currentStep === totalSteps ? t('submitOutlet') : t('next')}
          </Text>
        </TouchableOpacity>
      </View>


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
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 30,
    height: 2,
    marginHorizontal: 6,
    borderRadius: 1,
  },
  stepLineCompleted: {
    backgroundColor: '#667eea',
  },
  stepLineInactive: {
    backgroundColor: '#e0e0e0',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
    textAlign: 'center',
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

}); 