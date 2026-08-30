import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, ShieldAlert, Sparkles, Database, CheckCircle2, Code2, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hakkında & Proje Detayları',
  description: 'Beşiktaş Fikstür & Maç Takvimi bağımsız taraftar projesinin vizyonu, veri kaynakları, kullanılan API altyapısı ve özellikleri.'
};

export default function HakkindaPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-red-600 selection:text-white">
      {/* Üst Header */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-neutral-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500 group-hover:-translate-x-1 group-hover:text-red-500 transition-all" />
            <span>Fikstüre Dön</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
              bjk.8080.tr
            </span>
          </div>
        </div>
      </header>

      {/* İçerik Alanı - Açık & Editoryal Düzen */}
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-12">
        {/* Başlık */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>KARA KARTAL TARAFTAR REHBERİ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Hakkında & Proje Detayları
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
            Modern, reklamsız, hızlı ve her an cebinizde olan Beşiktaş maç takvimi platformu.
          </p>
        </div>

        {/* Yasal Bildirim */}
        <div className="p-4 sm:p-5 rounded-2xl bg-red-950/30 border border-red-900/50 flex items-start gap-3.5 text-neutral-300 text-sm">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-white text-xs uppercase tracking-wider text-red-400">
              Önemli Yasal Bildirim
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed mt-0.5">
              &quot;Bu site bağımsız bir taraftar projesidir. Beşiktaş JK ile resmi bir bağı bulunmamaktadır.&quot;
            </p>
          </div>
        </div>

        {/* Neler Sunuyoruz? */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-neutral-800/80 pb-2">
            Öne Çıkan Özellikler
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Canlı Geri Sayım & Detaylı Fikstür:</strong>
                Beşiktaş&apos;ın sıradaki maçına kalan gün, saat, dakika ve saniyeyi canlı gösterir. Maç sonuçlarını, atılan/yenilen golleri ve stadyum konumlarını listeler.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Tek Tıkla Takvim Senkronizasyonu:</strong>
                Apple Takvim, Google Takvim ve Outlook ile uyumlu doğrudan takvim aboneliği sağlar. Saat veya tarih değiştiğinde telefonunuz otomatik güncellenir.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Canlı Puan Tablosu & Sezon Özeti:</strong>
                Trendyol Süper Lig ve UEFA Avrupa Ligi sıralamalarını anlık olarak sunar.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">PWA (Mobil Uygulama) Desteği:</strong>
                Tarayıcı üzerinden ana ekrana ekleyerek uygulama gibi tam ekran kullanabilirsiniz.
              </div>
            </div>
          </div>
        </section>

        {/* Kullanılan API'ler & Veri Kaynakları */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-neutral-800/80 pb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-red-500" />
            <span>Kullanılan API&apos;ler ve Veri Kaynakları</span>
          </h2>
          
          <div className="space-y-4 text-sm leading-relaxed text-neutral-300">
            <div className="border-l-2 border-red-500 pl-4 py-1">
              <h3 className="font-bold text-white text-base">FotMob Canlı Takvim & Fikstür Akışı (RFC 5545)</h3>
              <p className="text-neutral-400 text-xs mt-1">
                Beşiktaş&apos;ın lig, kupa ve Avrupa maç takvimi, anlık başlama saatleri, ertelenen maç güncellemeleri ve stadyum bilgileri FotMob resmi takvim motoru üzerinden anlık iCalendar (ICS) akışıyla çekilerek sunucumuzda işlenir.
              </p>
            </div>

            <div className="border-l-2 border-red-500 pl-4 py-1">
              <h3 className="font-bold text-white text-base">CollectAPI Spor API Servisi</h3>
              <p className="text-neutral-400 text-xs mt-1">
                Trendyol Süper Lig puan tablosu, galibiyet/mağlubiyet sayıları ve averaj bilgileri CollectAPI Spor API uç noktası üzerinden çift katmanlı disk önbellek korumasıyla güvenli ve güncel olarak sunulur.
              </p>
            </div>

            <div className="border-l-2 border-red-500 pl-4 py-1">
              <h3 className="font-bold text-white text-base">Resmi Vektörel Arma & Kulüp Görsel CDN</h3>
              <p className="text-neutral-400 text-xs mt-1">
                Beşiktaş JK resmi vektörel logosu Wikimedia Commons üzerinden SVG formatında, rakip kulüplerin orijinal yüksek çözünürlüklü logoları ise doğrulanmış spor CDN altyapısı üzerinden şeffaf formatta servis edilir.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
              <strong className="text-neutral-300 block mb-1">ℹ️ Üçüncü Taraf Veri Sağlayıcıları Hakkında:</strong>
              Platformumuzun yazılım kodları açık kaynaklı olmakla birlikte, veri akışını sağlayan FotMob ve CollectAPI harici üçüncü taraf bağımsız servislerdir ve kendi kullanım/telif politikalarına tabidir.
            </div>
          </div>
        </section>

        {/* Yazılım & Altyapı Mimarisi */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-neutral-800/80 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-red-500" />
            <span>Teknoloji & Altyapı Mimarisi</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 block uppercase">Framework</span>
              <span className="text-white font-bold">Next.js 16 (App Router)</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 block uppercase">Programlama Dili</span>
              <span className="text-white font-bold">TypeScript 5 & Node.js</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 block uppercase">Tasarım & Stil</span>
              <span className="text-white font-bold">TailwindCSS & Lucide Icons</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 block uppercase">Takvim Motoru</span>
              <span className="text-white font-bold">RFC 5545 Standart ICS Proxy</span>
            </div>
          </div>
        </section>

        {/* Açık Kaynak & Özgür Kullanım */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-neutral-800/80 pb-2">
            Açık Kaynak & Özgür Kullanım
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Bu proje %100 açık kaynaklıdır (MIT Lisansı). İsteyen tüm geliştiriciler ve taraftarlar kaynak kodları <a href="https://github.com/odininkankasi/besiktas-fikstur" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline font-medium">GitHub Depomuz</a> üzerinden inceleyebilir, klonlayabilir, kendi kulüpleri veya projeleri için dilediği gibi özgürce kullanabilir ve geliştirebilir.
          </p>
        </section>

        {/* İletişim Yönlendirme */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            Sorularınız veya iş birliği için: <Link href="/iletisim" className="text-white hover:text-red-500 underline font-medium ml-1">İletişim & Künye Sayfası</Link>
          </div>
          <Link
            href="/gizlilik"
            className="hover:text-neutral-300 underline underline-offset-4 transition-colors"
          >
            Gizlilik Politikası
          </Link>
        </div>
      </div>
    </main>
  );
}
