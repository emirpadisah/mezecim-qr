'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { categories, menuData, MenuItem, Category } from '@/data/menu';
import {
  fetchMenuItems,
  saveMenuItem,
  deleteMenuItem,
  fetchCategories,
  saveCategory,
  deleteCategory,
} from '@/lib/menuApi';
import { useLanguage } from '@/components/LanguageProvider';
import { t } from '@/i18n/translations';

const emptyItem = (): MenuItem => ({
  id: '',
  name: { tr: '', en: '' },
  description: { tr: '', en: '' },
  price: 0,
  image: '',
  category: 'meze',
  isAvailable: true,
  isPopular: false,
});

export default function AdminPage() {
  const { language, setLanguage } = useLanguage();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [draft, setDraft] = useState<MenuItem>(emptyItem());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tab, setTab] = useState<'list' | 'create' | 'categories'>('list');
  const [menuCategories, setMenuCategories] = useState<Category[]>(categories);
  const [categoryDraft, setCategoryDraft] = useState<Category>({
    id: '',
    labels: { tr: '', en: '' },
    icon: 'Leaf',
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchMenuItems(menuData).then(setItems);
    fetchCategories(categories).then(setMenuCategories);
  }, []);

  const categoryLabel = (id: string) =>
    menuCategories.find((cat) => cat.id === id)?.labels[language] ?? id;

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name[language].localeCompare(b.name[language])),
    [items, language]
  );

  const sortedCategories = useMemo(
    () => [...menuCategories].filter((c) => c.id !== 'hepsi'),
    [menuCategories]
  );

  const startEdit = (item: MenuItem) => {
    setDraft(item);
    setEditingId(item.id);
    setImagePreview(item.image || '');
    setPriceInput(item.price ? String(item.price) : '');
    setTab('create');
  };

  const clearDraft = () => {
    setDraft(emptyItem());
    setEditingId(null);
    setImagePreview('');
    setPriceInput('');
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setDraft((prev) => ({ ...prev, image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleSave = async () => {
    if (!draft.name.tr || !draft.name.en) return;
    if (!draft.image) return;
    if (!priceInput) return;
    const price = Number(priceInput.replace(',', '.'));
    if (Number.isNaN(price)) return;
    const payload = editingId
      ? { ...draft, price }
      : { ...draft, price, id: '' };
    const result = await saveMenuItem(payload);
    if (result?.ok === false) {
      setErrorMessage('Kayıt hatası.');
      return;
    }
    const refreshed = await fetchMenuItems(menuData);
    setItems(refreshed);
    clearDraft();
  };

  const handleDelete = async (id: string) => {
    const result = await deleteMenuItem(id);
    if (result?.ok === false) {
      setErrorMessage('Silme hatası.');
      return;
    }
    const refreshed = await fetchMenuItems(menuData);
    setItems(refreshed);
  };

  const handleReset = () => {
    setItems(menuData);
    clearDraft();
  };

  const startEditCategory = (cat: Category) => {
    setCategoryDraft(cat);
    setEditingCategoryId(cat.id);
    setTab('categories');
  };

  const clearCategoryDraft = () => {
    setCategoryDraft({ id: '', labels: { tr: '', en: '' }, icon: 'Leaf' });
    setEditingCategoryId(null);
  };

  const handleSaveCategory = async () => {
    if (!categoryDraft.id || !categoryDraft.labels.tr || !categoryDraft.labels.en) return;
    const result = await saveCategory(categoryDraft);
    if (result?.ok === false) {
      setErrorMessage('Kategori kayıt hatası.');
      return;
    }
    const refreshed = await fetchCategories(categories);
    setMenuCategories(refreshed);
    clearCategoryDraft();
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await deleteCategory(id);
    if (result?.ok === false) {
      setErrorMessage('Kategori silme hatası.');
      return;
    }
    const refreshed = await fetchCategories(categories);
    setMenuCategories(refreshed);
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary">Admin Paneli</h1>
            <p className="text-sm text-gray-500">
              Menü içeriklerini düzenle, fiyatları güncelle ve ürün ekle.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary/50">
            {t(language, 'language')}
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 rounded-full border ${
                language === 'tr' ? 'bg-primary text-white border-primary' : 'bg-white'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full border ${
                language === 'en' ? 'bg-primary text-white border-primary' : 'bg-white'
              }`}
            >
              EN
            </button>
          </div>
        </header>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl px-4 py-3">
            {errorMessage}
          </div>
        )}

        <section className="bg-white rounded-[2rem] p-4 border border-gray-100 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest">
          <button
            onClick={() => setTab('list')}
            className={`px-4 py-2 rounded-full border ${
              tab === 'list'
                ? 'bg-primary text-white border-primary'
                : 'bg-white border-gray-200 text-primary/60'
            }`}
          >
            Satıştaki Ürünler
          </button>
          <button
            onClick={() => {
              clearDraft();
              setTab('create');
            }}
            className={`px-4 py-2 rounded-full border ${
              tab === 'create'
                ? 'bg-primary text-white border-primary'
                : 'bg-white border-gray-200 text-primary/60'
            }`}
          >
            Yeni Ürün Ekle
          </button>
          <button
            onClick={() => {
              clearCategoryDraft();
              setTab('categories');
            }}
            className={`px-4 py-2 rounded-full border ${
              tab === 'categories'
                ? 'bg-primary text-white border-primary'
                : 'bg-white border-gray-200 text-primary/60'
            }`}
          >
            Kategoriler
          </button>
        </section>

        {tab === 'create' && (
          <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-primary">
                {editingId ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <div className="flex items-center gap-2">
                {editingId && (
                  <button
                    onClick={clearDraft}
                    className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-gray-200"
                  >
                    İptal
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-gray-200"
                >
                  Varsayılanlara Dön
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                    Ürün Adı (TR)
                  </label>
                  <input
                    value={draft.name.tr}
                    onChange={(e) =>
                      setDraft({ ...draft, name: { ...draft.name, tr: e.target.value } })
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                    Ürün Adı (EN)
                  </label>
                  <input
                    value={draft.name.en}
                    onChange={(e) =>
                      setDraft({ ...draft, name: { ...draft.name, en: e.target.value } })
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                  />
                </div>
              <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                    Görsel Yolu veya Yükleme
                  </label>
                  <input
                    value={draft.image}
                    onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                    placeholder="/images/xxx.jpg"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="mt-3 w-full text-xs"
                  />
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`mt-4 rounded-2xl border-2 border-dashed px-4 py-6 text-center text-xs font-black uppercase tracking-widest ${
                    isDragging
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-primary/40'
                  }`}
                >
                  Görseli buraya sürükleyip bırak
                </div>
                  {imagePreview && (
                    <div className="mt-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">
                        Önizleme
                      </div>
                      <Image
                        src={imagePreview}
                        alt="Önizleme"
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-2xl object-cover border border-gray-100"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                    Açıklama (TR)
                  </label>
                  <textarea
                    value={draft.description.tr}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        description: { ...draft.description, tr: e.target.value },
                      })
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm min-h-[90px]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                    Açıklama (EN)
                  </label>
                  <textarea
                    value={draft.description.en}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        description: { ...draft.description, en: e.target.value },
                      })
                    }
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm min-h-[90px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                      Fiyat (₺)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                      Kategori
                    </label>
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                    >
                      {menuCategories
                        .filter((cat) => cat.id !== 'hepsi')
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.labels[language]}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={draft.isAvailable}
                      onChange={(e) => setDraft({ ...draft, isAvailable: e.target.checked })}
                    />
                    Stokta
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={draft.isPopular}
                      onChange={(e) => setDraft({ ...draft, isPopular: e.target.checked })}
                    />
                    Popüler
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-full bg-primary text-white font-black text-xs uppercase tracking-[0.3em]"
              >
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </section>
        )}

        {tab === 'list' && (
          <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-primary mb-4">Ürün Listesi</h2>
            <div className="space-y-3">
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 rounded-2xl p-4"
                >
                  <div>
                    <div className="font-black text-primary">{item.name[language]}</div>
                    <div className="text-xs text-gray-500">
                      {categoryLabel(item.category)} · {item.price}₺
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-gray-200"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-red-200 text-red-600"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'categories' && (
          <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-primary">Kategori Yönetimi</h2>
              {editingCategoryId && (
                <button
                  onClick={clearCategoryDraft}
                  className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-gray-200"
                >
                  İptal
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                  Kategori ID
                </label>
                <input
                  value={categoryDraft.id}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, id: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                  placeholder="ornek: sicak"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                  Ad (TR)
                </label>
                <input
                  value={categoryDraft.labels.tr}
                  onChange={(e) =>
                    setCategoryDraft({
                      ...categoryDraft,
                      labels: { ...categoryDraft.labels, tr: e.target.value },
                    })
                  }
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                  Ad (EN)
                </label>
                <input
                  value={categoryDraft.labels.en}
                  onChange={(e) =>
                    setCategoryDraft({
                      ...categoryDraft,
                      labels: { ...categoryDraft.labels, en: e.target.value },
                    })
                  }
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSaveCategory}
              className="px-6 py-3 rounded-full bg-primary text-white font-black text-xs uppercase tracking-[0.3em]"
            >
              {editingCategoryId ? 'Güncelle' : 'Kaydet'}
            </button>

            <div className="space-y-3">
              {sortedCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 rounded-2xl p-4"
                >
                  <div>
                    <div className="font-black text-primary">{cat.labels[language]}</div>
                    <div className="text-xs text-gray-500">{cat.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditCategory(cat)}
                      className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-gray-200"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-red-200 text-red-600"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
