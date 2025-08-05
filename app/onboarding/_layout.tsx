import { useLanguage } from '@/contexts/LanguageContext';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  const { t } = useLanguage();
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="setup" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
} 