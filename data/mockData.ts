export interface Item {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  description: {
    id: string;
    en: string;
  };
  imageUrl?: string;
  imagePath?: string;
}

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Transaction {
  transaction_id: string;
  loan_id?: string;
  items: CartItem[];
  total: number;
  date: string;
  raw_date: string;
  transaction_date: string;
  description: string;
  has_good_receipt: boolean;
  good_receipt_total?: number;
}

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

// ========================================
// BALANCE DATA - Mock Credit Limit Data
// ========================================

export const mockBalanceData: BalanceData = {
  distributor_id: 'DIST-001',
  distributor_name: 'Main Distributor',
  outlet_id: 'OUT-001',
  outlet_Name: 'Sample Outlet',
  limit_type: 'Credit Limit',
  plafond_amount: 5000000,
  available_amount: 3250000,
  outstanding_amount: 1500000,
  hold_amount: 250000,
  lastUpdated: new Date().toISOString()
};

// ========================================
// ITEMS DATA - FMCG Products for Warung
// ========================================

export const mockItems: Item[] = [
  // Unilever Products
  {
    id: 'ULVR-001',
    sku: '8999999602390',
    name: 'Rinso Anti Noda + Molto Ultra Detergent Cair 800ml',
    brand: 'Unilever',
    price: 31500,
    description: {
      id: 'Deterjen cair dengan teknologi anti noda dan pelembut pakaian',
      en: 'Liquid detergent with anti-stain technology and fabric softener'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//99/MTA-2605769/rinso_rinso-anti-noda---molto-ultra-detergent-cair--800-ml-_full02.jpg'
  },
  {
    id: 'ULVR-002',
    sku: '8999999602391',
    name: 'Sunlight Jeruk Nipis 800ml',
    brand: 'Unilever',
    price: 12500,
    description: {
      id: 'Sabun cuci piring dengan ekstrak jeruk nipis untuk menghilangkan lemak',
      en: 'Dishwashing liquid with lime extract to remove grease'
    },
    imageUrl: 'https://down-id.img.susercontent.com/file/fed26be89cfd91e20eec5d83b33d327d'
  },
  {
    id: 'ULVR-003',
    sku: '8999999602392',
    name: 'Pepsodent Pasta Gigi 190g',
    brand: 'Unilever',
    price: 8500,
    description: {
      id: 'Pasta gigi dengan fluoride untuk perlindungan gigi yang kuat',
      en: 'Toothpaste with fluoride for strong teeth protection'
    },
    imageUrl: 'https://medias.watsons.co.id/publishing/WTCID-42487-side-zoom.jpg?version=1728572748'
  },
  {
    id: 'ULVR-004',
    sku: '8999999602393',
    name: 'Lux Soft Touch Sabun Batang 85g',
    brand: 'Unilever',
    price: 6500,
    description: {
      id: 'Sabun mandi dengan pelembab untuk kulit lembut dan halus',
      en: 'Bath soap with moisturizer for soft and smooth skin'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//92/MTA-3508642/lux_sabun-mandi-lux-85gr-soft-touch_full02.jpg'
  },
  {
    id: 'ULVR-005',
    sku: '8999999602394',
    name: 'Clear Men Shampoo 180ml',
    brand: 'Unilever',
    price: 22000,
    description: {
      id: 'Shampo anti ketombe khusus pria dengan sensasi dingin',
      en: 'Anti-dandruff shampoo for men with cooling sensation'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-2635564/clear_clear_men_complete_care_shampoo_-_membunuh_bakteri__-160_ml-_full26_k57yqgrb.jpeg'
  },
  {
    id: 'ULVR-006',
    sku: '8999999602395',
    name: 'Dove Beauty Bar 90g',
    brand: 'Unilever',
    price: 8500,
    description: {
      id: 'Sabun batang dengan 1/4 pelembab untuk kulit lembut',
      en: 'Bar soap with 1/4 moisturizer for soft skin'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/97/MTA-175735400/dove_dove_white_beauty_bar_90_g__full01_qxek5wn2.jpg'
  },

  // Wings Products
  {
    id: 'WING-001',
    sku: '8999999602396',
    name: 'So Klin Liquid 800ml',
    brand: 'Wings',
    price: 16500,
    description: {
      id: 'Deterjen cair dengan teknologi anti noda',
      en: 'Liquid detergent with anti-stain technology'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//99/MTA-2585178/so-klin_so-klin-liquid-softergent--800-ml-_full02.jpg'
  },
  {
    id: 'WING-002',
    sku: '8999999602397',
    name: 'Daia 800ml',
    brand: 'Wings',
    price: 14500,
    description: {
      id: 'Deterjen bubuk untuk pakaian putih',
      en: 'Powder detergent for white clothes'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/MTA-10784101/daia_daia_softener_deterjen_800_gr_full02_r39nlsmj.jpeg'
  },
  {
    id: 'WING-003',
    sku: '8999999602398',
    name: 'Attack 800ml',
    brand: 'Wings',
    price: 17500,
    description: {
      id: 'Deterjen cair dengan teknologi anti bakteri',
      en: 'Liquid detergent with anti-bacterial technology'
    },
    imageUrl: 'https://arti-assets.sgp1.cdn.digitaloceanspaces.com/renyswalayanku/products/db86895a-536f-4419-8030-1b8df494b8bd.jpg'
  },

  // Indofood Products
  {
    id: 'INDF-001',
    sku: '8999999602399',
    name: 'Indomie Goreng 85g',
    brand: 'Indofood',
    price: 3500,
    description: {
      id: 'Mie instan goreng spesial',
      en: 'Special fried instant noodles'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//95/MTA-50175066/indomie_indomie_goreng_85g_-_mi_instan_mi_goreng_-_mie_instan_mie_goreng_-_indomie_full01_239f318a.jpg'
  },
  {
    id: 'INDF-002',
    sku: '8999999602400',
    name: 'Indomie Kuah 85g',
    brand: 'Indofood',
    price: 3000,
    description: {
      id: 'Mie instan kuah kaldu ayam',
      en: 'Chicken broth instant noodles'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/112/MTA-98591944/indomie_indomie-soto-mie-85g_full01.jpg'
  },
  {
    id: 'INDF-003',
    sku: '8999999602401',
    name: 'Bumbu Nasi Goreng 250g',
    brand: 'Indofood',
    price: 8500,
    description: {
      id: 'Bumbu nasi goreng praktis',
      en: 'Practical fried rice seasoning'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/105/MTA-180585446/kokita_bumbu_nasi_goreng_kokita_200_full01_epzhfpt5.jpg'
  },

  // Mayora Products
  {
    id: 'MAYO-001',
    sku: '8999999602402',
    name: 'Kopiko 78C 12s',
    brand: 'Mayora',
    price: 12000,
    description: {
      id: 'Permen kopi dengan kafein',
      en: 'Coffee candy with caffeine'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/99/MTA-180574154/kopiko_kopiko78__240_ml_-_1_dus_isi_12_full01_dhl3q6ck.jpg'
  },
  {
    id: 'MAYO-002',
    sku: '8999999602403',
    name: 'Danisa 200g',
    brand: 'Mayora',
    price: 25000,
    description: {
      id: 'Biskuit butter cookies premium',
      en: 'Premium butter cookies'
    },
    imageUrl: 'https://assets.tops.co.th/DANISA-DanisaButterCookies200g-8996001303764-1'
  },
  {
    id: 'MAYO-003',
    sku: '8999999602404',
    name: 'Beng-Beng 30g',
    brand: 'Mayora',
    price: 2500,
    description: {
      id: 'Wafer cokelat dengan karamel',
      en: 'Chocolate wafer with caramel'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/102/MTA-157419219/beng-beng_drink-beng-beng-choco-4-s-x-30g_full01.jpg'
  },

  // Garuda Food Products
  {
    id: 'GRDA-001',
    sku: '8999999602405',
    name: 'Kacang Atom 200g',
    brand: 'Garuda Food',
    price: 15000,
    description: {
      id: 'Kacang atom pedas renyah',
      en: 'Crispy spicy peanuts'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-44213580/garuda_food_garuda_food_-_kacang_atom_klasik_full03_qlaww9me.jpg'
  },
  {
    id: 'GRDA-002',
    sku: '8999999602406',
    name: 'Kacang Garuda 200g',
    brand: 'Garuda Food',
    price: 18000,
    description: {
      id: 'Kacang tanah panggang asin',
      en: 'Salted roasted peanuts'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//96/MTA-51617157/garuda_garuda-kacang-garing-pck-200g_full01.jpg'
  },

  // Coca-Cola Products
  {
    id: 'COCA-001',
    sku: '8999999602407',
    name: 'Coca-Cola 330ml',
    brand: 'Coca-Cola',
    price: 6000,
    description: {
      id: 'Minuman berkarbonasi cola',
      en: 'Carbonated cola drink'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/MTA-17125427/coca_cola_coca_cola_minuman_bersoda_-330_ml_x_24_kaleng-_full01_p0e2xemy.jpg'
  },
  {
    id: 'SPRITE-001',
    sku: '8999999602408',
    name: 'Sprite 330ml',
    brand: 'Coca-Cola',
    price: 5500,
    description: {
      id: 'Minuman berkarbonasi lemon-lime',
      en: 'Lemon-lime carbonated drink'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/105/MTA-93393546/sprite_sprite-minuman-bersoda-330-ml_full01.jpg'
  },
  {
    id: 'FANTA-001',
    sku: '8999999602409',
    name: 'Fanta 330ml',
    brand: 'Coca-Cola',
    price: 5500,
    description: {
      id: 'Minuman berkarbonasi jeruk',
      en: 'Orange carbonated drink'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//85/MTA-7113207/fanta_fanta_strawberry_can_minuman_ringan_-330_ml-24_pcs-_full03_rieq027z.jpg'
  },
  // Aqua Products
  {
    id: 'AQUA-001',
    sku: '8999999602410',
    name: 'Aqua 600ml',
    brand: 'Danone',
    price: 3000,
    description: {
      id: 'Air mineral kemasan',
      en: 'Packaged mineral water'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//105/MTA-10881878/aqua_aqua-air-mineral-btl-600-ml_full01.jpg'
  },
  {
    id: 'AQUA-002',
    sku: '8999999602411',
    name: 'Aqua 1500ml',
    brand: 'Danone',
    price: 5000,
    description: {
      id: 'Air mineral kemasan besar',
      en: 'Large packaged mineral water'
    },
    imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//90/MTA-3325716/aqua_air-mineral-aqua-1500-ml-botol_full02.jpg'
  }
];

// ========================================
// HISTORY DATA - Transaction Records
// ========================================

export const mockTransactions: Transaction[] = [
  {
    transaction_id: 'TXN-2024-001',
    loan_id: '253115',
    items: [
      { id: 'ULVR-001', sku: '8999999602390', name: 'Rinso Anti Noda + Molto Ultra Detergent Cair 800ml', brand: 'Unilever', price: 31500, quantity: 2 },
      { id: 'INDF-001', sku: '8999999602399', name: 'Indomie Goreng 85g', brand: 'Indofood', price: 3500, quantity: 5 }
    ],
    total: 52000,
    date: '2024-01-15T10:30:00Z',
    raw_date: '2024/01/15',
    transaction_date: '2024/01/15',
    description: 'Submit new order',
    has_good_receipt: true,
    good_receipt_total: 52000
  },
  {
    transaction_id: 'TXN-2024-002',
    loan_id: '253116',
    items: [
      { id: 'WING-001', sku: '8999999602396', name: 'So Klin Liquid 800ml', brand: 'Wings', price: 16500, quantity: 1 },
      { id: 'COCA-001', sku: '8999999602407', name: 'Coca-Cola 330ml', brand: 'Coca-Cola', price: 6000, quantity: 3 },
      { id: 'MAYO-001', sku: '8999999602402', name: 'Kopiko 78C 12s', brand: 'Mayora', price: 12000, quantity: 1 }
    ],
    total: 43500,
    date: '2024-01-14T18:45:00Z',
    raw_date: '2024/01/14',
    transaction_date: '2024/01/14',
    description: 'Submit new order',
    has_good_receipt: false
  },
  {
    transaction_id: 'TXN-2024-003',
    loan_id: '253117',
    items: [
      { id: 'ULVR-003', sku: '8999999602392', name: 'Pepsodent Pasta Gigi 190g', brand: 'Unilever', price: 8500, quantity: 2 },
      { id: 'AQUA-002', sku: '8999999602411', name: 'Aqua 1500ml', brand: 'Danone', price: 5000, quantity: 2 },
      { id: 'GRDA-001', sku: '8999999602405', name: 'Kacang Atom 200g', brand: 'Garuda Food', price: 15000, quantity: 1 }
    ],
    total: 43000,
    date: '2024-01-13T12:15:00Z',
    raw_date: '2024/01/13',
    transaction_date: '2024/01/13',
    description: 'Submit new order',
    has_good_receipt: true,
    good_receipt_total: 43000
  }
]; 