import { supabase } from './supabase';
import type { MenuItem, Category } from '@/data/menu';

const TABLE_MENU = 'menu_items';
const TABLE_CATEGORY = 'categories';

export async function fetchMenuItemsSupabase(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from(TABLE_MENU)
    .select('*');
  if (error) throw error;
  return data as MenuItem[];
}

export async function fetchCategoriesSupabase(): Promise<Category[]> {
  const { data, error } = await supabase
    .from(TABLE_CATEGORY)
    .select('*');
  if (error) throw error;
  return data as Category[];
}

export async function saveMenuItemSupabase(item: MenuItem) {
  const { data, error } = await supabase
    .from(TABLE_MENU)
    .upsert([item]);
  if (error) throw error;
  return { ok: true, data };
}

export async function deleteMenuItemSupabase(id: string) {
  const { error } = await supabase
    .from(TABLE_MENU)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { ok: true };
}

export async function saveCategorySupabase(category: Category) {
  const { data, error } = await supabase
    .from(TABLE_CATEGORY)
    .upsert([category]);
  if (error) throw error;
  return { ok: true, data };
}

export async function deleteCategorySupabase(id: string) {
  const { error } = await supabase
    .from(TABLE_CATEGORY)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { ok: true };
}
