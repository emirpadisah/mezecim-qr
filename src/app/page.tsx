'use client';

import { useState, useMemo, useEffect } from 'react';
import { menuData, categories, MenuItem, Category } from '@/data/menu';
import { useLanguage } from '@/components/LanguageProvider';
import { t } from '@/i18n/translations';
import { fetchMenuItems, fetchCategories, subscribeMenuUpdates } from '@/lib/menuApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Flame,
  Salad,
  Coffee,
  Search,
  ShoppingBag,
  Info,
  X,
  Plus,
  LucideIcon,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Flame,
  Salad,
  Coffee,
  UtensilsCrossed
};

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('hepsi');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [items, setItems] = useState<MenuItem[]>(menuData);
  const [menuCategories, setMenuCategories] = useState<Category[]>(categories);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedItem]);

  useEffect(() => {
    fetchMenuItems(menuData).then(setItems);
    fetchCategories(categories).then(setMenuCategories);
    return subscribeMenuUpdates(() => {
      fetchMenuItems(menuData).then(setItems);
      fetchCategories(categories).then(setMenuCategories);
    });
  }, []);

  const categoryLabel = (id: string) =>
    menuCategories.find((cat) => cat.id === id)?.labels[language] ?? id;

  const normalizeCategoryId = (value: string) => {
    const direct = menuCategories.find((cat) => cat.id === value);
    if (direct) return direct.id;
    const byLabel = menuCategories.find(
      (cat) => cat.labels.tr === value || cat.labels.en === value
    );
    return byLabel?.id ?? value;
  };

  const filteredMenu = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return items.filter((item) => {
      const categoryId = normalizeCategoryId(item.category);
      return (
        (selectedCategory === 'hepsi' || categoryId === selectedCategory) &&
        (item.name[language].toLowerCase().includes(q) ||
          item.description[language].toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchTerm, language, items, menuCategories]);


  return (
    <main className="min-h-screen bg-cream selection:bg-accent/30 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-28 w-full overflow-x-hidden">
        {/* HERO */}
        <header className="pt-6 sm:pt-10 pb-5 sm:pb-6">
          <div className="relative overflow-hidden rounded-4xl sm:rounded-[2.5rem] bg-primary text-white">
            <div className="absolute inset-0">
              <Image
                src="/images/ERN03480-HDR.jpg"
                alt="Mezecim"
                fill
                className="object-cover opacity-45"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
            </div>
            <div className="relative z-10 p-5 sm:p-10">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white/70">
                <Sparkles size={14} className="text-accent" />
                {t(language, 'brandName')}
              </div>
              <h1 className="mt-2 text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight">
                {t(language, 'menuTitle')}
              </h1>
              <p className="mt-2 sm:mt-3 max-w-xl text-white/75 text-xs sm:text-base leading-relaxed">
                {t(language, 'menuSubtitle')}
              </p>
            </div>
          </div>
        </header>

        {/* NAVBAR */}
        <div className="sticky top-2 sm:top-0 z-40">
          <div className="glass-effect rounded-[1.4rem] sm:rounded-[1.8rem] px-2 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                    <Image src="/images/logo.jpg" alt="Mezecim Logo" width={28} height={28} />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-primary/40">
                      {t(language, 'brandName')}
                    </div>
                    <div className="text-sm sm:text-base font-black text-primary">
                      {t(language, 'brandSubtitle')}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary/40">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    {t(language, 'openNow')}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-primary/40">
                    {t(language, 'language')}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setLanguage('tr')}
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${
                          language === 'tr'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-primary/60 border-gray-200'
                        }`}
                      >
                        TR
                      </button>
                      <button
                        onClick={() => setLanguage('en')}
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${
                          language === 'en'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-primary/60 border-gray-200'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t(language, 'searchPlaceholder')}
                  className="w-full bg-white rounded-2xl py-3 pl-11 pr-4 text-sm sm:text-base outline-none border border-black/5 focus:border-accent/40 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 sm:hidden">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/40">
                  {t(language, 'language')}
                </span>
                <button
                  onClick={() => setLanguage('tr')}
                  className={`px-2 py-1 rounded-full border text-[10px] font-black ${
                    language === 'tr'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-primary/60 border-gray-200'
                  }`}
                >
                  TR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-full border text-[10px] font-black ${
                    language === 'en'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-primary/60 border-gray-200'
                  }`}
                >
                  EN
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pb-1">
                {menuCategories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Info;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full whitespace-nowrap text-[10px] sm:text-xs font-black uppercase tracking-widest border transition ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow'
                          : 'bg-white text-gray-600 border-gray-100 hover:text-primary'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-accent' : ''} />
                      {cat.labels[language]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <section className="mt-5 sm:mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredMenu.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={() => setSelectedItem(item)}
                  className="group bg-white rounded-[1.4rem] sm:rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition cursor-pointer"
                >
                  <div className="relative h-40 sm:h-44">
                    <Image
                      src={item.image}
                      alt={item.name[language]}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.isPopular && (
                      <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {t(language, 'popular')}
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-black text-[15px] sm:text-base text-primary leading-tight">
                        {item.name[language]}
                      </h3>
                      <span className="font-black text-accent">{item.price}₺</span>
                    </div>
                    <p className="mt-2 text-[11px] sm:text-xs text-gray-500 line-clamp-2">
                      {item.description[language]}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                        {t(language, 'details')}
                      </span>
                      <Plus size={16} className="text-primary/60" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 modal-blur"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="relative w-full max-w-4xl bg-white sm:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row h-full sm:h-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-10 w-14 h-14 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all"
              >
                <X size={28} />
              </button>

              <div className="relative w-full lg:w-1/2 h-72 lg:h-[520px]">
                <Image 
                  src={selectedItem.image}
                  alt={selectedItem.name[language]}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-[10px] font-black rounded-full mb-4 uppercase tracking-[0.2em]">
                  {categoryLabel(selectedItem.category)}
                </span>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-3xl lg:text-4xl font-serif font-black text-primary leading-none">
                    {selectedItem.name[language]}
                  </h2>
                  <span className="text-2xl font-black text-primary">{selectedItem.price}₺</span>
                </div>
                
                <p className="text-gray-500 text-sm lg:text-base leading-relaxed mb-8">
                  {selectedItem.description[language]}
                </p>

                <div className="flex gap-4">
                  <button className="flex-1 bg-primary text-white h-14 rounded-[1.6rem] font-black text-xs uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all">
                    {t(language, 'details')}
                  </button>
                  <button className="w-14 h-14 border-2 border-gray-100 rounded-[1.6rem] flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/20 transition-all">
                    <ShoppingBag size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
