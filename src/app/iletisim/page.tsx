import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ProtectedEmail } from '@/components/ProtectedEmail';
import { ArrowLeft, ShieldAlert, Sparkles, Send, Calendar, Trophy, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'İletişim & Künye',
  description: 'Beşiktaş Fikstür projesi iletişim bilgileri, künye, proje amacı ve yasal bildirimler.'
};

export default function IletisimPage() {
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
            <span>TARAFTAR PROJESİ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            İletişim & Künye
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
            Beşiktaş fikstür ve takvim senkronizasyon platformu hakkında bilgiler, iletişim kanalı ve yasal beyanlar.
          </p>
        </div>

        {/* Yasal Uyarı & Feragatname Vurgusu */}
        <div className="p-4 sm:p-5 rounded-2xl bg-red-950/30 border border-red-900/50 flex items-start gap-3.5 text-neutral-300 text-sm">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-bold text-white text-xs uppercase tracking-wider text-red-400">
              Önemli Yasal Bildirim
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              &quot;Bu site bağımsız bir taraftar projesidir. Beşiktaş JK ile resmi bir bağı bulunmamaktadır.&quot;
            </p>
          </div>
        </div>

        {/* Projenin Amacı (Editoryal Açık Metin) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-neutral-800/80 pb-2">
            Projenin Amacı
          </h2>
          <div className="text-neutral-300 space-y-4 text-sm sm:text-base leading-relaxed">
            <p>
              <strong className="text-white font-semibold">bjk.8080.tr</strong>, Kara Kartal sevdalılarının maç günlerini, başlama saatlerini, stadyum konumlarını ve canlı puan durumunu en hızlı, reklamsız ve modern bir deneyimle takip edebilmesi için hayata geçirilmiştir.
            </p>
            <p>
              Platform; Trendyol Süper Lig, UEFA Avrupa Ligi ve Ziraat Türkiye Kupası karşılaşmalarını tek dokunuşla Apple Takvim, Google Takvim veya Outlook takvimlerine ekleme imkanı sunarak taraftarların hiçbir karşılaşmayı kaçırmamasını hedefler.
            </p>
          </div>
        </section>

        {/* Künye & Bilgiler */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-neutral-800/80 pb-2">
            Künye & Altyapı
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Yayın Adresi</span>
              <span className="text-white font-mono font-medium">https://bjk.8080.tr</span>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Yayın Türü</span>
              <span className="text-neutral-200">Bağımsız Taraftar Bilgilendirme Platformu</span>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Fikstür & Takvim Kaynağı</span>
              <span className="text-neutral-200">FotMob Canlı ICS Takvim Akışı</span>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Puan Durumu Servisi</span>
              <span className="text-neutral-200">CollectAPI Spor Veri Servisi</span>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Yazılım Altyapısı</span>
              <span className="text-neutral-200">Next.js 16 (App Router) & TypeScript</span>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Reklam & Ticari Durum</span>
              <span className="text-emerald-400 font-semibold">Tamamen Reklamsız & Ücretsiz</span>
            </div>
          </div>
        </section>

        {/* İletişim Alanı */}
        <section className="space-y-4 pt-2">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase border-b border-neutral-800/80 pb-2 flex items-center gap-2">
            <Send className="w-4 h-4 text-red-500" />
            <span>İletişim</span>
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Görüş, öneri, hata bildirimi veya iş birliği talepleriniz için aşağıdaki korumalı e-posta adresi üzerinden bizimle irtibata geçebilirsiniz:
          </p>

          <div className="pt-2">
            <ProtectedEmail />
          </div>
        </section>

        {/* Alt Dönüş Butonu */}
        <div className="pt-8 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
          <Link
            href="/gizlilik"
            className="hover:text-neutral-300 underline underline-offset-4 transition-colors"
          >
            Gizlilik Politikası ve Kullanım Koşulları
          </Link>
          <span>© 2026 bjk.8080.tr</span>
        </div>
      </div>
    </main>
  );
}
