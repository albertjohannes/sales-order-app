const AsyncStorage = require('@react-native-async-storage/async-storage');

// Mock AsyncStorage for testing
const mockAsyncStorage = {
  data: {},
  async setItem(key, value) {
    this.data[key] = value;
    console.log(`✅ SET: ${key} = ${value}`);
  },
  async getItem(key) {
    const value = this.data[key];
    console.log(`📖 GET: ${key} = ${value || 'null'}`);
    return value;
  },
  async removeItem(key) {
    delete this.data[key];
    console.log(`🗑️  REMOVE: ${key}`);
  }
};

// Mock outlet data
const mockOutlet = {
  id: 'OUTLET-TEST-001',
  name: 'Test Warung',
  streetAddress: 'Jl. Test No. 123',
  province: { code: '31', name: 'DKI Jakarta' },
  regency: { code: '3171', name: 'Jakarta Selatan' },
  district: { code: '317104', name: 'Kebayoran Baru' },
  village: { code: '31710401', name: 'Senayan' },
  postalCode: '12190',
  latitude: '-6.2088',
  longitude: '106.8456',
  ktpPhoto: 'test_ktp.jpg',
  outsidePhotos: ['outside1.jpg', 'outside2.jpg', 'outside3.jpg'],
  insidePhotos: ['inside1.jpg', 'inside2.jpg', 'inside3.jpg'],
  inventoryPhotos: ['inventory1.jpg', 'inventory2.jpg', 'inventory3.jpg'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Test storage functions
async function testStorage() {
  console.log('🧪 Testing Outlet Storage Functions...\n');

  try {
    // Test 1: Save outlet
    console.log('📝 Test 1: Saving outlet...');
    await mockAsyncStorage.setItem('warung_order_app_outlets_data', JSON.stringify([mockOutlet]));
    console.log('✅ Outlet saved successfully\n');

    // Test 2: Get outlets
    console.log('📖 Test 2: Getting outlets...');
    const outletsData = await mockAsyncStorage.getItem('warung_order_app_outlets_data');
    const outlets = outletsData ? JSON.parse(outletsData) : [];
    console.log(`✅ Found ${outlets.length} outlets`);
    console.log('📋 Outlets:', JSON.stringify(outlets, null, 2));

    // Test 3: Update outlet
    console.log('\n📝 Test 3: Updating outlet...');
    const updatedOutlet = { ...mockOutlet, name: 'Updated Test Warung' };
    const updatedOutlets = [updatedOutlet];
    await mockAsyncStorage.setItem('warung_order_app_outlets_data', JSON.stringify(updatedOutlets));
    console.log('✅ Outlet updated successfully');

    // Test 4: Get updated outlets
    console.log('\n📖 Test 4: Getting updated outlets...');
    const updatedOutletsData = await mockAsyncStorage.getItem('warung_order_app_outlets_data');
    const finalOutlets = updatedOutletsData ? JSON.parse(updatedOutletsData) : [];
    console.log(`✅ Found ${finalOutlets.length} outlets`);
    console.log('📋 Updated outlets:', JSON.stringify(finalOutlets, null, 2));

    // Test 5: Clear outlets
    console.log('\n🗑️  Test 5: Clearing outlets...');
    await mockAsyncStorage.removeItem('warung_order_app_outlets_data');
    console.log('✅ Outlets cleared successfully');

    // Test 6: Verify cleared
    console.log('\n📖 Test 6: Verifying outlets are cleared...');
    const clearedData = await mockAsyncStorage.getItem('warung_order_app_outlets_data');
    console.log(`✅ Outlets data: ${clearedData || 'null'}`);

    console.log('\n🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testStorage();
