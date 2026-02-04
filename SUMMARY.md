# Mezecim QR Menü Sistemi

Mezecim için hazırlanmış dijital QR menü uygulamasıdır. Müşteriler QR kodla menüye ulaşır; işletme tarafı ise ürün, kategori ve görsel yönetimini admin panelden yapar. Aşağıda sistemin her bölümünün ne yaptığı ve nasıl kullanılacağı **basit dille** anlatılmıştır.

## Hangi Kısım Ne Yapıyor?

### 1) Ana Menü (Müşteri Ekranı) – `/`
Müşterilerin gördüğü sayfadır.
- Ürünler kategorilere ayrılmış şekilde listelenir.
- Arama kutusundan ürün adı veya açıklamasıyla arama yapılır.
- Ürüne tıklanınca detay penceresi açılır.
- Mobilde iki ürün yan yana görünür.

### 2) Admin Giriş – `/admin/login`
İşletme yönetimi için giriş ekranıdır.
- Admin kullanıcı girişi yapar.
- Giriş sonrası admin paneline yönlendirilir.

### 3) Admin Panel (Ürünler + Kategoriler) – `/admin`
Ürün ve kategori yönetimi bu sayfadan yapılır.

**Ürünler Sekmesi**
- Satıştaki ürünler listelenir.
- Ürün düzenleme ve silme yapılabilir.

**Yeni Ürün Ekle Sekmesi**
- Türkçe/İngilizce ad ve açıklama girilir.
- Fiyat, kategori ve stok/popüler bilgileri seçilir.
- Görsel linki girilebilir veya görsel yüklenebilir.
- Sürükle bırak (drag & drop) ile görsel yükleme desteklenir.

**Kategoriler Sekmesi**
- Yeni kategori eklenir.
- Kategori düzenleme / silme yapılır.

### 4) Analitik – `/admin/analytics`
İşletme performansını özetler.
- Toplam sipariş, ciro ve ortalama değerler.
- Durum dağılımı ve yoğunluk saatleri.
- En çok tercih edilen ürünler.

### 5) Mutfak Paneli – `/kitchen`
Siparişler burada yönetilir.
- Siparişler manuel olarak eklenir.
- Masa, not, ürün ve adet girilir.
- Sipariş durumu (Yeni/Hazırlanıyor/Hazır/Servis) yönetilir.

### 6) QR Kod – `/admin/qr`
Masalara konulacak QR kodu burada üretilir.
- Kod yazdırılabilir.

## Nasıl Kullanılır?

1. **QR Menü**
   - Müşteri QR kodu okutur, menüyü görür ve ürünleri inceler.

2. **Ürün Ekleme**
   - Admin giriş yapar → “Yeni Ürün Ekle” sekmesi.
   - Ürün bilgilerini doldurur, görsel ekler, kaydeder.

3. **Kategori Ekleme**
   - Admin panel → “Kategoriler” sekmesi.
   - Yeni kategori ekler veya mevcutları düzenler.

4. **Mutfak Siparişi**
   - Mutfak ekranına girilir.
   - Sipariş eklenir, durum güncellenir.

5. **Analitik Takip**
   - Analitik ekranına girilir.
   - Performans verileri görüntülenir.

## Sayfalar (Kısa Liste)

- Ana Menü: `/`
- Admin Giriş: `/admin/login`
- Admin Panel: `/admin`
- Analitik: `/admin/analytics`
- Mutfak Paneli: `/kitchen`
- QR Kod: `/admin/qr`

Bu belge, sistemi **teknik detaya girmeden** açıklamak için hazırlanmıştır.
