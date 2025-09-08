import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { WebView } from 'react-native-webview';

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

interface LocationStepProps {
  formData: OutletForm;
  updateFormData: (field: keyof OutletForm, value: string | string[] | any | null) => void;
}

export default function LocationStep({ formData, updateFormData }: LocationStepProps) {
  const { t } = useLanguage();
  const [address, setAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);

  // Generate HTML for OpenStreetMap with marker
  const generateMapHTML = (lat: string, lng: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            body { margin: 0; padding: 0; }
            #map { height: 200px; width: 100%; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = L.map('map').setView([${lat}, ${lng}], 16);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            const marker = L.marker([${lat}, ${lng}]).addTo(map);
            marker.bindPopup('Outlet Location').openPopup();
          </script>
        </body>
      </html>
    `;
  };

  // Function to get address from coordinates using free Nominatim API
  const getAddressFromCoordinates = async (lat: string, lng: string) => {
    if (!lat || !lng) return;
    
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Unable to fetch address');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Fetch address when coordinates change
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      getAddressFromCoordinates(formData.latitude, formData.longitude);
    }
  }, [formData.latitude, formData.longitude]);

  const handleManualLocation = () => {
    Alert.alert(
      t('manualLocation'),
      t('manualLocationMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('useDefaultLocation'), 
          onPress: () => {
            // Use Jakarta coordinates as fallback
            updateFormData('latitude', '-6.2088');
            updateFormData('longitude', '106.8456');
            Alert.alert(
              t('defaultLocationSet'),
              t('defaultLocationMessage'),
              [{ text: t('ok') }]
            );
          }
        }
      ]
    );
  };

  const handleLocationCapture = async () => {
    try {
      setIsCapturingLocation(true);
      
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          t('locationServicesDisabled'),
          t('locationServicesMessage'),
          [
            { text: t('cancel'), style: 'cancel' },
            { text: t('openSettings'), onPress: () => {
              // Note: openSettingsAsync is not available in expo-location
              // User will need to manually go to settings
            }}
          ]
        );
        return;
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('permissionDenied'),
          t('locationPermissionMessage'),
          [
            { text: t('cancel'), style: 'cancel' },
            { text: t('openSettings'), onPress: () => {
              // Note: openSettingsAsync is not available in expo-location
              // User will need to manually go to settings
            }}
          ]
        );
        return;
      }

      // Get current location with timeout handling
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location timeout')), 15000)
        )
      ]) as Location.LocationObject;

      const { latitude, longitude } = location.coords;
      
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates received');
      }
      
      // Update form data with real coordinates
      updateFormData('latitude', latitude.toString());
      updateFormData('longitude', longitude.toString());
      
      console.log('Location captured:', { latitude, longitude });
      
      // Show success message
      Alert.alert(
        t('locationCaptured'),
        t('locationCapturedMessage'),
        [{ text: t('ok') }]
      );
      
    } catch (error: any) {
      console.error('Error getting location:', error);
      
      let errorMessage = t('locationError');
      
      // Handle specific error types
      if (error.message === 'Location timeout') {
        errorMessage = t('locationTimeout');
      } else if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
        errorMessage = t('locationServicesDisabled');
      } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
        errorMessage = t('locationUnavailable');
      } else if (error.message === 'Invalid coordinates received') {
        errorMessage = t('invalidCoordinates');
      }
      
      Alert.alert(
        t('error'),
        errorMessage,
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('tryAgain'), onPress: handleLocationCapture },
          { text: t('useManualLocation'), onPress: handleManualLocation }
        ]
      );
    } finally {
      setIsCapturingLocation(false);
    }
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('outletLocation')}</Text>
      <Text style={styles.stepDescription}>{t('outletLocationDesc')}</Text>
      
      <TouchableOpacity 
        style={[styles.locationButton, isCapturingLocation && styles.locationButtonDisabled]}
        onPress={handleLocationCapture}
        disabled={isCapturingLocation}
      >
        <IconSymbol 
          name={isCapturingLocation ? "arrow.clockwise" : "location.fill"} 
          size={24} 
          color={isCapturingLocation ? "#999" : "#007AFF"} 
        />
        <View style={styles.locationText}>
          <Text style={[styles.locationTitle, isCapturingLocation && styles.locationTitleDisabled]}>
            {isCapturingLocation ? t('capturingLocation') : t('captureGPSLocation')}
          </Text>
          <Text style={styles.locationSubtitle}>
            {formData.latitude && formData.longitude 
              ? `${formData.latitude}, ${formData.longitude}`
              : t('tapToCaptureLocation')
            }
          </Text>
        </View>
        {!isCapturingLocation && (
          <IconSymbol name="chevron.right" size={20} color="#999" />
        )}
      </TouchableOpacity>

      {/* Map Display */}
      {(formData.latitude && formData.longitude) && (
        <View style={styles.mapContainer}>
          <Text style={styles.fieldLabel}>{t('locationMap')}</Text>
          <View style={styles.mapWrapper}>
            <WebView
              source={{ html: generateMapHTML(formData.latitude, formData.longitude) }}
              style={styles.map}
              scrollEnabled={false}
              zoomEnabled={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      )}

      {/* Address Display */}
      {(formData.latitude && formData.longitude) && (
        <View style={styles.addressContainer}>
          <Text style={styles.fieldLabel}>{t('address')}</Text>
          <View style={styles.addressDisplay}>
            <IconSymbol name="location.circle" size={16} color="#007AFF" />
            <Text style={styles.addressText}>
              {isLoadingAddress ? t('loadingAddress') : address || t('noAddressFound')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stepContent: {
    marginTop: 12,
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
  locationButtonDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
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
  locationTitleDisabled: {
    color: '#999',
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  mapContainer: {
    marginTop: 12,
  },
  mapWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  map: {
    height: 200,
    width: '100%',
  },
  addressContainer: {
    marginTop: 16,
  },
  addressDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    lineHeight: 20,
  },
});
