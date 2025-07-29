const AsyncStorage = require('@react-native-async-storage/async-storage');

const samplePaymentCollections = [
  {
    id: 'PAY-2024-001',
    outletId: 'OUTLET-001',
    outletName: 'Warung Adil Jakarta',
    invoiceId: 'INV-001',
    invoiceAmount: 1500000,
    authorizationCode: 'WA-2024-ABC123',
    collectionDate: '2024-01-15T10:30:00Z',
    status: 'completed',
    notes: 'Payment collected successfully via QR scan'
  },
  {
    id: 'PAY-2024-002',
    outletId: 'OUTLET-002',
    outletName: 'Warung Adil Bandung',
    invoiceId: 'INV-003',
    invoiceAmount: 1800000,
    authorizationCode: 'WA-2024-DEF456',
    collectionDate: '2024-01-18T14:45:00Z',
    status: 'completed',
    notes: 'Payment collected via manual authorization code'
  },
  {
    id: 'PAY-2024-003',
    outletId: 'OUTLET-003',
    outletName: 'Warung Adil Surabaya',
    invoiceId: 'INV-004',
    invoiceAmount: 2100000,
    authorizationCode: 'WA-2024-GHI789',
    collectionDate: '2024-01-22T09:15:00Z',
    status: 'pending',
    notes: 'Payment pending confirmation'
  }
];

async function initializeSampleData() {
  try {
    await AsyncStorage.setItem('warung_order_app_payment_collections_data', JSON.stringify(samplePaymentCollections));
    console.log('✅ Sample payment collection data initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
  }
}

// Run the initialization
initializeSampleData(); 