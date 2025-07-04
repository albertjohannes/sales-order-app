import HeaderWithSettings from '@/components/HeaderWithSettings';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CartItem } from '@/data/mockData';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function CartTabScreen() {
  const { t } = useLanguage();
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const total = getTotal();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert(t('emptyCart'), t('cartEmptyMessage'));
      return;
    }
    router.push('/confirmation');
  };

  const handleRemoveItem = (item: CartItem) => {
    Alert.alert(
      t('deleteItem'),
      t('deleteItemConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: () => removeFromCart(item.id)
        }
      ]
    );
  };

  const renderRightActions = (item: CartItem) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveItem(item)}
      >
        <Text style={styles.deleteButtonText}>{t('delete')}</Text>
      </TouchableOpacity>
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item)}
      rightThreshold={40}
    >
      <View style={styles.cartItem}>
        <Image
          source={item.imageUrl ? { uri: item.imageUrl } : undefined}
          style={styles.itemImage}
          contentFit="cover"
          placeholder={require('@/assets/images/warung_logo.png')}
          transition={200}
        />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSku}>{item.sku}</Text>
          </View>
          <Text style={styles.itemBrand}>{item.brand}</Text>
          <View style={styles.bottomRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
                activeOpacity={0.7}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                activeOpacity={0.7}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <HeaderWithSettings title={t('cart')} />
      
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>{t('emptyCart')}</Text>
            <Text style={styles.emptyCartSubtext}>{t('cartEmptyMessage')}</Text>
          </View>
        }
      />
      

      
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{t('total')}:</Text>
            <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton} 
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutButtonText}>{t('checkout')}</Text>
          </TouchableOpacity>
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
  cartList: {
    flex: 1,
    padding: 12,
  },
  cartItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 80,
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
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
    color: '#333',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    minWidth: 80,
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: 100, // Add extra padding for tab bar
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

}); 