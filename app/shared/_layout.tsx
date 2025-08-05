import { Stack } from 'expo-router';

export default function SharedLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="success" options={{ headerShown: false }} />
    </Stack>
  );
} 