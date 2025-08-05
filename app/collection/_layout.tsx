import { useLanguage } from '@/contexts/LanguageContext';
import { Stack } from 'expo-router';

export default function CollectionLayout() {
  const { t } = useLanguage();
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="payment" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
} 