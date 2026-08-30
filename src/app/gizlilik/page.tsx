import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { ProtectedEmail } from '@/components/ProtectedEmail';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası & Kullanım Şartları',
  description: 'bjk.8080.tr gizlilik politikası, veri güvenliği, çerez bildirimi ve kullanım şartları.'
};

export default function GizlilikPage() {
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

      {/* İçerik Alanı */}
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-10">
        {/* Başlık */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>GİZLİLİK & GÜVENLİK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Gizlilik Politikası & Kullanım Şartları
          </h1>
          <p className="text-sm text-neutral-400 font-mono">
            Son Güncelleme: 2026 Sezonu
          </p>
        </div>

        {/* Yasal Bildirim */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3.5 text-neutral-300 text-sm">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-neutral-300 text-sm leading-relaxed">
            &quot;Bu site bağımsız bir taraftar projesidir. Beşiktaş JK ile resmi bir bağı bulunmamaktadır.&quot;
          </p>
        </div>

        {/* 1. Veri Toplama */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            1. Kişisel Veri Toplanmaması
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            <strong className="text-white">bjk.8080.tr</strong>, ziyaretçilerinden ad, soyad, telefon veya konum gibi hiçbir kişisel veriyi toplamaz, işlemez ve depolamaz. Platformda kullanıcı hesabı, üyelik veya profil oluşturma zorunluluğu bulunmamaktadır.
          </p>
        </section>

        {/* 2. Reklam & Üçüncü Taraf Takipçiler */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            2. Reklamsız Deneyim & Takipçiler
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Sitemizde üçüncü taraf reklam ağları, rahatsız edici pop-up pencereler veya kullanıcı davranışlarını profillemeye yönelik izleme kodları (tracker) yer almamaktadır.
          </p>
        </section>

        {/* 3. Takvim Senkronizasyonu */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            3. Takvim (.ICS / Webcal) Senkronizasyonu
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Takvim aboneliği özelliği (<code className="text-red-400 bg-neutral-900 px-1 py-0.5 rounded">/api/calendar.ics</code>), cihazınızın takvim uygulamasına sadece halka açık maç tarihlerini iletir. Telefonunuzun veya takviminizin içeriğine kesinlikle erişim sağlamaz.
          </p>
        </section>

        {/* 4. Çerezler */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            4. Çerez (Cookie) Kullanımı
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Sitemiz yalnızca temel web performansını ve açık/koyu tema gibi teknik tercihleri optimize etmek için minimum düzeyde teknik çerezler kullanabilir. Pazarlama çerezi kullanılmaz.
          </p>
        </section>

        {/* 5. İletişim */}
        <section className="space-y-4 pt-4 border-t border-neutral-800">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            5. İletişim & Hak Talepleri
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Gizlilik politikamızla ilgili soru ve talepleriniz için korumalı e-posta adresimiz:
          </p>
          <ProtectedEmail />
        </section>

        <div className="pt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <Link href="/iletisim" className="hover:text-white underline">
            İletişim & Künye Sayfası
          </Link>
          <Link href="/" className="hover:text-white underline">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
