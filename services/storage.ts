import { PaymentCollection, Transaction } from '@/data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BalanceData {
  distributor_id: string;
  distributor_name: string;
  outlet_id: string;
  outlet_Name: string | null;
  limit_type: string;
  plafond_amount: number;
  available_amount: number;
  outstanding_amount: number;
  hold_amount: number;
  lastUpdated: string;
}

const BALANCE_STORAGE_KEY = 'warung_order_app_balance_data';
const TRANSACTIONS_STORAGE_KEY = 'warung_order_app_transactions_data';
const PAYMENT_COLLECTIONS_STORAGE_KEY = 'warung_order_app_payment_collections_data';

export const saveBalanceData = async (data: BalanceData): Promise<void> => {
  try {
    await AsyncStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving balance data:', error);
  }
};

export const getBalanceData = async (): Promise<BalanceData | null> => {
  try {
    const data = await AsyncStorage.getItem(BALANCE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting balance data:', error);
    return null;
  }
};

export const clearBalanceData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BALANCE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing balance data:', error);
  }
};

export const saveTransaction = async (transaction: Transaction): Promise<void> => {
  try {
    const existingTransactions = await getTransactions();
    
    // Check if transaction already exists (by transaction_id)
    const existingIndex = existingTransactions.findIndex(t => t.transaction_id === transaction.transaction_id);
    
    let updatedTransactions: Transaction[];
    if (existingIndex !== -1) {
      // Update existing transaction
      updatedTransactions = [...existingTransactions];
      updatedTransactions[existingIndex] = transaction;
    } else {
      // Add new transaction at the beginning
      updatedTransactions = [transaction, ...existingTransactions];
    }
    
    await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const clearTransactions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing transactions:', error);
  }
};

// Payment Collection Storage Functions
export const savePaymentCollection = async (collection: PaymentCollection): Promise<void> => {
  try {
    const existingCollections = await getPaymentCollections();
    
    // Check if collection already exists (by id)
    const existingIndex = existingCollections.findIndex(c => c.id === collection.id);
    
    let updatedCollections: PaymentCollection[];
    if (existingIndex !== -1) {
      // Update existing collection
      updatedCollections = [...existingCollections];
      updatedCollections[existingIndex] = collection;
    } else {
      // Add new collection at the beginning
      updatedCollections = [collection, ...existingCollections];
    }
    
    await AsyncStorage.setItem(PAYMENT_COLLECTIONS_STORAGE_KEY, JSON.stringify(updatedCollections));
  } catch (error) {
    console.error('Error saving payment collection:', error);
  }
};

export const getPaymentCollections = async (): Promise<PaymentCollection[]> => {
  try {
    const data = await AsyncStorage.getItem(PAYMENT_COLLECTIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting payment collections:', error);
    return [];
  }
};

export const clearPaymentCollections = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PAYMENT_COLLECTIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing payment collections:', error);
  }
}; 