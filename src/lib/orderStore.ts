import type { MenuItem } from '@/data/menu';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served';

export type OrderLine = {
  itemId: string;
  name: MenuItem['name'];
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  table: string;
  createdAt: string;
  status: OrderStatus;
  note?: string;
  items: OrderLine[];
};

const STORAGE_KEY = 'mezecim_orders';
const UPDATE_EVENT = 'orders:updated';

export function loadOrders(defaultOrders: Order[]): Order[] {
  if (typeof window === 'undefined') return defaultOrders;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultOrders;
  try {
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : defaultOrders;
  } catch {
    return defaultOrders;
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function addOrder(order: Order) {
  const current = loadOrders([]);
  saveOrders([order, ...current]);
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const current = loadOrders([]);
  const updated = current.map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
  saveOrders(updated);
}

export function onOrdersUpdated(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(UPDATE_EVENT, handler);
  return () => window.removeEventListener(UPDATE_EVENT, handler);
}
