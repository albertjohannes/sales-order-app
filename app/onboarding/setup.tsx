import HeaderWithSettings from '@/components/HeaderWithSettings';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDistricts, getProvinces, getRegencies, getVillages, type District, type Province, type Regency, type Village } from '@/data/indonesianRegions';
import { useRouter } from 'expo-router';
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

interface OutletForm {
  name: string;
  streetAddress: string;
  province: Province | null;
  regency: Regency | null;
  district: District | null;
  village: Village | null;
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

  // Modal states
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showRegencyModal, setShowRegencyModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showVillageModal, setShowVillageModal] = useState(false);

  // Search states
  const [provinceSearch, setProvinceSearch] = useState('');
  const [regencySearch, setRegencySearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [villageSearch, setVillageSearch] = useState('');

  const updateFormData = (field: keyof OutletForm, value: string | string[] | Province | Regency | District | Village | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvinceSelect = (province: Province) => {
    updateFormData('province', province);
    updateFormData('regency', null);
    updateFormData('district', null);
    updateFormData('village', null);
    setProvinceSearch('');
    setShowProvinceModal(false);
  };

  const handleRegencySelect = (regency: Regency) => {
    updateFormData('regency', regency);
    updateFormData('district', null);
    updateFormData('village', null);
    setRegencySearch('');
    setShowRegencyModal(false);
  };

  const handleDistrictSelect = (district: District) => {
    updateFormData('district', district);
    updateFormData('village', null);
    setDistrictSearch('');
    setShowDistrictModal(false);
  };

  const handleVillageSelect = (village: Village) => {
    updateFormData('village', village);
    setVillageSearch('');
    setShowVillageModal(false);
  };

  // Search functions
  const getFilteredProvinces = () => {
    const provinces = getProvinces();
    if (!provinceSearch.trim()) return provinces;
    return provinces.filter(province => 
      province.name.toLowerCase().includes(provinceSearch.toLowerCase())
    );
  };

  const getFilteredRegencies = () => {
    if (!formData.province) return [];
    const regencies = getRegencies(formData.province.code);
    if (!regencySearch.trim()) return regencies;
    return regencies.filter(regency => 
      regency.name.toLowerCase().includes(regencySearch.toLowerCase())
    );
  };

  const getFilteredDistricts = () => {
    if (!formData.province || !formData.regency) return [];
    const districts = getDistricts(formData.province.code, formData.regency.code);
    if (!districtSearch.trim()) return districts;
    return districts.filter(district => 
      district.name.toLowerCase().includes(districtSearch.toLowerCase())
    );
  };

  const getFilteredVillages = () => {
    if (!formData.province || !formData.regency || !formData.district) return [];
    const villages = getVillages(formData.province.code, formData.regency.code, formData.district.code);
    if (!villageSearch.trim()) return villages;
    return villages.filter(village => 
      village.name.toLowerCase().includes(villageSearch.toLowerCase())
    );
  };

  const handlePhotoUpload = (type: 'ktp' | 'outside' | 'inside' | 'inventory', index?: number) => {
    // Simulate photo upload - in real app this would open camera/gallery
    Alert.alert(
      t('photoUpload'),
      t('photoUploadMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('takePhoto'), 
          onPress: () => {
            const mockPhotoUrl = `photo_${type}_${Date.now()}.jpg`;
            if (type === 'ktp') {
              updateFormData('ktpPhoto', mockPhotoUrl);
            } else {
              const currentPhotos = formData[`${type}Photos` as keyof OutletForm] as string[];
              const newPhotos = [...currentPhotos];
              if (index !== undefined) {
                newPhotos[index] = mockPhotoUrl;
              } else {
                newPhotos.push(mockPhotoUrl);
              }
              updateFormData(`${type}Photos` as keyof OutletForm, newPhotos);
            }
          }
        }
      ]
    );
  };

  const handleLocationCapture = () => {
    // Simulate GPS capture
    Alert.alert(
      t('locationCapture'),
      t('locationCaptureMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('captureLocation'), 
          onPress: () => {
            // Mock GPS coordinates for Jakarta
            updateFormData('latitude', '-6.2088');
            updateFormData('longitude', '106.8456');
          }
        }
      ]
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Form completed - show success
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
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View key={i} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep > i + 1 ? styles.stepCompleted : 
            currentStep === i + 1 ? styles.stepActive : styles.stepInactive
          ]}>
            {currentStep > i + 1 ? (
              <IconSymbol name="checkmark" size={16} color="white" />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep === i + 1 ? styles.stepNumberActive : styles.stepNumberInactive
              ]}>
                {i + 1}
              </Text>
            )}
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
  );

  const renderBasicInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('outletBasicInfo')}</Text>
      <Text style={styles.stepDescription}>{t('outletBasicInfoDesc')}</Text>
      
      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('outletName')} *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          placeholder={t('enterOutletName')}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('streetAddress')} *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={formData.streetAddress}
          onChangeText={(text) => updateFormData('streetAddress', text)}
          placeholder={t('enterStreetAddress')}
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('province')} *</Text>
        <TouchableOpacity 
          style={styles.selectionButton}
          onPress={() => {
            setProvinceSearch('');
            setShowProvinceModal(true);
          }}
        >
          <View style={styles.selectionContent}>
            <IconSymbol name="building.2" size={24} color="#007AFF" />
            <View style={styles.selectionText}>
              <Text style={styles.selectionLabel}>
                {formData.province ? formData.province.name : t('selectProvince')}
              </Text>
            </View>
            <IconSymbol name="chevron.down" size={20} color="#999" />
          </View>
        </TouchableOpacity>
      </View>

      {formData.province && (
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>{t('regency')} *</Text>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => {
              setRegencySearch('');
              setShowRegencyModal(true);
            }}
          >
            <View style={styles.selectionContent}>
              <IconSymbol name="building.2" size={24} color="#007AFF" />
              <View style={styles.selectionText}>
                <Text style={styles.selectionLabel}>
                  {formData.regency ? formData.regency.name : t('selectRegency')}
                </Text>
              </View>
              <IconSymbol name="chevron.down" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {formData.regency && (
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>{t('district')} *</Text>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => {
              setDistrictSearch('');
              setShowDistrictModal(true);
            }}
          >
            <View style={styles.selectionContent}>
              <IconSymbol name="building.2" size={24} color="#007AFF" />
              <View style={styles.selectionText}>
                <Text style={styles.selectionLabel}>
                  {formData.district ? formData.district.name : t('selectDistrict')}
                </Text>
              </View>
              <IconSymbol name="chevron.down" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {formData.district && (
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>{t('village')} *</Text>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => {
              setVillageSearch('');
              setShowVillageModal(true);
            }}
          >
            <View style={styles.selectionContent}>
              <IconSymbol name="building.2" size={24} color="#007AFF" />
              <View style={styles.selectionText}>
                <Text style={styles.selectionLabel}>
                  {formData.village ? formData.village.name : t('selectVillage')}
                </Text>
              </View>
              <IconSymbol name="chevron.down" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.formSection}>
        <Text style={styles.fieldLabel}>{t('postalCode')} *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.postalCode}
          onChangeText={(text) => updateFormData('postalCode', text)}
          placeholder={t('enterPostalCode')}
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderLocationInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('outletLocation')}</Text>
      <Text style={styles.stepDescription}>{t('outletLocationDesc')}</Text>
      
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={handleLocationCapture}
      >
        <IconSymbol name="location.fill" size={24} color="#007AFF" />
        <View style={styles.locationText}>
          <Text style={styles.locationTitle}>{t('captureGPSLocation')}</Text>
          <Text style={styles.locationSubtitle}>
            {formData.latitude && formData.longitude 
              ? `${formData.latitude}, ${formData.longitude}`
              : t('tapToCaptureLocation')
            }
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color="#999" />
      </TouchableOpacity>

      {(formData.latitude || formData.longitude) && (
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateField}>
            <Text style={styles.fieldLabel}>{t('latitude')}</Text>
            <TextInput
              style={styles.textInput}
              value={formData.latitude}
              onChangeText={(text) => updateFormData('latitude', text)}
              placeholder="0.0000"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.coordinateField}>
            <Text style={styles.fieldLabel}>{t('longitude')}</Text>
            <TextInput
              style={styles.textInput}
              value={formData.longitude}
              onChangeText={(text) => updateFormData('longitude', text)}
              placeholder="0.0000"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderPhotoUpload = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('outletPhotos')}</Text>
      <Text style={styles.stepDescription}>{t('outletPhotosDesc')}</Text>
      
      {/* KTP Photo */}
      <View style={styles.photoSection}>
        <Text style={styles.photoSectionTitle}>{t('ktpPhoto')} *</Text>
        <TouchableOpacity 
          style={styles.photoUploadButton}
          onPress={() => handlePhotoUpload('ktp')}
        >
          {formData.ktpPhoto ? (
            <View style={styles.photoPreview}>
              <IconSymbol name="checkmark.circle.fill" size={24} color="#28a745" />
              <Text style={styles.photoUploadedText}>{t('photoUploaded')}</Text>
            </View>
          ) : (
            <View style={styles.photoUploadPlaceholder}>
              <IconSymbol name="camera.fill" size={32} color="#007AFF" />
              <Text style={styles.photoUploadText}>{t('uploadKTPPhoto')}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Outside Photos */}
      <View style={styles.photoSection}>
        <Text style={styles.photoSectionTitle}>{t('outletOutsidePhotos')} *</Text>
        <View style={styles.photoGrid}>
          {[0, 1, 2].map((index) => (
            <TouchableOpacity 
              key={index}
              style={styles.photoGridItem}
              onPress={() => handlePhotoUpload('outside', index)}
            >
              {formData.outsidePhotos[index] ? (
                <View style={styles.photoPreview}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#28a745" />
                  <Text style={styles.photoUploadedText}>{t('uploaded')}</Text>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={styles.photoUploadText}>{t('photo')} {index + 1}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Inside Photos */}
      <View style={styles.photoSection}>
        <Text style={styles.photoSectionTitle}>{t('outletInsidePhotos')} *</Text>
        <View style={styles.photoGrid}>
          {[0, 1, 2].map((index) => (
            <TouchableOpacity 
              key={index}
              style={styles.photoGridItem}
              onPress={() => handlePhotoUpload('inside', index)}
            >
              {formData.insidePhotos[index] ? (
                <View style={styles.photoPreview}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#28a745" />
                  <Text style={styles.photoUploadedText}>{t('uploaded')}</Text>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={styles.photoUploadText}>{t('photo')} {index + 1}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Inventory Photos */}
      <View style={styles.photoSection}>
        <Text style={styles.photoSectionTitle}>{t('outletInventoryPhotos')} *</Text>
        <View style={styles.photoGrid}>
          {[0, 1, 2].map((index) => (
            <TouchableOpacity 
              key={index}
              style={styles.photoGridItem}
              onPress={() => handlePhotoUpload('inventory', index)}
            >
              {formData.inventoryPhotos[index] ? (
                <View style={styles.photoPreview}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#28a745" />
                  <Text style={styles.photoUploadedText}>{t('uploaded')}</Text>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={styles.photoUploadText}>{t('photo')} {index + 1}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderReview = () => (
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderLocationInfo();
      case 3:
        return renderPhotoUpload();
      case 4:
        return renderReview();
      default:
        return renderBasicInfo();
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
            currentStep === totalSteps && styles.submitButton
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? t('submitOutlet') : t('next')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Province Selection Modal */}
      <Modal
        visible={showProvinceModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectProvince')}</Text>
            <TouchableOpacity onPress={() => setShowProvinceModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              value={provinceSearch}
              onChangeText={setProvinceSearch}
              placeholder={t('searchProvince')}
              placeholderTextColor="#999"
            />
          </View>
          <FlatList
            data={getFilteredProvinces()}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleProvinceSelect(item)}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Regency Selection Modal */} 
      <Modal
        visible={showRegencyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectRegency')}</Text>
            <TouchableOpacity onPress={() => setShowRegencyModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              value={regencySearch}
              onChangeText={setRegencySearch}
              placeholder={t('searchRegency')}
              placeholderTextColor="#999"
            />
          </View>
          <FlatList
            data={getFilteredRegencies()}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleRegencySelect(item)}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* District Selection Modal */}
      <Modal
        visible={showDistrictModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectDistrict')}</Text>
            <TouchableOpacity onPress={() => setShowDistrictModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              value={districtSearch}
              onChangeText={setDistrictSearch}
              placeholder={t('searchDistrict')}
              placeholderTextColor="#999"
            />
          </View>
          <FlatList
            data={getFilteredDistricts()}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleDistrictSelect(item)}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Village Selection Modal */}
      <Modal
        visible={showVillageModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectVillage')}</Text>
            <TouchableOpacity onPress={() => setShowVillageModal(false)}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              value={villageSearch}
              onChangeText={setVillageSearch}
              placeholder={t('searchVillage')}
              placeholderTextColor="#999"
            />
          </View>
          <FlatList
            data={getFilteredVillages()}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleVillageSelect(item)}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: '#28a745',
  },
  stepActive: {
    backgroundColor: '#007AFF',
  },
  stepInactive: {
    backgroundColor: '#e0e0e0',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepNumberInactive: {
    color: '#666',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#28a745',
  },
  stepLineInactive: {
    backgroundColor: '#e0e0e0',
  },
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
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  locationText: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  coordinateField: {
    flex: 1,
  },
  photoSection: {
    marginBottom: 24,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  photoUploadButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  photoUploadPlaceholder: {
    alignItems: 'center',
  },
  photoUploadText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '500',
  },
  photoPreview: {
    alignItems: 'center',
  },
  photoUploadedText: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 4,
    fontWeight: '500',
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  photoGridItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    aspectRatio: 1,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
}); 