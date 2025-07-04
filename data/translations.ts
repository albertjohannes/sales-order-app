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
} as const;

export type TranslationKey = keyof typeof translations; 