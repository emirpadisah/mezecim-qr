import type { MenuItem, Category } from '@/data/menu';
import { loadMenuItems, onMenuItemsUpdated, saveMenuItems } from '@/lib/menuStore';

export const isSupabaseEnabled = () => false;

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
  return loadMenuItems(fallback);
}

export async function fetchCategories(fallback: Category[]) {
  return loadLocalCategories(fallback);
}

export async function saveCategory(category: Category) {
  const current = loadLocalCategories([]);
  const exists = current.find((c) => c.id === category.id);
  const updated = exists
    ? current.map((c) => (c.id === category.id ? category : c))
    : [...current, category];
  saveLocalCategories(updated);
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const current = loadLocalCategories([]);
  saveLocalCategories(current.filter((c) => c.id !== id));
  return { ok: true };
}

export async function saveMenuItem(item: MenuItem) {
  const existing = loadMenuItems([]);
  const updated = existing.find((i) => i.id === item.id)
    ? existing.map((i) => (i.id === item.id ? item : i))
    : [...existing, item];
  saveMenuItems(updated);
  return { ok: true };
}

export async function deleteMenuItem(id: string) {
  const existing = loadMenuItems([]);
  saveMenuItems(existing.filter((i) => i.id !== id));
  return { ok: true };
}

export function subscribeMenuUpdates(callback: () => void) {
  return onMenuItemsUpdated(callback);
}

export async function uploadMenuImage(file: File) {
  return '';
}
