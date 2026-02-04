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
  { id: 'hepsi', labels: { tr: 'Tüm Menü', en: 'All Menu' }, icon: 'UtensilsCrossed' },
];

export const menuData: MenuItem[] = [];
