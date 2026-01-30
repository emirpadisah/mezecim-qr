# 🍽️ Mezecim QR Menü Sistemi

Mezecim Gurme Meze Evi için tasarlanmış, modern, hızlı ve kullanıcı dostu bir dijital QR menü çözümüdür. Bu sistem, müşterilerin masalarındaki QR kodu okutarak işletmenin taze ve lezzetli menüsüne anında, uygulama indirmeden ulaşmasını sağlar.

## 🚀 Mevcut Özellikler

-   **Premium Hibrit Tasarım:** Masaüstünde profesyonel bir dashboard görünümü, mobilde ise akıcı bir uygulama (PWA) deneyimi sunar.
-   **Akıllı Filtreleme:** Ürünler; Mezeler, Zeytinyağlılar, Salatalar, Turşular ve Tatlılar olarak kategorize edilmiştir. Ayrıca "Tüm Menü" seçeneği ile hızlı tarama yapılabilir.
-   **Canlı Arama:** Müşteriler istedikleri lezzeti hem isimden hem de içerik açıklamasından anında bulabilir.
-   **Detaylı Ürün İnceleme:** Her ürün için aşağıdan açılan (mobil) veya merkezde odaklanan (masaüstü) detay pencereleri.
-   **Hizmet Butonları:** Müşterinin tek tıkla garson çağırabileceği interaktif alt panel.
-   **Yönetici QR Paneli:** İşletme sahibinin masalara koymak üzere otomatik QR kod oluşturabileceği `/admin/qr` sayfası.
-   **Performans:** Next.js 14 ve Tailwind CSS kullanılarak yıldırım hızında yükleme süreleri.

---

## 🛠️ Teknik Altyapı

-   **Framework:** Next.js 14 (App Router)
-   **Styling:** Tailwind CSS (Modern & Responsive)
-   **Animations:** Framer Motion (Akıcı geçişler)
-   **Icons:** Lucide React
-   **QR Generation:** qrcode.react

---

## 💡 Gelecek Geliştirme Önerileri

Sistemi daha da ileriye taşımak için şu özellikler eklenebilir:

1.  **Dijital Sipariş Yönetimi:**
    *   Müşterilerin sepete ürün ekleyip direkt masadan sipariş verebilmesi.
    *   Mutfak için bir "Sipariş Takip Ekranı".

2.  **Online Ödeme Entegrasyonu:**
    *   Iyzico veya Stripe ile masada temassız ödeme imkanı.

3.  **Çoklu Dil Desteği (i18n):**
    *   Özellikle turistik bölgeler için İngilizce, Almanca ve Rusça dil seçenekleri.

4.  **Yönetim Paneli (Admin Dashboard):**
    *   Ürün fiyatlarını, stok durumunu ve görsellerini kod yazmadan değiştirebileceğiniz bir arayüz.
    *   Günlük/Aylık satış analizleri ve en çok tercih edilen ürünler raporu.

5.  **Müşteri Yorum & Puanlama:**
    *   Ürün bazlı yıldız puanlama ve anonim yorum bırakma özelliği.

6.  **Sadakat Programı:**
    *   "5 Meze Alana 1 Meze Bedava" gibi QR bazlı dijital sadakat kartları.

---

## 🏃‍♂️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için:

1.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
2.  Geliştirme sunucusunu başlatın:
```bash
npm run dev
    ```
3.  Tarayıcınızda `http://localhost:3000` adresini açın.

---

**Tasarım & Uygulama:** AI Coding Assistant
**İşletme:** Mezecim Gurme Meze Evi
