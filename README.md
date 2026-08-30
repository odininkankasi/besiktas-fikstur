# 🦅 Beşiktaş JK Fikstür & Canlı Maç Takvimi

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-red?style=for-the-badge&logo=pwa)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Kara Kartal sevdalıları için geliştirilmiş modern, hızlı, reklamsız canlı maç takvimi ve fikstür platformu.**

> 🖤 **Açık Kaynak Daveti:** Bu proje tamamen açık kaynaklıdır ve MIT lisansı ile korunmaktadır. İsteyen herkes kodları özgürce inceleyebilir, klonlayabilir, kendi takımı veya projeleri için dilediği gibi kullanabilir ve geliştirebilir!

🌐 **Canlı Yayın:** [bjk.8080.tr](https://bjk.8080.tr)

</div>

---

## 🌟 Öne Çıkan Özellikler

- ⏳ **Canlı Geri Sayım:** Sıradaki karşılaşmaya kalan gün, saat, dakika ve saniyeyi anlık olarak gösterir.
- 📱 **Tek Tıkla Takvim Senkronizasyonu:** Apple Takvim (iOS/macOS), Google Takvim ve Outlook takvimlerine canlı abone olma imkanı (`/api/calendar.ics`).
- 📊 **Canlı Puan Tablosu:** Trendyol Süper Lig ve UEFA Avrupa Ligi güncel puan durumları (Kota korumalı akıllı disk önbelleği ile).
- 📈 **2026/2027 Sezon İstatistikleri:** Toplam oynanan maç, galibiyet, beraberlik, mağlubiyet, atılan gol, yenilen gol ve averaj özeti.
- 🛡️ **Orijinal Vektörel Kulüp Logoları:** Süper Lig ve Avrupa rakiplerinin yüksek çözünürlüklü şeffaf logoları.
- 🔍 **Canlı Filtreleme & Arama:** Tüm Maçlar, Gelecek Maçlar, Biten Maçlar ve rakip takım/stadyum araması.
- 📲 **PWA Desteği:** iOS ve Android cihazlarda tek tıkla ana ekrana uygulama olarak eklenebilir.
- 🚫 **%100 Reklamsız & Gizlilik Odaklı:** Sıfır takipçi, sıfır reklam.

---

## 🏗️ Kullanılan Teknolojiler & API Veri Sağlayıcıları

- **Frontend & Backend:** [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Stil & Tasarım:** [TailwindCSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Takvim & Fikstür Motoru:** [FotMob](https://www.fotmob.com/) RFC 5545 iCalendar (ICS) canlı akış ayrıştırıcı
- **Puan Durumu Servisi:** [CollectAPI Spor API](https://collectapi.com/tr/api/sport/spor-api) (12 saatlik disk önbellek korumalı)
- **Vektörel Grafikler:** Beşiktaş JK Wikimedia SVG & Spor CDN

> ℹ️ **Veri Sağlayıcıları Bildirimi:** Bu projenin kaynak kodları açık kaynaklıdır; ancak maç takvimi ve puan tablosu verilerini sağlayan **FotMob** ve **CollectAPI** harici üçüncü taraf bağımsız servislerdir ve kendi mülkiyet/hizmet şartlarına tabidir. Projeyi kendi sunucunuza kurarken ilgili servislerden kendi API anahtarlarınızı temin etmeniz önerilir.

---

## 🚀 Yerel Kurulum & Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/odininkankasi/besiktas-fikstur.git
cd besiktas-fikstur
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Ayarlayın (Opsiyonel)
```bash
cp .env.example .env.local
```
> `.env.local` dosyasına CollectAPI anahtarınızı girebilirsiniz. Girilmezse sistem yerel yedek verileri kullanır.

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyebilirsiniz.

### 5. Canlı Sürümü Derleyin
```bash
npm run build
npm run start
```

---

## 📅 Takvim Senkronizasyon URL'i

Herhangi bir takvim uygulamasına doğrudan abone olmak için standart iCalendar akışı:
```text
https://bjk.8080.tr/api/calendar.ics
```
- **Apple Takvim (iOS/macOS):** `webcal://bjk.8080.tr/api/calendar.ics`
- **Google Takvim / Outlook:** Yukarıdaki `.ics` bağlantısını *"URL ile Takvim Ekle"* alanına yapıştırın.

---

## 🤝 Katkıda Bulunma & Özgür Kullanım

Bu proje Beşiktaş ve spor camiasına açık kaynak bir hediyedir. 
- İsteyen herkes projeyi **fork'layabilir**,
- Kendi takımı için (örneğin başka lig/kulüp takvimleri) uyarlayabilir,
- Yeni özellikler için **Pull Request (PR)** gönderebilir veya **Issue** açarak öneride bulunabilir!

---

## 📄 Lisans

Bu proje **[MIT Lisansı](LICENSE)** ile lisanslanmıştır. İsteyen herkes ticari veya kişisel projelerinde kaynak göstermek kaydıyla tamamen ücretsiz ve özgürce kullanabilir.

---

## 📬 İletişim

Görüş, öneri veya iş birliği talepleriniz için:
- ✉️ **E-posta:** [iletisim@kanik.com.tr](mailto:iletisim@kanik.com.tr)
- 🌐 **Web:** [https://bjk.8080.tr](https://bjk.8080.tr)

---

<div align="center">
Made with 🖤🤍 for Kara Kartal
</div>
