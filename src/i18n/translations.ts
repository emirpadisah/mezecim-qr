export type Language = 'tr' | 'en';

export type TranslationKey =
  | 'brandName'
  | 'brandSubtitle'
  | 'menuTitle'
  | 'menuSubtitle'
  | 'openNow'
  | 'hours'
  | 'table'
  | 'searchPlaceholder'
  | 'searchHint'
  | 'categoriesAll'
  | 'details'
  | 'popular'
  | 'addToOrder'
  | 'callWaiter'
  | 'language'
  | 'cart'
  | 'cartEmpty'
  | 'notePlaceholder'
  | 'placeOrder'
  | 'orderSent'
  | 'quantity'
  | 'total';

const translations: Record<Language, Record<TranslationKey, string>> = {
  tr: {
    brandName: 'Mezecim',
    brandSubtitle: 'Gurme Meze Evi',
    menuTitle: 'Meze Menüsü',
    menuSubtitle:
      'Taze hazırlanmış mezeler, zeytinyağlılar ve özel lezzetlerle modern bir sofra deneyimi.',
    openNow: 'Açık',
    hours: '09:00 - 22:00',
    table: 'Masa',
    searchPlaceholder: 'Menüde ara...',
    searchHint: 'Hızlı Ara',
    categoriesAll: 'Tüm Menü',
    details: 'Detaylar',
    popular: 'Popüler',
    addToOrder: 'Siparişe Ekle',
    callWaiter: 'Garson Çağır',
    language: 'Dil',
    cart: 'Sepet',
    cartEmpty: 'Sepetiniz boş.',
    notePlaceholder: 'Not ekleyin (isteğe bağlı)',
    placeOrder: 'Siparişi Gönder',
    orderSent: 'Sipariş gönderildi',
    quantity: 'Adet',
    total: 'Toplam',
  },
  en: {
    brandName: 'Mezecim',
    brandSubtitle: 'Gourmet Meze House',
    menuTitle: 'Meze Menu',
    menuSubtitle:
      'Freshly prepared mezes, olive oil dishes, and signature flavors for a modern table.',
    openNow: 'Open',
    hours: '09:00 - 22:00',
    table: 'Table',
    searchPlaceholder: 'Search the menu...',
    searchHint: 'Quick Search',
    categoriesAll: 'All Menu',
    details: 'Details',
    popular: 'Popular',
    addToOrder: 'Add to Order',
    callWaiter: 'Call Waiter',
    language: 'Language',
    cart: 'Cart',
    cartEmpty: 'Your cart is empty.',
    notePlaceholder: 'Add a note (optional)',
    placeOrder: 'Place Order',
    orderSent: 'Order placed',
    quantity: 'Qty',
    total: 'Total',
  },
};

export function t(lang: Language, key: TranslationKey) {
  return translations[lang][key];
}
export type Locale = 'tr' | 'en';

export const locales: Locale[] = ['tr', 'en'];

export const ui = {
  tr: {
    heroTag: 'Mezecim Gurme',
    heroTitle: 'Meze Menüsü',
    heroDescription:
      'Taze hazırlanmış mezeler, zeytinyağlılar ve özel lezzetlerle modern bir sofra deneyimi.',
    openLabel: 'Açık',
    hoursLabel: '09:00 - 22:00',
    tableLabel: 'Masa A-12',
    navTitle: 'Dijital Menü',
    searchPlaceholder: 'Menüde ara...',
    detailsLabel: 'Detaylar',
    popularLabel: 'Popüler',
    addToOrder: 'Siparişe Ekle',
  },
  en: {
    heroTag: 'Mezecim Gourmet',
    heroTitle: 'Meze Menu',
    heroDescription:
      'Freshly prepared appetizers, olive oil dishes, and signature flavors for a modern table.',
    openLabel: 'Open',
    hoursLabel: '09:00 - 22:00',
    tableLabel: 'Table A-12',
    navTitle: 'Digital Menu',
    searchPlaceholder: 'Search the menu...',
    detailsLabel: 'Details',
    popularLabel: 'Popular',
    addToOrder: 'Add to Order',
  },
};

export const categoryLabels: Record<Locale, Record<string, string>> = {
  tr: {
    meze: 'Mezeler',
    zeytinyagli: 'Zeytinyağlılar',
    salata: 'Salatalar',
    tursu: 'Turşular',
    tatli: 'Tatlılar',
    hepsi: 'Tüm Menü',
  },
  en: {
    meze: 'Appetizers',
    zeytinyagli: 'Olive Oil Dishes',
    salata: 'Salads',
    tursu: 'Pickles',
    tatli: 'Desserts',
    hepsi: 'All Menu',
  },
};

export const itemTranslations: Partial<
  Record<Locale, Record<string, { name: string; description: string }>>
> = {
  en: {
    '1': {
      name: 'Haydari',
      description: 'Strained yogurt with dill, mint, garlic, and olive oil.',
    },
    '2': {
      name: 'Atom',
      description: 'Strained yogurt topped with sizzling butter and dried red peppers.',
    },
    '3': {
      name: 'Köpoğlu',
      description: 'Roasted eggplant, peppers, and tomato on garlic yogurt.',
    },
    '4': {
      name: 'Hummus',
      description: 'Chickpeas with tahini and lemon, finished with browned butter.',
    },
    '5': {
      name: 'Çiğ Köfte',
      description: 'Spiced bulgur and pepper paste served with greens and lemon.',
    },
    '6': {
      name: 'Stuffed Vine Leaves',
      description: 'Vine leaves filled with herbed rice and currants in olive oil.',
    },
    '7': {
      name: 'Olive Oil Artichoke',
      description: 'Tender artichoke hearts with vegetables and olive oil.',
    },
    '8': {
      name: 'Stuffed Peppers',
      description: 'Bell peppers stuffed with spiced rice and herbs.',
    },
    '9': {
      name: 'Sea Samphire',
      description: 'Fresh samphire with garlic and lemon olive oil.',
    },
    '10': {
      name: 'Black-Eyed Pea Salad',
      description: 'Black-eyed peas with onion, parsley, and red pepper.',
    },
    '11': {
      name: 'Russian Salad',
      description: 'Vegetable salad with pickles and creamy mayonnaise.',
    },
    '12': {
      name: 'Roasted Red Pepper',
      description: 'Wood-roasted capia pepper with garlic and vinegar.',
    },
    '13': {
      name: 'Red Cabbage Pickle',
      description: 'Crunchy, tangy fermented red cabbage.',
    },
    '14': {
      name: 'Homemade Dessert',
      description: 'Daily handmade syrup or milk-based dessert.',
    },
  },
};
