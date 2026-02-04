import { createClient } from '@supabase/supabase-js';
import type { MenuItem, Category } from '@/data/menu';
import { loadMenuItems, onMenuItemsUpdated, saveMenuItems } from '@/lib/menuStore';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValidHttpUrl = (value?: string) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const supabase =
  isValidHttpUrl(supabaseUrl) && supabaseAnon
    ? createClient(supabaseUrl, supabaseAnon)
    : null;

export const isSupabaseEnabled = () => Boolean(supabase);

type MenuRow = {
  id: string;
  category_id: string;
  name: MenuItem['name'];
  description: MenuItem['description'];
  price: number;
  image_url: string;
  is_available: boolean;
  is_popular: boolean;
};

type CategoryRow = {
  id: string;
  labels: Category['labels'];
  icon: string;
  sort_order: number | null;
};

const mapRowToItem = (row: MenuRow): MenuItem => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  category: row.category_id,
  image: row.image_url,
  isAvailable: row.is_available,
  isPopular: row.is_popular,
});

const CATEGORY_KEY = 'mezecim_categories';

const loadLocalCategories = (fallback: Category[]) => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(CATEGORY_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Category[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const saveLocalCategories = (categories: Category[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
};

export async function fetchMenuItems(fallback: MenuItem[]) {
  if (!supabase) {
    return loadMenuItems(fallback);
  }
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return fallback;
  return (data as MenuRow[]).map(mapRowToItem);
}

export async function fetchCategories(fallback: Category[]) {
  if (!supabase) {
    return loadLocalCategories(fallback);
  }
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return fallback;
  return (data as CategoryRow[]).map((row) => ({
    id: row.id,
    labels: row.labels,
    icon: row.icon,
  }));
}

export async function saveCategory(category: Category) {
  if (!supabase) {
    const current = loadLocalCategories([]);
    const exists = current.find((c) => c.id === category.id);
    const updated = exists
      ? current.map((c) => (c.id === category.id ? category : c))
      : [...current, category];
    saveLocalCategories(updated);
    return;
  }
  await supabase.from('categories').upsert({
    id: category.id,
    labels: category.labels,
    icon: category.icon || 'Leaf',
    sort_order: 0,
  });
}

export async function deleteCategory(id: string) {
  if (!supabase) {
    const current = loadLocalCategories([]);
    saveLocalCategories(current.filter((c) => c.id !== id));
    return;
  }
  await supabase.from('categories').delete().eq('id', id);
}

export async function saveMenuItem(item: MenuItem) {
  if (!supabase) {
    const existing = loadMenuItems([]);
    const updated = existing.find((i) => i.id === item.id)
      ? existing.map((i) => (i.id === item.id ? item : i))
      : [...existing, item];
    saveMenuItems(updated);
    return;
  }

  const payload = {
    id: item.id || undefined,
    category_id: item.category,
    name: item.name,
    description: item.description,
    price: item.price,
    image_url: item.image,
    is_available: item.isAvailable,
    is_popular: item.isPopular ?? false,
  };

  if (item.id && item.id.trim() !== '') {
    await supabase.from('menu_items').update(payload).eq('id', item.id);
  } else {
    await supabase.from('menu_items').insert(payload);
  }
}

export async function deleteMenuItem(id: string) {
  if (!supabase) {
    const existing = loadMenuItems([]);
    saveMenuItems(existing.filter((i) => i.id !== id));
    return;
  }
  await supabase.from('menu_items').delete().eq('id', id);
}

export function subscribeMenuUpdates(callback: () => void) {
  if (!supabase) {
    return onMenuItemsUpdated(callback);
  }
  return () => {};
}

export async function uploadMenuImage(file: File) {
  if (!supabase) return '';
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `menu/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('menu-images')
    .upload(path, file, { upsert: false });
  if (error || !data?.path) return '';
  const { data: publicUrl } = supabase.storage.from('menu-images').getPublicUrl(data.path);
  return publicUrl?.publicUrl ?? '';
}
