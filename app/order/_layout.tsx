import { Stack } from 'expo-router';

export default function OrderLayout() {
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