import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrderLayout() {
  const { t } = useLanguage();
  const { cart } = useCart();
  const router = useRouter();

  const CartButton = () => (
    <TouchableOpacity 
      style={styles.cartButton} 
      onPress={() => router.push('/order/confirmation')}
    >
      <IconSymbol name="cart.fill" size={24} color="white" />
      {cart.length > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{cart.length}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="products" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="confirmation" 
        options={{ 
            headerShown: false
        }} 
      />
      <Stack.Screen 
        name="order-detail" 
        options={{ 
            headerShown: false
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 