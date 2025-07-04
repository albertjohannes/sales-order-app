import BalanceDetailsModal from '@/components/BalanceDetailsModal';
import BannerCarousel from '@/components/BannerCarousel';
import HeaderWithSettings from '@/components/HeaderWithSettings';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { BalanceData, Item, mockBalanceData, mockItems } from '@/data/mockData';
import { getBalanceData, saveBalanceData } from '@/services/storage';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const { t, tText } = useLanguage();
  const { addToCart } = useCart();

  // Banner images
  const bannerImages = [
    require('@/assets/images/banners/banner_1.png'),
    require('@/assets/images/banners/banner_2.png'),
    require('@/assets/images/banners/banner_3.png'),
  ];

  // Get unique brands from items
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(mockItems.map(item => item.brand))];
    return uniqueBrands.sort();
  }, []);

  // Filter items based on selected brand
  const filteredItems = useMemo(() => {
    if (!selectedBrand) return mockItems;
    return mockItems.filter(item => item.brand === selectedBrand);
  }, [selectedBrand]);

  const loadBalanceData = async () => {
    try {
      const savedData = await getBalanceData();
      if (savedData) {
        setBalanceData(savedData);
      }
    } catch (error) {
      console.error('Error loading balance data:', error);
    }
  };

  const fetchBalance = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBalanceData: BalanceData = {
        ...mockBalanceData,
        lastUpdated: new Date().toISOString()
      };

      setBalanceData(newBalanceData);
      await saveBalanceData(newBalanceData);
    } catch (error) {
      console.error('Error fetching balance:', error);
      Alert.alert(t('error'), t('connectionError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchBalance(false);
  };

  const handleBalanceTap = () => {
    if (balanceData) {
      setShowBalanceModal(true);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  useEffect(() => {
    loadBalanceData();
    fetchBalance();
  }, []);

  const handleAddToCart = (item: Item) => {
    addToCart(item);
    
    // Show notification
    setAddedItemName(item.name);
    setShowAddedNotification(true);
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      setShowAddedNotification(false);
    }, 2000);
  };

  const handleBrandFilter = (brand: string | null) => {
    setSelectedBrand(brand);
  };

  const renderBrandFilter = () => (
    <View style={styles.filterSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedBrand && styles.filterChipActive
          ]}
          onPress={() => handleBrandFilter(null)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.filterChipText,
            !selectedBrand && styles.filterChipTextActive
          ]}>
            {t('allBrands')}
          </Text>
        </TouchableOpacity>
        
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand}
            style={[
              styles.filterChip,
              selectedBrand === brand && styles.filterChipActive
            ]}
            onPress={() => handleBrandFilter(brand)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterChipText,
              selectedBrand === brand && styles.filterChipTextActive
            ]}>
              {brand}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemCard}>
      <Image
        source={item.imageUrl ? { uri: item.imageUrl } : undefined}
        style={styles.itemImage}
        contentFit="cover"
        placeholder={require('@/assets/images/warung_logo.png')}
        transition={200}
      />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSku}>{item.sku}</Text>
        </View>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <Text style={styles.itemDescription}>{tText(item.description)}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)} / {t('unit')}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Settings */}
      <HeaderWithSettings title="WarungOrderApp" />
      
      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <TouchableOpacity 
          style={styles.balanceContainer}
          onPress={handleBalanceTap}
          activeOpacity={0.8}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/warung_logo.png')}
              style={styles.partnerLogo}
              contentFit="contain"
            />
          </View>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>{t('availablePlafond')}</Text>
            {loading ? (
              <ActivityIndicator size="small" color="white" style={styles.loadingIndicator} />
            ) : (
              <Text style={styles.balanceAmount}>
                {balanceData ? formatPrice(balanceData.available_amount) : 'Rp 0'}
              </Text>
            )}
            {balanceData && (
              <Text style={styles.lastUpdated}>
                {t('lastUpdated')}: {formatLastUpdated(balanceData.lastUpdated)}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Text style={styles.refreshIcon}>
              {refreshing ? '⏳' : '🔄'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Banner Carousel */}
      <BannerCarousel banners={bannerImages} />

      {/* Brand Filter */}
      {renderBrandFilter()}

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.itemsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>
              {selectedBrand 
                ? `${t('noItemsForBrand')} "${selectedBrand}"`
                : t('noItems')
              }
            </Text>
          </View>
        }
      />

      {/* Added to Cart Notification */}
      {showAddedNotification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>
            ✅ {addedItemName} {t('addedToCart')}
          </Text>
        </View>
      )}

      {/* Balance Details Modal */}
      <BalanceDetailsModal
        visible={showBalanceModal}
        balanceData={balanceData}
        onClose={() => setShowBalanceModal(false)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceSection: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    marginRight: 12,
  },
  partnerLogo: {
    width: 40,
    height: 40,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  lastUpdated: {
    fontSize: 10,
    color: 'white',
    opacity: 0.7,
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
    marginLeft: 8,
  },
  refreshIcon: {
    fontSize: 20,
    color: 'white',
  },
  filterSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterChipTextActive: {
    color: 'white',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  itemCard: {
    backgroundColor: 'white',
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  itemSku: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  itemBrand: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyListText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  notification: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
