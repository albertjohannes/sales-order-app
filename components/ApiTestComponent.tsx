import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApi } from '@/services/api';

export default function ApiTestComponent() {
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const testHealth = async () => {
    try {
      setLoading(true);
      const result = await api.checkHealth();
      Alert.alert('Health Check', `Status: ${result.status}\nMessage: ${result.message}`);
    } catch (error) {
      Alert.alert('Error', `Health check failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testOnboarding = async () => {
    try {
      setLoading(true);
      const result = await api.getOnboarding();
      Alert.alert('Onboarding Data', `Found ${result.data?.length || 0} records`);
    } catch (error) {
      Alert.alert('Error', `Onboarding fetch failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCollections = async () => {
    try {
      setLoading(true);
      const result = await api.getCollections();
      Alert.alert('Collections Data', `Found ${result.data?.length || 0} records`);
    } catch (error) {
      Alert.alert('Error', `Collections fetch failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Test</Text>
      <TouchableOpacity style={styles.button} onPress={testHealth} disabled={loading}>
        <Text style={styles.buttonText}>Test Health</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testOnboarding} disabled={loading}>
        <Text style={styles.buttonText}>Test Onboarding</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testCollections} disabled={loading}>
        <Text style={styles.buttonText}>Test Collections</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
