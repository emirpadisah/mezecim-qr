"use client";

import { useEffect, useMemo, useState } from "react";
import { loadOrders, onOrdersUpdated, Order } from "@/lib/orderStore";
import { menuData } from "@/data/menu";
import { useLanguage } from "@/components/LanguageProvider";

type ItemStat = {
  itemId: string;
  name: string;
  quantity: number;
  revenue: number;
};

export default function AnalyticsPage() {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("7d");

  useEffect(() => {
    setOrders(loadOrders([]));
    return onOrdersUpdated(() => setOrders(loadOrders([])));
  }, []);

  const filteredOrders = useMemo(() => {
    if (range === "all") return orders;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const start =
      range === "today"
        ? new Date(new Date().toDateString()).getTime()
        : now - (range === "7d" ? 7 : 30) * dayMs;
    return orders.filter((o) => new Date(o.createdAt).getTime() >= start);
  }, [orders, range]);

  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
      );
    }, 0);
    const avgOrder = totalOrders === 0 ? 0 : Math.round(totalRevenue / totalOrders);

    const statusCounts = filteredOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const itemStats = filteredOrders
      .flatMap((order) => order.items)
      .reduce((acc, item) => {
        const existing = acc.get(item.itemId);
        const revenue = item.price * item.quantity;
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += revenue;
        } else {
          acc.set(item.itemId, {
            itemId: item.itemId,
            name: item.name[language],
            quantity: item.quantity,
            revenue,
          });
        }
        return acc;
      }, new Map<string, ItemStat>());

    const topItems = Array.from(itemStats.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const itemsCount = filteredOrders.reduce(
      (sum, order) => sum + order.items.reduce((s, i) => s + i.quantity, 0),
      0
    );

    const categoryMap = new Map(menuData.map((item) => [item.id, item.category]));
    const categoryTotals = filteredOrders
      .flatMap((order) => order.items)
      .reduce((acc, item) => {
        const cat = categoryMap.get(item.itemId) ?? "other";
        acc[cat] = (acc[cat] ?? 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

    const revenueByStatus = filteredOrders.reduce((acc, order) => {
      const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
      acc[order.status] = (acc[order.status] ?? 0) + total;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders,
      totalRevenue,
      avgOrder,
      statusCounts,
      topItems,
      itemsCount,
      categoryTotals,
      revenueByStatus,
    };
  }, [filteredOrders, language]);

  const hourly = useMemo(() => {
    const buckets = Array.from({ length: 24 }, () => 0);
    filteredOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      buckets[hour] += 1;
    });
    return buckets;
  }, [filteredOrders]);

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary">Analitik</h1>
            <p className="text-sm text-gray-500">
              Sipariş performansı ve ürün bazlı özetler.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: "today", label: "Bugün" },
              { id: "7d", label: "7 Gün" },
              { id: "30d", label: "30 Gün" },
              { id: "all", label: "Tümü" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRange(opt.id as typeof range)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                  range === opt.id
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-200 text-primary/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Toplam Sipariş
            </div>
            <div className="text-3xl font-black text-primary mt-2">{metrics.totalOrders}</div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Toplam Ciro
            </div>
            <div className="text-3xl font-black text-primary mt-2">
              {metrics.totalRevenue}₺
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Ortalama Sipariş
            </div>
            <div className="text-3xl font-black text-primary mt-2">{metrics.avgOrder}₺</div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100">
            <div className="text-xs font-black uppercase tracking-widest text-primary/40">
              Toplam Ürün
            </div>
            <div className="text-3xl font-black text-primary mt-2">
              {metrics.itemsCount}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-primary/50 mb-4">
              Durum Dağılımı
            </h2>
            <div className="space-y-3 text-sm">
              {[
                { key: "new", label: "Yeni" },
                { key: "preparing", label: "Hazırlanıyor" },
                { key: "ready", label: "Hazır" },
                { key: "served", label: "Servis" },
              ].map((row) => {
                const count = metrics.statusCounts[row.key] ?? 0;
                const width = metrics.totalOrders
                  ? Math.round((count / metrics.totalOrders) * 100)
                  : 0;
                return (
                  <div key={row.key}>
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary/40">
                      <span>{row.label}</span>
                      <span>{count}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-primary/50 mb-4">
              En Çok Tercih Edilenler
            </h2>
            <div className="space-y-3">
              {metrics.topItems.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center justify-between border border-gray-100 rounded-2xl p-3"
                >
                  <div>
                    <div className="font-black text-primary">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.quantity} adet · {item.revenue}₺
                    </div>
                  </div>
                </div>
              ))}
              {metrics.topItems.length === 0 && (
                <div className="text-xs text-gray-400">Henüz veri yok</div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-primary/50 mb-4">
              Saatlik Yoğunluk
            </h2>
            <div className="grid grid-cols-12 gap-2 items-end h-40">
              {hourly.map((count, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-full bg-primary/80"
                    style={{ height: `${Math.max(4, count * 8)}px` }}
                  />
                  <span className="text-[10px] text-gray-400">{idx}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-primary/50 mb-4">
              Kategori Dağılımı
            </h2>
            <div className="space-y-3 text-sm">
              {Object.entries(metrics.categoryTotals).map(([cat, qty]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary/40">
                    <span>{cat}</span>
                    <span>{qty}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${metrics.itemsCount ? Math.round((qty / metrics.itemsCount) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {Object.keys(metrics.categoryTotals).length === 0 && (
                <div className="text-xs text-gray-400">Henüz veri yok</div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] p-6 border border-gray-100">
          <h2 className="text-sm font-black uppercase tracking-widest text-primary/50 mb-4">
            Son Siparişler
          </h2>
          <div className="space-y-3">
            {filteredOrders.slice(0, 8).map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-100 rounded-2xl p-3"
              >
                <div>
                  <div className="font-black text-primary">Masa {order.table}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString("tr-TR")}
                  </div>
                </div>
                <div className="text-xs font-black text-primary/70">
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)} ürün ·{" "}
                  {order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}₺
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-xs text-gray-400">Henüz veri yok</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
