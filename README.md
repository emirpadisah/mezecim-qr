# 🍽️ Mezecim QR Menü Sistemi

Mezecim Gurme Meze Evi için tasarlanmış, modern ve kullanıcı dostu bir **dijital QR menü** çözümüdür. Müşteriler QR kodla menüye girer; admin panel üzerinden ürün, kategori ve görsel yönetimi yapılır.

## ✅ Güncel Özellikler

- **Mobil odaklı tasarım** (2’li grid, kompakt kartlar)
- **TR / EN çoklu dil** desteği
- **Canlı arama ve kategori filtreleme**
- **Ürün detay modalı**
- **Admin panel** (login + yönetim)
  - Ürün listeleme / düzenleme / silme
  - Yeni ürün ekleme
  - Görsel yükleme (Supabase Storage veya local fallback)
  - Kategori yönetimi (ekle / düzenle / sil)
- **Mutfak paneli** (manuel sipariş ekleme + status yönetimi)
- **Analitik paneli** (metrikler, durum dağılımı, yoğunluk, kategori dağılımı)
- **QR oluşturma sayfası** (`/admin/qr`)

## 🧭 Sayfalar

- `/` : QR menü (müşteri ekranı)
- `/admin/login` : Admin giriş
- `/admin` : Ürünler & Kategoriler
- `/admin/analytics` : Analitik
- `/kitchen` : Mutfak paneli
- `/admin/qr` : QR kod oluşturma

## ⚙️ Teknoloji

- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Supabase (DB + Storage)

## 🧰 Supabase Kurulumu

### 1) ENV Değerleri
`.env.local` oluştur:
```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 2) Storage Bucket
Supabase Storage’da bucket oluştur:
```
menu-images
```
Public olarak işaretle.

### 3) Tablolar (SQL)
Tüm tabloları ve RLS policy’lerini kurmak için tek seferlik SQL:
```sql
create extension if not exists "pgcrypto";

create table if not exists categories (
  id text primary key,
  labels jsonb not null,
  icon text not null,
  sort_order int default 0
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id text references categories(id) on delete cascade,
  name jsonb not null,
  description jsonb not null,
  price numeric(10,2) not null,
  image_url text not null,
  is_available boolean default true,
  is_popular boolean default false,
  created_at timestamptz default now()
);

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean default true
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  table_no text not null,
  status text not null default 'new',
  note text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete set null,
  name jsonb not null,
  price numeric(10,2) not null,
  quantity int not null
);

create or replace view analytics_order_summary as
select
  date_trunc('day', o.created_at) as day,
  count(distinct o.id) as total_orders,
  sum(oi.price * oi.quantity) as total_revenue,
  sum(oi.quantity) as total_items
from orders o
join order_items oi on oi.order_id = o.id
group by 1
order by 1 desc;

alter table categories enable row level security;
alter table menu_items enable row level security;
alter table admin_users enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "public read categories"
on categories for select using (true);

create policy "public read menu_items"
on menu_items for select using (true);

create policy "admin write categories"
on categories for all using (
  exists (select 1 from admin_users where user_id = auth.uid() and is_admin = true)
);

create policy "admin write menu_items"
on menu_items for all using (
  exists (select 1 from admin_users where user_id = auth.uid() and is_admin = true)
);

create policy "admin read admin_users"
on admin_users for select using (user_id = auth.uid());

create policy "admin write admin_users"
on admin_users for insert with check (user_id = auth.uid());

create policy "admin read orders"
on orders for select using (
  exists (select 1 from admin_users where user_id = auth.uid() and is_admin = true)
);

create policy "admin write orders"
on orders for all using (
  exists (select 1 from admin_users where user_id = auth.uid() and is_admin = true)
);

create policy "admin read order_items"
on order_items for select using (
  exists (select 1 from admin_users where user_id = auth.uid() and is_admin = true)
);

create policy "admin write order_items"
on order_items for all using (
  exists (select 1 from admin_users where user_id = auth.uid() and is_admin = true)
);
```

### 4) Admin Kullanıcısı
Supabase Auth’ta user oluştur:
- Email: `admin@meze.com`
- Password: `1234`

Sonra admin_users tablosuna ekle:
```sql
insert into admin_users (user_id, is_admin)
select id, true
from auth.users
where email = 'admin@meze.com'
on conflict (user_id) do nothing;
```

## 🏃‍♂️ Kurulum
```bash
npm install
npm run dev
```

## 🧪 Notlar
- Supabase env girilmezse sistem **localStorage fallback** ile çalışır.
- Admin login demo (admin / 1234) yalnızca mock login sayfasında vardır; gerçek Auth için Supabase kullanılır.

---

**Tasarım & Uygulama:** AI Coding Assistant  
**İşletme:** Mezecim Gurme Meze Evi  
