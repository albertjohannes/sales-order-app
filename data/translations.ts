export interface TranslationText {
  id: string;
  en: string;
}

export const translations = {
  // Common
  loading: {
    id: 'Memuat...',
    en: 'Loading...'
  },
  error: {
    id: 'Error',
    en: 'Error'
  },
  cancel: {
    id: 'Batal',
    en: 'Cancel'
  },
  confirm: {
    id: 'Konfirmasi',
    en: 'Confirm'
  },
  yes: {
    id: 'Ya',
    en: 'Yes'
  },
  no: {
    id: 'Tidak',
    en: 'No'
  },
  close: {
    id: 'Tutup',
    en: 'Close'
  },
  save: {
    id: 'Simpan',
    en: 'Save'
  },
  delete: {
    id: 'Hapus',
    en: 'Delete'
  },
  edit: {
    id: 'Edit',
    en: 'Edit'
  },
  add: {
    id: 'Tambah',
    en: 'Add'
  },
  remove: {
    id: 'Hapus',
    en: 'Remove'
  },
  search: {
    id: 'Cari',
    en: 'Search'
  },
  refresh: {
    id: 'Segarkan',
    en: 'Refresh'
  },
  retry: {
    id: 'Coba Lagi',
    en: 'Retry'
  },

  // Navigation
  home: {
    id: 'Beranda',
    en: 'Home'
  },
  payment: {
    id: 'Pembayaran',
    en: 'Payment'
  },
  cart: {
    id: 'Keranjang',
    en: 'Cart'
  },
  history: {
    id: 'Riwayat',
    en: 'History'
  },
  settings: {
    id: 'Pengaturan',
    en: 'Settings'
  },
  profile: {
    id: 'Profil',
    en: 'Profile'
  },

  // Login
  login: {
    id: 'Masuk',
    en: 'Login'
  },
  logout: {
    id: 'Keluar',
    en: 'Logout'
  },
  signOut: {
    id: 'Keluar',
    en: 'Sign Out'
  },
  signOutConfirm: {
    id: 'Apakah Anda yakin ingin keluar?',
    en: 'Are you sure you want to sign out?'
  },
  username: {
    id: 'Nama Pengguna',
    en: 'Username'
  },
  password: {
    id: 'Kata Sandi',
    en: 'Password'
  },
  forgotPassword: {
    id: 'Lupa Kata Sandi?',
    en: 'Forgot Password?'
  },
  loginSuccess: {
    id: 'Berhasil masuk',
    en: 'Login successful'
  },
  loginFailed: {
    id: 'Gagal masuk',
    en: 'Login failed'
  },

  // Home Screen
  availablePlafond: {
    id: 'Plafon Tersedia',
    en: 'Available Plafond'
  },
  lastUpdated: {
    id: 'Terakhir diperbarui',
    en: 'Last updated'
  },
  addToCart: {
    id: 'Tambah ke Keranjang',
    en: 'Add to Cart'
  },
  addedToCart: {
    id: 'ditambahkan ke keranjang',
    en: 'added to cart'
  },
  specialOffers: {
    id: 'Penawaran Khusus Segera Hadir!',
    en: 'Special Offers Coming Soon!'
  },
  noItems: {
    id: 'Tidak ada produk',
    en: 'No items available'
  },
  noItemsForBrand: {
    id: 'Tidak ada produk untuk brand',
    en: 'No items for brand'
  },
  allBrands: {
    id: 'Semua Brand',
    en: 'All Brands'
  },
  unit: {
    id: 'unit',
    en: 'unit'
  },

  // Cart Screen
  emptyCart: {
    id: 'Keranjang Anda kosong',
    en: 'Your cart is empty'
  },
  total: {
    id: 'Total',
    en: 'Total'
  },
  checkout: {
    id: 'Bayar',
    en: 'Checkout'
  },
  quantity: {
    id: 'Jumlah',
    en: 'Quantity'
  },
  itemTotal: {
    id: 'Total Item',
    en: 'Item Total'
  },
  removeItem: {
    id: 'Hapus Item',
    en: 'Remove Item'
  },
  swipeToDelete: {
    id: 'Geser untuk hapus',
    en: 'Swipe to delete'
  },
  deleteItem: {
    id: 'Hapus',
    en: 'Delete'
  },
  deleteItemConfirm: {
    id: 'Hapus item ini dari keranjang?',
    en: 'Remove this item from cart?'
  },
  updateQuantity: {
    id: 'Perbarui Jumlah',
    en: 'Update Quantity'
  },
  cartEmptyMessage: {
    id: 'Silakan tambahkan produk ke keranjang terlebih dahulu',
    en: 'Please add items to your cart first'
  },

  // History Screen
  noTransactions: {
    id: 'Belum ada transaksi',
    en: 'No transactions yet'
  },
  noCollections: {
    id: 'Belum ada koleksi pembayaran',
    en: 'No payment collections yet'
  },
  transactionHistory: {
    id: 'Riwayat Transaksi',
    en: 'Transaction History'
  },
  transactionDate: {
    id: 'Tanggal Transaksi',
    en: 'Transaction Date'
  },
  transactionId: {
    id: 'ID Transaksi',
    en: 'Transaction ID'
  },
  items: {
    id: 'Item',
    en: 'Items'
  },
  amount: {
    id: 'Jumlah',
    en: 'Amount'
  },
  orders: {
    id: 'Pesanan',
    en: 'Orders'
  },
  collections: {
    id: 'Koleksi',
    en: 'Collections'
  },
  outlet: {
    id: 'Outlet',
    en: 'Outlet'
  },
  invoice: {
    id: 'Invoice',
    en: 'Invoice'
  },
  authCode: {
    id: 'Kode Otorisasi',
    en: 'Auth Code'
  },
  paymentCollection: {
    id: 'Koleksi Pembayaran',
    en: 'Payment Collection'
  },
  salesOrderApp: {
    id: 'Aplikasi Sales Order',
    en: 'Sales Order App'
  },
  selectOutlet: {
    id: 'Pilih Outlet',
    en: 'Select Outlet'
  },
  selectInvoice: {
    id: 'Pilih Invoice',
    en: 'Select Invoice'
  },
  authorization: {
    id: 'Otorisasi',
    en: 'Authorization'
  },
  chooseOutlet: {
    id: 'Pilih outlet',
    en: 'Choose outlet'
  },
  chooseInvoice: {
    id: 'Pilih invoice',
    en: 'Choose invoice'
  },
  authorizationCode: {
    id: 'Kode Otorisasi:',
    en: 'Authorization Code:'
  },
  enterAuthCodePlaceholder: {
    id: 'Masukkan kode otorisasi secara manual atau scan QR',
    en: 'Enter authorization code manually or scan QR'
  },
  validAuthCode: {
    id: 'Kode otorisasi valid',
    en: 'Valid authorization code'
  },
  invalidAuthCode: {
    id: 'Kode otorisasi tidak valid',
    en: 'Invalid authorization code'
  },
  submitPaymentCollection: {
    id: 'Kirim Koleksi Pembayaran',
    en: 'Submit Payment Collection'
  },
  scanQRPromo: {
    id: 'Scan kode QR dari aplikasi Warung Adil untuk otorisasi cepat. Input manual juga tersedia.',
    en: 'Scan QR codes from Warung Adil app for quick authorization. Manual entry also available.'
  },
  tapToScanQR: {
    id: 'Tap untuk scan QR otorisasi',
    en: 'Tap to scan authorization QR'
  },
  confirmTransaction: {
    id: 'Konfirmasi Transaksi',
    en: 'Confirm Transaction'
  },
  confirmPaymentMessage: {
    id: 'Konfirmasi pembayaran {amount} untuk {outlet}?',
    en: 'Confirm payment of {amount} for {outlet}?'
  },
  selectOutletFirst: {
    id: 'Silakan pilih outlet terlebih dahulu',
    en: 'Please select an outlet first'
  },
  selectInvoiceError: {
    id: 'Silakan pilih invoice',
    en: 'Please select an invoice'
  },
  scanValidAuthCode: {
    id: 'Silakan scan atau masukkan kode otorisasi yang valid',
    en: 'Please scan or enter a valid authorization code'
  },
  failedSavePayment: {
    id: 'Gagal menyimpan koleksi pembayaran',
    en: 'Failed to save payment collection'
  },
  welcome: {
    id: 'Selamat Datang',
    en: 'Welcome'
  },
  chooseAction: {
    id: 'Pilih Aksi',
    en: 'Choose Action'
  },
  onboard: {
    id: 'Onboard',
    en: 'Onboard'
  },
  onboardDesc: {
    id: 'Daftar outlet baru ke dalam sistem',
    en: 'Register new outlets to the system'
  },
  order: {
    id: 'Pesanan',
    en: 'Order'
  },
  orderDesc: {
    id: 'Buat pesanan dan kelola keranjang',
    en: 'Create orders and manage cart'
  },
  collection: {
    id: 'Koleksi',
    en: 'Collection'
  },
  collectionDesc: {
    id: 'Kelola pembayaran dan koleksi',
    en: 'Manage payments and collections'
  },
  paymentCollectionSuccess: {
    id: 'Koleksi Pembayaran Berhasil',
    en: 'Payment Collection Successful'
  },
  paymentCollectionSuccessMessage: {
    id: 'Pembayaran telah berhasil dikumpulkan dan dicatat. Transaksi telah dikonfirmasi dengan outlet.',
    en: 'Payment has been successfully collected and recorded. The transaction has been confirmed with the outlet.'
  },
  viewCollections: {
    id: 'Lihat Koleksi',
    en: 'View Collections'
  },

  // Success Screen
  orderSuccess: {
    id: 'Pesanan Berhasil!',
    en: 'Order Successful!'
  },
  thankYou: {
    id: 'Terima kasih atas pesanan Anda',
    en: 'Thank you for your order'
  },
  orderNumber: {
    id: 'Nomor Pesanan',
    en: 'Order Number'
  },
  backToHome: {
    id: 'Kembali ke Beranda',
    en: 'Back to Home'
  },
  viewOrder: {
    id: 'Lihat Pesanan',
    en: 'View Order'
  },

  // Balance Modal
  balanceDetails: {
    id: 'Detail Saldo',
    en: 'Balance Details'
  },
  distributorInfo: {
    id: 'Informasi Distributor',
    en: 'Distributor Information'
  },
  outletInfo: {
    id: 'Informasi Outlet',
    en: 'Outlet Information'
  },
  limitInfo: {
    id: 'Informasi Limit',
    en: 'Limit Information'
  },
  plafondAmount: {
    id: 'Jumlah Plafon',
    en: 'Plafond Amount'
  },
  availableAmount: {
    id: 'Jumlah Tersedia',
    en: 'Available Amount'
  },
  outstandingAmount: {
    id: 'Jumlah Terutang',
    en: 'Outstanding Amount'
  },
  holdAmount: {
    id: 'Jumlah Ditahan',
    en: 'Hold Amount'
  },
  limitType: {
    id: 'Jenis Limit',
    en: 'Limit Type'
  },
  notAvailable: {
    id: 'Tidak Tersedia',
    en: 'Not Available'
  },

  // Settings
  language: {
    id: 'Bahasa',
    en: 'Language'
  },
  indonesia: {
    id: '🇮🇩 Indonesia',
    en: '🇮🇩 Indonesia'
  },
  english: {
    id: '🇺🇸 English',
    en: '🇺🇸 English'
  },
  languageLabel: {
    id: 'Bahasa: ',
    en: 'Language: '
  },

  // API Messages
  connectionError: {
    id: 'Gagal terhubung ke server. Silakan coba lagi.',
    en: 'Failed to connect to server. Please try again.'
  },
  fetchBalanceError: {
    id: 'Gagal mengambil data saldo',
    en: 'Failed to fetch balance data'
  },
  networkError: {
    id: 'Error Jaringan',
    en: 'Network Error'
  },
  serverError: {
    id: 'Error Server',
    en: 'Server Error'
  },
  timeoutError: {
    id: 'Waktu tunggu habis',
    en: 'Request timeout'
  },

  // Validation Messages
  required: {
    id: 'Wajib diisi',
    en: 'Required'
  },
  invalidFormat: {
    id: 'Format tidak valid',
    en: 'Invalid format'
  },
  minLength: {
    id: 'Minimal {length} karakter',
    en: 'Minimum {length} characters'
  },
  maxLength: {
    id: 'Maksimal {length} karakter',
    en: 'Maximum {length} characters'
  },
  invalidEmail: {
    id: 'Email tidak valid',
    en: 'Invalid email'
  },
  invalidPhone: {
    id: 'Nomor telepon tidak valid',
    en: 'Invalid phone number'
  },
  passwordMismatch: {
    id: 'Kata sandi tidak cocok',
    en: 'Passwords do not match'
  },

  // Order Confirmation
  back: {
    id: 'Kembali',
    en: 'Back'
  },
  orderConfirmation: {
    id: 'Konfirmasi Pesanan',
    en: 'Order Confirmation'
  },
  warungBalance: {
    id: 'Saldo Warung',
    en: 'Warung Balance'
  },
  paymentMethod: {
    id: 'Metode Pembayaran',
    en: 'Payment Method'
  },
  warungLimit: {
    id: 'Limit Warung',
    en: 'Warung Limit'
  },
  warungLimitDesc: {
    id: 'Pembayaran menggunakan limit Warung',
    en: 'Payment using Warung limit'
  },
  orderItems: {
    id: 'Item Pesanan',
    en: 'Order Items'
  },
  totalAmount: {
    id: 'Total Pembayaran',
    en: 'Total Amount'
  },
  insufficientBalance: {
    id: 'Saldo tidak mencukupi',
    en: 'Insufficient balance'
  },
  insufficientBalanceMessage: {
    id: 'Saldo Warung tidak mencukupi untuk melakukan pembayaran',
    en: 'Warung balance is insufficient for payment'
  },
  shortage: {
    id: 'Kekurangan',
    en: 'Shortage'
  },
  confirmOrder: {
    id: 'Konfirmasi Pesanan',
    en: 'Confirm Order'
  },

  // Receipt Confirmation
  confirmReceipt: {
    id: 'Konfirmasi Resi',
    en: 'Confirm Receipt'
  },
  confirmReceiptMessage: {
    id: 'Apakah Anda ingin mengkonfirmasi resi untuk transaksi {transactionId}?',
    en: 'Do you want to confirm receipt for transaction {transactionId}?'
  },
  receiptConfirmed: {
    id: 'Resi berhasil dikonfirmasi!',
    en: 'Receipt confirmed successfully!'
  },
  receiptConfirmFailed: {
    id: 'Gagal mengkonfirmasi resi',
    en: 'Failed to confirm receipt'
  },
  receiptConfirmError: {
    id: 'Gagal mengkonfirmasi resi. Silakan coba lagi.',
    en: 'Failed to confirm receipt. Please try again.'
  },
  receiptPending: {
    id: '⏳ Resi Pending',
    en: '⏳ Receipt Pending'
  },
  receiptComplete: {
    id: '✓ Resi Selesai',
    en: '✓ Receipt Complete'
  },

  // Order Detail
  orderDetail: {
    id: 'Detail Pesanan',
    en: 'Order Detail'
  },
  transactionNotFound: {
    id: 'Transaksi tidak ditemukan',
    en: 'Transaction not found'
  },
  orderSummary: {
    id: 'Ringkasan Pesanan',
    en: 'Order Summary'
  },
  totalItems: {
    id: 'Total Item',
    en: 'Total Items'
  },
  receiptAmount: {
    id: 'Jumlah Resi',
    en: 'Receipt Amount'
  },
  enterReceiptAmount: {
    id: 'Masukkan jumlah resi (default: {defaultAmount})',
    en: 'Enter receipt amount (default: {defaultAmount})'
  },
  invalidAmount: {
    id: 'Jumlah tidak valid',
    en: 'Invalid amount'
  },
  ok: {
    id: 'OK',
    en: 'OK'
  },
  receiptSuccess: {
    id: 'Resi Berhasil Dikonfirmasi',
    en: 'Receipt Successfully Confirmed'
  },
  receiptSuccessMessage: {
    id: 'Resi telah berhasil dikonfirmasi dan disimpan dalam sistem.',
    en: 'Receipt has been successfully confirmed and saved in the system.'
  },
  viewHistory: {
    id: 'Lihat Riwayat',
    en: 'View History'
  },

  // Payment Screen
  paymentCode: {
    id: 'Kode Pembayaran',
    en: 'Payment Code'
  },
  paymentCodeDesc: {
    id: 'Silakan scan kode pembayaran dari kasir',
    en: 'Please scan the payment code from the cashier'
  },
  paymentCodeExpired: {
    id: 'Kode pembayaran sudah kadaluarsa',
    en: 'Payment code has expired'
  },
  paymentCodeInvalid: {
    id: 'Kode pembayaran tidak valid',
    en: 'Invalid payment code'
  },
  expand: {
    id: 'Perbesar',
    en: 'Expand'
  },
  termsAndConditions: {
    id: 'Syarat dan Ketentuan',
    en: 'Terms and Conditions'
  },
  termsAndConditionsLink: {
    id: 'Lihat Syarat dan Ketentuan',
    en: 'View Terms and Conditions'
  },
  help: {
    id: 'Bantuan',
    en: 'Help'
  },
  helpDesc: {
    id: 'Silakan hubungi kasir untuk bantuan',
    en: 'Please contact the cashier for help'
  },
  refreshing: {
    id: 'Memuat ulang...',
    en: 'Refreshing...'
  },
  refreshFailed: {
    id: 'Gagal memuat ulang',
    en: 'Failed to refresh'
  },
  enterPinToContinue: {
    id: 'Masukkan PIN untuk melanjutkan',
    en: 'Enter PIN to continue'
  },
  enterPinDescription: {
    id: 'Silakan masukkan PIN Anda untuk melanjutkan',
    en: 'Please enter your PIN to continue'
  },
  generatePaymentCode: {
    id: 'Generate Payment Code',
    en: 'Generate Payment Code'
  },
  generatePaymentCodeDesc: {
    id: 'Silakan klik tombol di bawah untuk menghasilkan kode pembayaran',
    en: 'Please click the button below to generate a payment code'
  },

  // Onboarding Screen
  outletBasicInfo: {
    id: 'Informasi Dasar Outlet',
    en: 'Outlet Basic Information'
  },
  outletBasicInfoDesc: {
    id: 'Silakan isi informasi dasar outlet Anda',
    en: 'Please fill in your outlet basic information'
  },
  outletName: {
    id: 'Nama Outlet',
    en: 'Outlet Name'
  },
  enterOutletName: {
    id: 'Masukkan nama outlet',
    en: 'Enter outlet name'
  },
  outletAddress: {
    id: 'Alamat Outlet',
    en: 'Outlet Address'
  },
  enterOutletAddress: {
    id: 'Masukkan alamat outlet',
    en: 'Enter outlet address'
  },
  outletCity: {
    id: 'Kota Outlet',
    en: 'Outlet City'
  },
  enterOutletCity: {
    id: 'Masukkan kota outlet',
    en: 'Enter outlet city'
  },
  outletProvince: {
    id: 'Provinsi Outlet',
    en: 'Outlet Province'
  },
  enterOutletProvince: {
    id: 'Masukkan provinsi outlet',
    en: 'Enter outlet province'
  },
  outletPostalCode: {
    id: 'Kode Pos Outlet',
    en: 'Outlet Postal Code'
  },
  enterOutletPostalCode: {
    id: 'Masukkan kode pos outlet',
    en: 'Enter outlet postal code'
  },
  outletLocation: {
    id: 'Lokasi Outlet',
    en: 'Outlet Location'
  },
  outletLocationDesc: {
    id: 'Silakan tentukan lokasi outlet Anda',
    en: 'Please determine your outlet location'
  },
  captureGPSLocation: {
    id: 'Ambil Lokasi GPS',
    en: 'Capture GPS Location'
  },
  tapToCaptureLocation: {
    id: 'Tap untuk mengambil lokasi',
    en: 'Tap to capture location'
  },
  latitude: {
    id: 'Latitude',
    en: 'Latitude'
  },
  longitude: {
    id: 'Longitude',
    en: 'Longitude'
  },
  outletPhotos: {
    id: 'Foto Outlet',
    en: 'Outlet Photos'
  },
  outletPhotosDesc: {
    id: 'Silakan upload foto-foto outlet yang diperlukan',
    en: 'Please upload the required outlet photos'
  },
  ktpPhoto: {
    id: 'Foto KTP',
    en: 'KTP Photo'
  },
  uploadKTPPhoto: {
    id: 'Upload Foto KTP',
    en: 'Upload KTP Photo'
  },
  outletOutsidePhotos: {
    id: 'Foto Luar Outlet',
    en: 'Outlet Outside Photos'
  },
  outletInsidePhotos: {
    id: 'Foto Dalam Outlet',
    en: 'Outlet Inside Photos'
  },
  outletInventoryPhotos: {
    id: 'Foto Inventaris Outlet',
    en: 'Outlet Inventory Photos'
  },
  photoUpload: {
    id: 'Upload Foto',
    en: 'Photo Upload'
  },
  photoUploadMessage: {
    id: 'Silakan pilih cara untuk mengambil foto',
    en: 'Please choose how to take the photo'
  },
  takePhoto: {
    id: 'Ambil Foto',
    en: 'Take Photo'
  },
  photoUploaded: {
    id: 'Foto Terupload',
    en: 'Photo Uploaded'
  },
  uploaded: {
    id: 'Terupload',
    en: 'Uploaded'
  },
  photo: {
    id: 'Foto',
    en: 'Photo'
  },
  locationCapture: {
    id: 'Ambil Lokasi GPS',
    en: 'Capture GPS Location'
  },
  locationCaptureMessage: {
    id: 'Silakan pilih cara untuk mengambil lokasi GPS',
    en: 'Please choose how to capture GPS location'
  },
  captureLocation: {
    id: 'Ambil Lokasi',
    en: 'Capture Location'
  },
  reviewOutletInfo: {
    id: 'Review Informasi Outlet',
    en: 'Review Outlet Information'
  },
  reviewOutletInfoDesc: {
    id: 'Silakan review informasi outlet yang telah diisi',
    en: 'Please review the filled outlet information'
  },
  basicInfo: {
    id: 'Informasi Dasar',
    en: 'Basic Information'
  },
  location: {
    id: 'Lokasi',
    en: 'Location'
  },
  photos: {
    id: 'Foto',
    en: 'Photos'
  },
  coordinates: {
    id: 'Koordinat',
    en: 'Coordinates'
  },
  notProvided: {
    id: 'Belum Diisi',
    en: 'Not Provided'
  },

  next: {
    id: 'Selanjutnya',
    en: 'Next'
  },
  submitOutlet: {
    id: 'Submit Outlet',
    en: 'Submit Outlet'
  },
  onboardingComplete: {
    id: 'Onboarding Selesai',
    en: 'Onboarding Complete'
  },
  onboardingCompleteMessage: {
    id: 'Outlet telah berhasil didaftarkan. Tim kami akan menghubungi Anda segera.',
    en: 'Outlet has been successfully registered. Our team will contact you soon.'
  },

  // Address Hierarchy
  selectProvince: {
    id: 'Pilih Provinsi',
    en: 'Select Province'
  },
  selectRegency: {
    id: 'Pilih Kabupaten/Kota',
    en: 'Select Regency/City'
  },
  selectDistrict: {
    id: 'Pilih Kecamatan',
    en: 'Select District'
  },
  selectVillage: {
    id: 'Pilih Desa/Kelurahan',
    en: 'Select Village/Sub-district'
  },
  province: {
    id: 'Provinsi',
    en: 'Province'
  },
  regency: {
    id: 'Kabupaten/Kota',
    en: 'Regency/City'
  },
  district: {
    id: 'Kecamatan',
    en: 'District'
  },
  village: {
    id: 'Desa/Kelurahan',
    en: 'Village/Sub-district'
  },
  streetAddress: {
    id: 'Alamat Jalan',
    en: 'Street Address'
  },
  enterStreetAddress: {
    id: 'Masukkan alamat jalan lengkap',
    en: 'Enter complete street address'
  },
  postalCode: {
    id: 'Kode Pos',
    en: 'Postal Code'
  },
  enterPostalCode: {
    id: 'Masukkan kode pos',
    en: 'Enter postal code'
  },
  addressDetails: {
    id: 'Detail Alamat',
    en: 'Address Details'
  },
  addressDetailsDesc: {
    id: 'Silakan pilih lokasi administratif outlet Anda',
    en: 'Please select your outlet administrative location'
  },

  // Search translations
  searchProvince: {
    id: 'Cari provinsi...',
    en: 'Search province...'
  },
  searchRegency: {
    id: 'Cari kabupaten/kota...',
    en: 'Search regency/city...'
  },
  searchDistrict: {
    id: 'Cari kecamatan...',
    en: 'Search district...'
  },
  searchVillage: {
    id: 'Cari desa/kelurahan...',
    en: 'Search village/sub-district...'
  },

  // Onboarding History
  noOnboardingRecords: {
    id: 'Belum ada riwayat onboarding',
    en: 'No onboarding records yet'
  },
} as const;

export type TranslationKey = keyof typeof translations; 