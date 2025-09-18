import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
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
  insidePhotos: string[]; // Max 2 inside photos
  inventoryPhotos: string[]; // Max 2 inventory photos
  // Questionnaire fields
  quizTopSellingItems: string[];
  quizPrimaryDistributor: string;
  quizReorderFrequency: string;
  quizBusinessType: string;
  quizYearsInBusiness: number | null;
}

interface PhotoUploadStepProps {
  formData: OutletForm;
  updateFormData: (field: keyof OutletForm, value: string | string[] | number | any | null) => void;
}

export default function PhotoUploadStep({ formData, updateFormData }: PhotoUploadStepProps) {
  const { t } = useLanguage();
  const [previewModal, setPreviewModal] = useState<{ visible: boolean; uri: string; type: string; index?: number }>({
    visible: false,
    uri: '',
    type: '',
    index: undefined
  });
  const [ktpGuideVisible, setKtpGuideVisible] = useState(false);

  // Debug logging
  console.log('PhotoUploadStep formData:', {
    ktpPhoto: formData.ktpPhoto,
    outsidePhoto: formData.outsidePhoto,
    insidePhotos: formData.insidePhotos,
    inventoryPhotos: formData.inventoryPhotos
  });

  const handlePhotoUpload = (type: 'ktp' | 'outside' | 'inside' | 'inventory', index?: number) => {
    console.log(`[PHOTO] handlePhotoUpload called for ${type}, index: ${index}`);
    console.log(`[PHOTO] __DEV__: ${__DEV__}, Platform.OS: ${Platform.OS}`);
    
    // For iOS simulator, use test images
    if (__DEV__ && Platform.OS === 'ios') {
      console.log(`[PHOTO] Using test image path`);
      useTestImage(type, index);
    } else {
      console.log(`[PHOTO] Using camera path`);
      // Use real camera capture
      openCamera(type, index);
    }
  };

  // Test image function for iOS simulator
  const useTestImage = (type: 'ktp' | 'outside' | 'inside' | 'inventory', index?: number) => {
    console.log(`[PHOTO] useTestImage called for ${type}, index: ${index}`);
    
    // For testing, use actual asset images that can be read by FormData
    let testImageUri: string;
    
    try {
      switch (type) {
        case 'ktp':
          testImageUri = Image.resolveAssetSource(require('../../assets/images/sales_logo.png')).uri;
          break;
        case 'outside':
          testImageUri = Image.resolveAssetSource(require('../../assets/images/banners/banner_1.png')).uri;
          break;
        case 'inside':
          const insideImages = [
            require('../../assets/images/banners/banner_2.png'),
            require('../../assets/images/banners/banner_3.png')
          ];
          testImageUri = Image.resolveAssetSource(insideImages[index || 0]).uri;
          break;
        case 'inventory':
          const inventoryImages = [
            require('../../assets/images/icon.png'),
            require('../../assets/images/favicon.png')
          ];
          testImageUri = Image.resolveAssetSource(inventoryImages[index || 0]).uri;
          break;
        default:
          testImageUri = Image.resolveAssetSource(require('../../assets/images/sales_logo.png')).uri;
      }
      
      console.log(`[PHOTO] Resolved asset URI for ${type}: ${testImageUri}`);
      console.log(`[PHOTO] URI type check - starts with file://: ${testImageUri.startsWith('file://')}`);
      console.log(`[PHOTO] URI type check - contains test-: ${testImageUri.includes('test-')}`);
      
    } catch (error) {
      console.error(`[PHOTO] Error resolving asset for ${type}:`, error);
      // Fallback to a simple test URI
      testImageUri = `file:///test-${type}-${index || 0}.jpg`;
    }
    
    console.log(`[PHOTO] Using test image URI for ${type} (iOS simulator): ${testImageUri}`);
    savePhoto(testImageUri, type, index);
  };


  // No longer needed - we'll store file URIs directly

  const openCamera = async (type: 'ktp' | 'outside' | 'inside' | 'inventory', index?: number) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('error'), 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.2,
      allowsEditing: false,
      exif: false,
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.uri) {
        console.log(`[PHOTO] Captured ${type} image, file URI: ${asset.uri}`);
        savePhoto(asset.uri, type, index);
      }
    } else if (result.canceled) {
      // user canceled
    } else {
      Alert.alert(t('error'), 'No image captured');
    }

    // Always close any open modals after camera interaction
    setPreviewModal({ visible: false, uri: '', type: '', index: undefined });
    setKtpGuideVisible(false);
  };

  const savePhoto = (uri: string, type: 'ktp' | 'outside' | 'inside' | 'inventory', index?: number) => {
    console.log('Saving photo:', { uri, type, index });
    if (type === 'ktp') {
      updateFormData('ktpPhoto', uri);
    } else if (type === 'outside') {
      updateFormData('outsidePhoto', uri);
    } else {
      const currentPhotos = formData[`${type}Photos` as keyof OutletForm] as string[];
      const newPhotos = [...currentPhotos];
      if (index !== undefined) {
        newPhotos[index] = uri;
      } else {
        newPhotos.push(uri);
      }
      updateFormData(`${type}Photos` as keyof OutletForm, newPhotos);
    }
  };

  const handlePhotoPreview = (uri: string, type: string, index?: number) => {
    setPreviewModal({
      visible: true,
      uri,
      type,
      index
    });
  };

  const handleRetakePhoto = () => {
    const { type, index } = previewModal;
    setPreviewModal({ visible: false, uri: '', type: '', index: undefined });
    // Small delay to ensure modal is closed before opening camera
    setTimeout(() => {
      // For KTP, show guidance again before opening camera
      if (type === 'ktp') {
        setKtpGuideVisible(true);
      } else {
        handlePhotoUpload(type as 'ktp' | 'outside' | 'inside' | 'inventory', index);
      }
    }, 100);
  };

  const closePreview = () => {
    setPreviewModal({ visible: false, uri: '', type: '', index: undefined });
  };

  const startKtpCapture = () => {
    setKtpGuideVisible(false);
    // Slight delay for smoother transition
    setTimeout(() => {
      handlePhotoUpload('ktp');
    }, 100);
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('outletPhotos')}</Text>
      <Text style={styles.stepDescription}>{t('outletPhotosDesc')}</Text>
      
      {/* Photo Grid - 2x3 layout */}
      <View style={styles.photoGrid}>
        {/* Row 1: KTP | Outside */}
        <View style={styles.photoRow}>
          {/* KTP Photo */}
          <View style={styles.photoGridItemContainer}>
            <View style={styles.photoLabelContainer}>
              <Text style={styles.photoLabel}>{t('ktpPhoto')} *</Text>
            </View>
            <TouchableOpacity 
              style={styles.photoGridItem}
              onPress={() => formData.ktpPhoto ? handlePhotoPreview(formData.ktpPhoto, 'ktp') : setKtpGuideVisible(true)}
            >
              {formData.ktpPhoto ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: formData.ktpPhoto }} style={styles.photoGridPreviewImage} />
                  <View style={styles.photoOverlay}>
                    <IconSymbol name="eye.fill" size={16} color="white" />
                  </View>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={styles.photoUploadText}>{t('uploadKTPPhoto')}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Outside Photo */}
          <View style={styles.photoGridItemContainer}>
            <View style={styles.photoLabelContainer}>
              <Text style={styles.photoLabel}>{t('outletOutsidePhoto')} *</Text>
            </View>
            <TouchableOpacity 
              style={styles.photoGridItem}
              onPress={() => formData.outsidePhoto ? handlePhotoPreview(formData.outsidePhoto, 'outside') : handlePhotoUpload('outside')}
            >
              {formData.outsidePhoto ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: formData.outsidePhoto }} style={styles.photoGridPreviewImage} />
                  <View style={styles.photoOverlay}>
                    <IconSymbol name="eye.fill" size={16} color="white" />
                  </View>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={styles.photoUploadText}>{t('uploadOutsidePhoto')}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Inside 1 | Inside 2 (optional) */}
        <View style={styles.photoRow}>
          {/* Inside Photo 1 */}
          <View style={styles.photoGridItemContainer}>
            <View style={styles.photoLabelContainer}>
              <Text numberOfLines={2} style={styles.photoLabel}>{t('outletInsidePhoto')} 1 *</Text>
            </View>
            <TouchableOpacity 
              style={styles.photoGridItem}
              onPress={() => formData.insidePhotos[0] ? handlePhotoPreview(formData.insidePhotos[0], 'inside', 0) : handlePhotoUpload('inside', 0)}
            >
              {formData.insidePhotos[0] ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: formData.insidePhotos[0] }} style={styles.photoGridPreviewImage} />
                  <View style={styles.photoOverlay}>
                    <IconSymbol name="eye.fill" size={16} color="white" />
                  </View>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={styles.photoUploadText}>{t('photo')} 1</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Inside Photo 2 (optional) */}
          <View style={styles.photoGridItemContainer}>
            <View style={styles.photoLabelContainer}>
              <Text numberOfLines={2} style={styles.photoLabel}>{t('outletInsidePhoto')} 2 <Text style={styles.optionalTextLabel}>(optional)</Text></Text>
            </View>
            <TouchableOpacity 
              style={[styles.photoGridItem, !formData.insidePhotos[1] && styles.optionalPhotoItem]}
              onPress={() => formData.insidePhotos[1] ? handlePhotoPreview(formData.insidePhotos[1], 'inside', 1) : handlePhotoUpload('inside', 1)}
            >
              {formData.insidePhotos[1] ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: formData.insidePhotos[1] }} style={styles.photoGridPreviewImage} />
                  <View style={styles.photoOverlay}>
                    <IconSymbol name="eye.fill" size={16} color="white" />
                  </View>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={[styles.photoUploadText, !formData.insidePhotos[1] && styles.optionalPhotoText]}>{t('photo')} 2</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 3: Inventory 1 | Inventory 2 (optional) */}
        <View style={styles.photoRow}>
          {/* Inventory Photo 1 */}
          <View style={styles.photoGridItemContainer}>
            <View style={styles.photoLabelContainer}>
              <Text numberOfLines={2} style={styles.photoLabel}>{t('outletInventoryPhoto')} 1 *</Text>
            </View>
            <TouchableOpacity 
              style={styles.photoGridItem}
              onPress={() => formData.inventoryPhotos[0] ? handlePhotoPreview(formData.inventoryPhotos[0], 'inventory', 0) : handlePhotoUpload('inventory', 0)}
            >
              {formData.inventoryPhotos[0] ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: formData.inventoryPhotos[0] }} style={styles.photoGridPreviewImage} />
                  <View style={styles.photoOverlay}>
                    <IconSymbol name="eye.fill" size={16} color="white" />
                  </View>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={styles.photoUploadText}>{t('photo')} 1</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Inventory Photo 2 (optional) */}
          <View style={styles.photoGridItemContainer}>
            <View style={styles.photoLabelContainer}>
              <Text numberOfLines={2} style={styles.photoLabel}>{t('outletInventoryPhoto')} 2 <Text style={styles.optionalTextLabel}>(optional)</Text></Text>
            </View>
            <TouchableOpacity 
              style={[styles.photoGridItem, !formData.inventoryPhotos[1] && styles.optionalPhotoItem]}
              onPress={() => formData.inventoryPhotos[1] ? handlePhotoPreview(formData.inventoryPhotos[1], 'inventory', 1) : handlePhotoUpload('inventory', 1)}
            >
              {formData.inventoryPhotos[1] ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: formData.inventoryPhotos[1] }} style={styles.photoGridPreviewImage} />
                  <View style={styles.photoOverlay}>
                    <IconSymbol name="eye.fill" size={16} color="white" />
                  </View>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#007AFF" />
                  <Text style={[styles.photoUploadText, !formData.inventoryPhotos[1] && styles.optionalPhotoText]}>{t('photo')} 2</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Photo Preview Modal */}
      <Modal
        visible={previewModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closePreview}
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closePreview}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('photoPreview')}</Text>
              <TouchableOpacity onPress={closePreview} style={styles.closeButton}>
                <IconSymbol name="xmark" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalHint}>{t('tapOutsideToClose')}</Text>
            <View style={styles.previewImageContainer}>
              <Image source={{ uri: previewModal.uri }} style={styles.previewImage} />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
                <IconSymbol name="camera.fill" size={16} color="#007AFF" />
                <Text style={styles.retakeButtonText}>{t('retakePhoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={closePreview}>
                <Text style={styles.doneButtonText}>{t('done')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* KTP Guidance Modal */}
      <Modal
        visible={ktpGuideVisible}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={() => setKtpGuideVisible(false)}
      >
        <View style={styles.ktpGuideOverlay}>
          <View style={styles.ktpGuideCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('ktpPhoto')}</Text>
              <TouchableOpacity onPress={() => setKtpGuideVisible(false)} style={styles.closeButton}>
                <IconSymbol name="xmark" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalHint, { marginTop: 4 }]}>
              {'Please align your KTP card within the frame before capturing.'}
            </Text>
            <View style={styles.ktpFrameContainer}>
              <View style={styles.ktpFrame}>
                <View style={styles.ktpFrameNotchTL} />
                <View style={styles.ktpFrameNotchTR} />
                <View style={styles.ktpFrameNotchBL} />
                <View style={styles.ktpFrameNotchBR} />
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.retakeButton} onPress={() => setKtpGuideVisible(false)}>
                <Text style={styles.retakeButtonText}>{t('cancel') || 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={startKtpCapture}>
                <IconSymbol name="camera.fill" size={16} color="#fff" />
                <Text style={styles.doneButtonText}>{'Start Camera'}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  photoGrid: {
    gap: 16,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoGridItemContainer: {
    flex: 1,
  },
  photoLabelContainer: {
    minHeight: 36,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 18,
  },
  optionalTextLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  photoGridItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    aspectRatio: 1,
    justifyContent: 'center',
  },
  photoUploadPlaceholder: {
    alignItems: 'center',
  },
  photoUploadText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  photoPreviewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  photoGridPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionalPhotoItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
    opacity: 0.8,
  },
  optionalPhotoText: {
    color: '#007AFF',
    fontSize: 12,
    fontStyle: 'normal',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 20,
    maxHeight: '85%',
    width: '95%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
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
  closeButton: {
    padding: 4,
  },
  modalHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: -8,
    marginBottom: 8,
  },
  previewImageContainer: {
    padding: 16,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8,
  },
  retakeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  doneButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    borderRadius: 12,
    padding: 16,
    marginLeft: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // KTP guidance styles
  ktpGuideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  ktpGuideCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '95%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  ktpFrameContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ktpFrame: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1.65, // approx ID card ratio
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00AEEF',
    position: 'relative',
    backgroundColor: '#f0f8ff',
  },
  ktpFrameNotchTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00AEEF',
    borderTopLeftRadius: 10,
  },
  ktpFrameNotchTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00AEEF',
    borderTopRightRadius: 10,
  },
  ktpFrameNotchBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00AEEF',
    borderBottomLeftRadius: 10,
  },
  ktpFrameNotchBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00AEEF',
    borderBottomRightRadius: 10,
  },
});
