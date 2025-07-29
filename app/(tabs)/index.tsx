import BannerCarousel from '@/components/BannerCarousel';
import HeaderWithSettings from '@/components/HeaderWithSettings';
import ProductImage from '@/components/ProductImage';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Item, mockItems } from '@/data/mockData';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
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

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

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
      <ProductImage
        imageUrl={item.imageUrl}
        style={styles.itemImage}
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
      <HeaderWithSettings title="Sales Order App" />
      
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
