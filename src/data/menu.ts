export interface LocalizedText {
  tr: string;
  en: string;
}

export interface MenuItem {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  labels: LocalizedText;
  icon: string;
}

export const categories: Category[] = [
  { id: 'meze', labels: { tr: 'Mezeler', en: 'Mezes' }, icon: 'Leaf' },
  { id: 'zeytinyagli', labels: { tr: 'Zeytinyağlılar', en: 'Olive Oil' }, icon: 'Leaf' },
  { id: 'salata', labels: { tr: 'Salatalar', en: 'Salads' }, icon: 'Salad' },
  { id: 'tursu', labels: { tr: 'Turşular', en: 'Pickles' }, icon: 'Flame' },
  { id: 'tatli', labels: { tr: 'Tatlılar', en: 'Desserts' }, icon: 'Coffee' },
  { id: 'hepsi', labels: { tr: 'Tüm Menü', en: 'All Menu' }, icon: 'UtensilsCrossed' },
];

export const menuData: MenuItem[] = [
  {
    id: '1',
    name: { tr: 'Haydari', en: 'Haydari' },
    description: {
      tr: 'Süzme yoğurt, taze dereotu, nane ve sarımsaklı özel sızma zeytinyağı ile.',
      en: 'Thick yogurt with fresh dill, mint, garlic, and extra virgin olive oil.',
    },
    price: 85,
    category: 'meze',
    image: '/images/ERN03369-HDR.jpg',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: '2',
    name: { tr: 'Atom', en: 'Atom' },
    description: {
      tr: 'Süzme yoğurt üzerinde tereyağında kızdırılmış kuru Arnavut biberi ve pul biber.',
      en: 'Thick yogurt topped with butter-fried dried peppers and chili flakes.',
    },
    price: 95,
    category: 'meze',
    image: '/images/ERN03378-HDR.jpg',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: '3',
    name: { tr: 'Köpoğlu', en: 'Köpoğlu' },
    description: {
      tr: 'Közlenmiş patlıcan, biber ve domates soslu, sarımsaklı yoğurt yatağında.',
      en: 'Roasted eggplant and peppers with tomato sauce on garlic yogurt.',
    },
    price: 90,
    category: 'meze',
    image: '/images/ERN03411-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '4',
    name: { tr: 'Humus', en: 'Hummus' },
    description: {
      tr: 'Nohut, tahin, limon suyu ve sarımsağın muazzam uyumu, üzerinde kızdırılmış tereyağı ile.',
      en: 'Chickpeas, tahini, lemon juice, and garlic topped with warm butter.',
    },
    price: 95,
    category: 'meze',
    image: '/images/ERN03444-HDR.jpg',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: '5',
    name: { tr: 'Çiğ Köfte', en: 'Çiğ Köfte' },
    description: {
      tr: 'Özel baharatlarla yoğurulmuş, taze yeşillik ve limon eşliğinde sunulan geleneksel lezzet.',
      en: 'Spiced bulgur patties served with fresh greens and lemon.',
    },
    price: 110,
    category: 'meze',
    image: '/images/ERN03504-HDR.jpg',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: '6',
    name: { tr: 'Zeytinyağlı Yaprak Sarma', en: 'Stuffed Vine Leaves' },
    description: {
      tr: 'İncecik asma yaprağına sarılı, bol baharatlı ve kuş üzümlü iç pilav ile.',
      en: 'Delicate vine leaves stuffed with herbed rice and currants.',
    },
    price: 120,
    category: 'zeytinyagli',
    image: '/images/ERN03354-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '7',
    name: { tr: 'Zeytinyağlı Enginar', en: 'Artichoke in Olive Oil' },
    description: {
      tr: 'Taze enginar çanaklarında garnitürlü ve bol zeytinyağlı hafif lezzet.',
      en: 'Fresh artichokes with garnish in extra virgin olive oil.',
    },
    price: 130,
    category: 'zeytinyagli',
    image: '/images/ERN03344-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '8',
    name: { tr: 'Zeytinyağlı Biber Dolma', en: 'Stuffed Peppers' },
    description: {
      tr: 'Renkli dolmalık biberler içinde baharatlı özel iç pilavı ile.',
      en: 'Colorful peppers stuffed with spiced rice.',
    },
    price: 115,
    category: 'zeytinyagli',
    image: '/images/ERN03465-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '9',
    name: { tr: 'Deniz Börülcesi', en: 'Sea Beans' },
    description: {
      tr: 'Sarımsaklı ve limonlu zeytinyağı sosu ile taptaze deniz börülcesi.',
      en: 'Fresh sea beans with garlic and lemon olive oil dressing.',
    },
    price: 105,
    category: 'salata',
    image: '/images/ERN03399-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '10',
    name: { tr: 'Börülce Salatası', en: 'Black-Eyed Peas Salad' },
    description: {
      tr: 'Kuru börülce, taze soğan, maydanoz ve kırmızı biberli iştah açıcı salata.',
      en: 'Black-eyed peas with spring onion, parsley, and red pepper.',
    },
    price: 95,
    category: 'salata',
    image: '/images/ERN03432-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '11',
    name: { tr: 'Rus Salatası', en: 'Russian Salad' },
    description: {
      tr: 'Haşlanmış garnitürler, kornişon turşu ve özel mayonezli sosu ile.',
      en: 'Boiled vegetables with pickles and creamy mayo dressing.',
    },
    price: 90,
    category: 'meze',
    image: '/images/ERN03387-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '12',
    name: { tr: 'Közlenmiş Kırmızı Biber', en: 'Roasted Red Pepper' },
    description: {
      tr: 'Odun ateşinde közlenmiş, sarımsaklı ve sirkeli özel soslu kapya biber.',
      en: 'Wood-roasted red peppers with garlic and vinegar dressing.',
    },
    price: 85,
    category: 'meze',
    image: '/images/ERN03423-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '13',
    name: { tr: 'Kırmızı Lahana Turşusu', en: 'Red Cabbage Pickles' },
    description: {
      tr: 'Kıtır kıtır kırmızı lahana, Mezecim özel tarifi ile fermente edilmiş.',
      en: 'Crisp red cabbage pickled with Mezecim’s signature recipe.',
    },
    price: 70,
    category: 'tursu',
    image: '/images/ERN03492-HDR.jpg',
    isAvailable: true,
  },
  {
    id: '14',
    name: { tr: 'Ev Yapımı Tatlı', en: 'Homemade Dessert' },
    description: {
      tr: 'Günün taze hazırlanan şerbetli veya sütlü tatlısı.',
      en: 'Daily homemade dessert, syrupy or milk-based.',
    },
    price: 95,
    category: 'tatli',
    image: '/images/ERN03348-HDR.jpg',
    isAvailable: true,
  },
];
