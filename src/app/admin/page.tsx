'use client';

import { useEffect, useMemo, useState } from 'react';
import { categories, menuData, MenuItem } from '@/data/menu';
import { loadMenuItems, resetMenuItems, saveMenuItems } from '@/lib/menuStore';
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
  const [tab, setTab] = useState<'list' | 'create'>('list');

  useEffect(() => {
    setItems(loadMenuItems(menuData));
  }, []);

  const categoryLabel = (id: string) =>
    categories.find((cat) => cat.id === id)?.labels[language] ?? id;

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name[language].localeCompare(b.name[language])),
    [items, language]
  );

  const startEdit = (item: MenuItem) => {
    setDraft(item);
    setEditingId(item.id);
    setImagePreview(item.image || '');
    setTab('create');
  };

  const clearDraft = () => {
    setDraft(emptyItem());
    setEditingId(null);
    setImagePreview('');
  };

  const handleImageUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setDraft((prev) => ({ ...prev, image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!draft.name.tr || !draft.name.en) return;
    if (!draft.image) return;
    const updated = editingId
      ? items.map((item) => (item.id === editingId ? draft : item))
      : [
          ...items,
          {
            ...draft,
            id: crypto?.randomUUID?.() ?? String(Date.now()),
          },
        ];
    setItems(updated);
    saveMenuItems(updated);
    clearDraft();
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveMenuItems(updated);
  };

  const handleReset = () => {
    resetMenuItems(menuData);
    setItems(menuData);
    clearDraft();
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

        <section className="bg-white rounded-[2rem] p-4 border border-gray-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
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
                  {imagePreview && (
                    <div className="mt-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">
                        Önizleme
                      </div>
                      <img
                        src={imagePreview}
                        alt="Önizleme"
                        className="w-32 h-32 rounded-2xl object-cover border border-gray-100"
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
                      type="number"
                      value={draft.price}
                      onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
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
                      {categories
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
      </div>
    </main>
  );
}
