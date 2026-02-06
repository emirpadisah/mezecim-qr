'use client';

import { useEffect, useMemo, useState } from 'react';
import { MenuItem } from '@/data/menu';
import { useLanguage } from '@/components/LanguageProvider';
import { fetchMenuItemsSupabase } from '@/lib/supabaseMenuApi';
// TODO: Sipariş işlemleri için Supabase order/order_items API fonksiyonları eklenmeli

const statusOrder: OrderStatus[] = ['new', 'preparing', 'ready', 'served'];
const APP_NOW = Date.now();

const statusLabels: Record<OrderStatus, { tr: string; en: string }> = {
  new: { tr: 'Yeni', en: 'New' },
  preparing: { tr: 'Hazırlanıyor', en: 'Preparing' },
  ready: { tr: 'Hazır', en: 'Ready' },
  served: { tr: 'Servis Edildi', en: 'Served' },
};

export default function KitchenPage() {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tableNo, setTableNo] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<OrderStatus>('new');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [lines, setLines] = useState<Order['items']>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    // TODO: Supabase'den siparişleri çek
    fetchMenuItemsSupabase().then(setMenuItems);
    // TODO: Supabase'den siparişleri çekme fonksiyonu eklenmeli
  }, []);

  const orderTotal = (order: Order) =>
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderCount = (order: Order) =>
    order.items.reduce((sum, item) => sum + item.quantity, 0);

  const minutesSince = (iso: string) => {
    const diff = APP_NOW - new Date(iso).getTime();
    return Math.max(0, Math.floor(diff / 60000));
  };

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    const list =
      statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);
    const searched = list.filter(
      (order) =>
        order.table.toLowerCase().includes(q) ||
        order.items.some((i) => i.name[language].toLowerCase().includes(q))
    );
    const sorted = [...searched].sort((a, b) =>
      sortBy === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return sorted;
  }, [orders, statusFilter, search, sortBy, language]);

  // TODO: Supabase ile sipariş durumunu güncelleme fonksiyonu eklenmeli
  const advanceStatus = (order: any) => {
    // Supabase ile update fonksiyonu çağrılacak
  };

  const addLine = () => {
    const item = menuItems.find((m) => m.id === selectedItemId);
    if (!item || quantity < 1) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.itemId === item.id);
      if (existing) {
        return prev.map((l) =>
          l.itemId === item.id ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity,
        },
      ];
    });
    setQuantity(1);
  };

  const removeLine = (itemId: string) => {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
  };

  // TODO: Supabase ile yeni sipariş ekleme fonksiyonu eklenmeli
  const createOrder = () => {
    if (!tableNo || lines.length === 0) return;
    // Supabase'e yeni sipariş ekle
    setTableNo('');
    setNote('');
    setStatus('new');
    setSelectedItemId('');
    setLines([]);
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary">Mutfak Paneli</h1>
            <p className="text-sm text-gray-500">Siparişleri duruma göre yönetin.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-gray-200 bg-white"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
            </select>
          </div>
        </header>

        <section className="bg-white rounded-[2rem] p-5 border border-gray-100 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-primary/50">
            Sipariş Ekle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                Masa
              </label>
              <input
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
                placeholder="A-12"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                Durum
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              >
                {statusOrder.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s][language]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                Not
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="İsteğe bağlı"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                Ürün
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              >
                <option value="">Ürün seç</option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name[language]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-primary/50">
                Adet
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={addLine}
              className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-gray-200"
            >
              Ürün Ekle
            </button>
            <button
              onClick={createOrder}
              className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-primary text-white"
            >
              Siparişi Kaydet
            </button>
          </div>

          {lines.length > 0 && (
            <div className="space-y-2 text-xs">
              {lines.map((line) => (
                <div
                  key={line.itemId}
                  className="flex items-center justify-between border border-gray-100 rounded-2xl p-2"
                >
                  <span>
                    {line.quantity}x {line.name[language]}
                  </span>
                  <button
                    onClick={() => removeLine(line.itemId)}
                    className="text-red-500 text-[10px] font-black uppercase tracking-widest"
                  >
                    Kaldır
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Toplam Sipariş
            </div>
            <div className="text-2xl font-black text-primary mt-2">{orders.length}</div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Aktif Sipariş
            </div>
            <div className="text-2xl font-black text-primary mt-2">
              {orders.filter((o) => o.status !== 'served').length}
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Toplam Ürün
            </div>
            <div className="text-2xl font-black text-primary mt-2">
              {orders.reduce((sum, o) => sum + orderCount(o), 0)}
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Toplam Tutar
            </div>
            <div className="text-2xl font-black text-primary mt-2">
              {orders.reduce((sum, o) => sum + orderTotal(o), 0)}₺
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Ortalama Süre
            </div>
            <div className="text-2xl font-black text-primary mt-2">
              {orders.length
                ? Math.round(
                    orders.reduce((sum, o) => sum + minutesSince(o.createdAt), 0) /
                      orders.length
                  )
                : 0}
              dk
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] p-5 border border-gray-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                  statusFilter === 'all'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-gray-200 text-primary/60'
                }`}
              >
                Tümü
              </button>
              {statusOrder.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                    statusFilter === status
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white border-gray-200 text-primary/60'
                  }`}
                >
                  {statusLabels[status][language]}
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Masa veya ürün ara..."
              className="w-full lg:w-64 rounded-full border border-gray-200 px-4 py-2 text-sm"
            />
          </div>

          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-100 rounded-2xl p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                      Masa {order.table}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      {minutesSince(order.createdAt)} dk
                    </span>
                  </div>
                  <div className="text-xs font-black text-primary/70">
                    {orderCount(order)} ürün · {orderTotal(order)}₺
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-primary">
                  {order.items.map((item) => (
                    <div key={item.itemId} className="flex justify-between border rounded-xl p-2 border-gray-100">
                      <span>
                        {item.quantity}x {item.name[language]}
                      </span>
                      <span>{item.price * item.quantity}₺</span>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                    Not: {order.note}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {statusOrder.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      className={`px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === status
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white border-gray-200 text-primary/60'
                      }`}
                    >
                      {statusLabels[status][language]}
                    </button>
                  ))}
                  {order.status !== 'served' && (
                    <button
                      onClick={() => advanceStatus(order)}
                      className="px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-white"
                    >
                      İleri Al
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-xs text-gray-400">Sipariş yok</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
