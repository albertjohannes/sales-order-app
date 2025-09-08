import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDistricts, getProvinces, getRegencies, getVillages, type District, type Province, type Regency, type Village } from '@/data/indonesianRegions';
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

interface BasicInfoStepProps {
  formData: OutletForm;
  updateFormData: (field: keyof OutletForm, value: string | string[] | Province | Regency | District | Village | null) => void;
}

export default function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  const { t } = useLanguage();
  
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

  return (
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
          onChangeText={(text) => {
            // Only allow numbers and limit to 5 digits (Indonesia postal code standard)
            const numericText = text.replace(/[^0-9]/g, '');
            if (numericText.length <= 5) {
              updateFormData('postalCode', numericText);
            }
          }}
          placeholder={t('enterPostalCode')}
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={5}
        />
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
