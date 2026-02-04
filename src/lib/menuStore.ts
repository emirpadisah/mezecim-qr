import type { MenuItem } from '@/data/menu';

const STORAGE_KEY = 'mezecim_menu_items';
const UPDATE_EVENT = 'menu:updated';

export function loadMenuItems(defaultItems: MenuItem[]): MenuItem[] {
  if (typeof window === 'undefined') return defaultItems;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultItems;
  try {
    const parsed = JSON.parse(raw) as MenuItem[];
    if (!Array.isArray(parsed)) return defaultItems;
    return parsed;
  } catch {
    return defaultItems;
  }
}

export function saveMenuItems(items: MenuItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch (error) {
    // Fallback: strip large inline images to avoid quota errors.
    const sanitized = items.map((item) => ({
      ...item,
      image: item.image.startsWith('data:') ? '' : item.image,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
}

export function resetMenuItems(defaultItems: MenuItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function onMenuItemsUpdated(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(UPDATE_EVENT, handler);
  return () => window.removeEventListener(UPDATE_EVENT, handler);
}
