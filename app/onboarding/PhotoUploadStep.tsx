import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
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
import * as ImagePicker from 'expo-image-picker';

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

  // Debug logging
  console.log('PhotoUploadStep formData:', {
    ktpPhoto: formData.ktpPhoto,
    outsidePhotos: formData.outsidePhotos,
    insidePhotos: formData.insidePhotos,
    inventoryPhotos: formData.inventoryPhotos
  });

  const handlePhotoUpload = (type: 'ktp' | 'outside' | 'inside' | 'inventory', index?: number) => {
    // For iOS simulator, use test images
    if (__DEV__ && Platform.OS === 'ios') {
      useTestImage(type, index);
    } else {
      // Use real camera capture
      openCamera(type, index);
    }
  };

  // Test image function for iOS simulator
  const useTestImage = (type: 'ktp' | 'outside' | 'inside' | 'inventory', index?: number) => {
    // For testing, we'll use a placeholder file URI
    // In a real app, you might want to use actual test images from assets
    const testImageUri = `file:///test-${type}-${index || 0}.jpg`;
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
      quality: 0.8,
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
  };

  const savePhoto = (uri: string, type: 'ktp' | 'outside' | 'inside' | 'inventory', index?: number) => {
    console.log('Saving photo:', { uri, type, index });
    if (type === 'ktp') {
      updateFormData('ktpPhoto', uri);
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
      handlePhotoUpload(type as 'ktp' | 'outside' | 'inside' | 'inventory', index);
    }, 100);
  };

  const closePreview = () => {
    setPreviewModal({ visible: false, uri: '', type: '', index: undefined });
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('outletPhotos')}</Text>
      <Text style={styles.stepDescription}>{t('outletPhotosDesc')}</Text>
      
      {/* KTP Photo */}
      <View style={styles.photoSection}>
        <Text style={styles.photoSectionTitle}>{t('ktpPhoto')} *</Text>
        <TouchableOpacity 
          style={styles.photoUploadButton}
          onPress={() => formData.ktpPhoto ? handlePhotoPreview(formData.ktpPhoto, 'ktp') : handlePhotoUpload('ktp')}
        >
          {formData.ktpPhoto ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: formData.ktpPhoto }} style={styles.photoPreviewImage} />
              <View style={styles.photoOverlay}>
                <IconSymbol name="eye.fill" size={20} color="white" />
                <Text style={styles.photoOverlayText}>{t('tapToView')}</Text>
              </View>
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
        <Text style={styles.photoSectionTitle}>{t('outletOutsidePhotos')} * ({t('twoRequiredThirdOptional')})</Text>
        <View style={styles.photoGrid}>
          {[0, 1, 2].map((index) => (
            <View key={index} style={styles.photoGridItemContainer}>
              <TouchableOpacity 
                style={[
                  styles.photoGridItem,
                  index === 2 && styles.optionalPhotoItem
                ]}
                onPress={() => formData.outsidePhotos[index] ? handlePhotoPreview(formData.outsidePhotos[index], 'outside', index) : handlePhotoUpload('outside', index)}
              >
                {formData.outsidePhotos[index] ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: formData.outsidePhotos[index] }} style={styles.photoGridPreviewImage} />
                    <View style={styles.photoOverlay}>
                      <IconSymbol name="eye.fill" size={16} color="white" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.photoUploadPlaceholder}>
                    <IconSymbol name="camera.fill" size={24} color={index === 2 ? "#999" : "#007AFF"} />
                    <Text style={[
                      styles.photoUploadText,
                      index === 2 && styles.optionalPhotoText
                    ]}>
                      {index === 2 ? t('photoOptional') : `${t('photo')} ${index + 1}`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* Add camera button for each grid item */}
              {formData.outsidePhotos[index] && (
                <TouchableOpacity 
                  style={styles.gridCameraButton}
                  onPress={() => handlePhotoUpload('outside', index)}
                >
                  <IconSymbol name="camera.fill" size={12} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Inside Photos */}
      <View style={styles.photoSection}>
        <Text style={styles.photoSectionTitle}>{t('outletInsidePhotos')} * ({t('twoRequiredThirdOptional')})</Text>
        <View style={styles.photoGrid}>
          {[0, 1, 2].map((index) => (
            <View key={index} style={styles.photoGridItemContainer}>
              <TouchableOpacity 
                style={[
                  styles.photoGridItem,
                  index === 2 && styles.optionalPhotoItem
                ]}
                onPress={() => formData.insidePhotos[index] ? handlePhotoPreview(formData.insidePhotos[index], 'inside', index) : handlePhotoUpload('inside', index)}
              >
                {formData.insidePhotos[index] ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: formData.insidePhotos[index] }} style={styles.photoGridPreviewImage} />
                    <View style={styles.photoOverlay}>
                      <IconSymbol name="eye.fill" size={16} color="white" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.photoUploadPlaceholder}>
                    <IconSymbol name="camera.fill" size={24} color={index === 2 ? "#999" : "#007AFF"} />
                    <Text style={[
                      styles.photoUploadText,
                      index === 2 && styles.optionalPhotoText
                    ]}>
                      {index === 2 ? t('photoOptional') : `${t('photo')} ${index + 1}`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* Add camera button for each grid item */}
              {formData.insidePhotos[index] && (
                <TouchableOpacity 
                  style={styles.gridCameraButton}
                  onPress={() => handlePhotoUpload('inside', index)}
                >
                  <IconSymbol name="camera.fill" size={12} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Inventory Photos */}
      <View style={styles.photoSection}>
        <Text style={styles.photoSectionTitle}>{t('outletInventoryPhotos')} * ({t('twoRequiredThirdOptional')})</Text>
        <View style={styles.photoGrid}>
          {[0, 1, 2].map((index) => (
            <View key={index} style={styles.photoGridItemContainer}>
              <TouchableOpacity 
                style={[
                  styles.photoGridItem,
                  index === 2 && styles.optionalPhotoItem
                ]}
                onPress={() => formData.inventoryPhotos[index] ? handlePhotoPreview(formData.inventoryPhotos[index], 'inventory', index) : handlePhotoUpload('inventory', index)}
              >
                {formData.inventoryPhotos[index] ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: formData.inventoryPhotos[index] }} style={styles.photoGridPreviewImage} />
                    <View style={styles.photoOverlay}>
                      <IconSymbol name="eye.fill" size={16} color="white" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.photoUploadPlaceholder}>
                    <IconSymbol name="camera.fill" size={24} color={index === 2 ? "#999" : "#007AFF"} />
                    <Text style={[
                      styles.photoUploadText,
                      index === 2 && styles.optionalPhotoText
                    ]}>
                      {index === 2 ? t('photoOptional') : `${t('photo')} ${index + 1}`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* Add camera button for each grid item */}
              {formData.inventoryPhotos[index] && (
                <TouchableOpacity 
                  style={styles.gridCameraButton}
                  onPress={() => handlePhotoUpload('inventory', index)}
                >
                  <IconSymbol name="camera.fill" size={12} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
          ))}
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
    height: 120,
    justifyContent: 'center',
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
  photoPreviewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
  photoOverlayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  photoGridItemContainer: {
    flex: 1,
    position: 'relative',
  },
  photoGridItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    aspectRatio: 1,
  },
  gridCameraButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
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
  optionalPhotoItem: {
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    opacity: 0.7,
  },
  optionalPhotoText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
