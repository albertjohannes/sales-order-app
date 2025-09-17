import { Outlet } from '@/data/mockData';
import { TranslationKey } from '@/data/translations';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface OutletDetailModalProps {
  visible: boolean;
  outlet: Outlet | null;
  onClose: () => void;
  t?: (key: TranslationKey, params?: Record<string, string>) => string;
}

export default function OutletDetailModal(props: OutletDetailModalProps) {
  const { visible = false, outlet = null, onClose = () => {}, t: translate } = props || ({} as OutletDetailModalProps);
  const t = (key: TranslationKey, params?: Record<string, string>) => (translate ? translate(key, params) : String(key));
  const [preview, setPreview] = useState<string | null>(null);

  if (!outlet) return null;

  const openPreview = (uri: string) => setPreview(uri);
  const closePreview = () => setPreview(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const PhotoGrid = ({ title, photos }: { title: string; photos: string[] }) => (
    <View style={styles.photoSection}>
      <Text style={styles.photoSectionTitle}>{title}</Text>
      <View style={styles.photoGrid}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.photoGridItemContainer}>
            <TouchableOpacity
              style={styles.photoGridItem}
              onPress={() => photos[index] && openPreview(photos[index])}
              activeOpacity={photos[index] ? 0.9 : 1}
            >
              {photos[index] ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: photos[index] }} style={styles.photoGridPreviewImage} />
                  <View style={styles.photoOverlay}>
                    <Text style={styles.photoOverlayText}>{t('tapToView')}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <Text style={styles.photoUploadText}>{`${t('photo')} ${index + 1}`}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('outletDetails')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('basicInfo')}</Text>
            <View style={styles.row}><Text style={styles.label}>{t('outletName')}:</Text><Text style={styles.value}>{outlet.name || t('notAvailable')}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{t('streetAddress')}:</Text><Text style={[styles.value, styles.valueMultiline]}>{outlet.streetAddress || t('notAvailable')}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{t('outletProvince')}:</Text><Text style={styles.value}>{outlet.province?.name || t('notAvailable')}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{t('outletCity')}:</Text><Text style={styles.value}>{outlet.regency?.name || t('notAvailable')}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{t('district')}:</Text><Text style={styles.value}>{outlet.district?.name || t('notAvailable')}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{t('village')}:</Text><Text style={styles.value}>{outlet.village?.name || t('notAvailable')}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{t('postalCode')}:</Text><Text style={styles.value}>{outlet.postalCode || '-'}</Text></View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('location')}</Text>
            <View style={styles.row}><Text style={styles.label}>{t('coordinates')}:</Text><Text style={styles.value}>{outlet.latitude && outlet.longitude ? `${outlet.latitude}, ${outlet.longitude}` : t('notAvailable')}</Text></View>
            <View style={styles.row}><Text style={styles.label}>ID:</Text><Text style={styles.value}>{outlet.id}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{t('createdAt') || 'Created'}:</Text><Text style={styles.value}>{formatDateTime(outlet.createdAt)}</Text></View>
            <View style={styles.row}><Text style={styles.label}>{t('updatedAt') || 'Updated'}:</Text><Text style={styles.value}>{formatDateTime(outlet.updatedAt)}</Text></View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('photos')}</Text>
            {/* KTP Photo */}
            <View style={styles.photoSection}>
              <Text style={styles.photoSectionTitle}>{t('ktp')}</Text>
              <TouchableOpacity
                style={[styles.photoLargeContainer, !outlet.ktpPhoto && styles.photoLargeEmpty]}
                onPress={() => outlet.ktpPhoto && openPreview(outlet.ktpPhoto)}
                activeOpacity={outlet.ktpPhoto ? 0.9 : 1}
              >
                {outlet.ktpPhoto ? (
                  <Image source={{ uri: outlet.ktpPhoto }} style={styles.photoLarge} />
                ) : (
                  <Text style={styles.photoPlaceholderText}>{t('notAvailable')}</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Grids */}
            <PhotoGrid title={t('outletOutsidePhotos')} photos={outlet.outsidePhotos || []} />
            <PhotoGrid title={t('outletInsidePhotos')} photos={outlet.insidePhotos || []} />
            <PhotoGrid title={t('outletInventoryPhotos')} photos={outlet.inventoryPhotos || []} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('businessInformation')}</Text>
            {!!outlet.quizTopSellingItems && (
              <View style={styles.row}><Text style={styles.label}>{t('topSellingItems')}:</Text><Text style={styles.value}>{outlet.quizTopSellingItems.filter(i => i && i.trim()).join(', ') || t('notAvailable')}</Text></View>
            )}
            {!!outlet.quizPrimaryDistributor && (
              <View style={styles.row}><Text style={styles.label}>{t('primaryDistributor')}:</Text><Text style={styles.value}>{outlet.quizPrimaryDistributor || t('notAvailable')}</Text></View>
            )}
            {!!outlet.quizBusinessType && (
              <View style={styles.row}><Text style={styles.label}>{t('businessType')}:</Text><Text style={styles.value}>{outlet.quizBusinessType || t('notAvailable')}</Text></View>
            )}
            {!!outlet.quizReorderFrequency && (
              <View style={styles.row}><Text style={styles.label}>{t('reorderFrequency')}:</Text><Text style={styles.value}>{outlet.quizReorderFrequency || t('notAvailable')}</Text></View>
            )}
            {outlet.quizYearsInBusiness !== null && outlet.quizYearsInBusiness !== undefined && (
              <View style={styles.row}><Text style={styles.label}>{t('yearsInBusiness')}:</Text><Text style={styles.value}>{`${outlet.quizYearsInBusiness}`}</Text></View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Image Preview Modal */}
      <Modal visible={!!preview} transparent animationType="fade" onRequestClose={closePreview}>
        <TouchableOpacity style={styles.previewOverlay} activeOpacity={1} onPress={closePreview}>
          <View style={styles.previewBox}>
            {preview ? <Image source={{ uri: preview }} style={styles.previewImage} /> : null}
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#333',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  valueMultiline: {
    textAlign: 'right',
  },
  photoSection: {
    marginBottom: 16,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  photoLargeContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLargeEmpty: {
    backgroundColor: '#fafafa',
  },
  photoLarge: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoPlaceholderText: {
    color: '#999',
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  photoGridItemContainer: {
    flex: 1,
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  photoUploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  photoUploadText: {
    fontSize: 12,
    color: '#007AFF',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBox: {
    width: '92%',
    maxHeight: '85%',
    backgroundColor: 'black',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 360,
    resizeMode: 'contain',
  },
});
