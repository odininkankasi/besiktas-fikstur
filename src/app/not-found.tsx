import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Calendar, Trophy } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-950 text-neutral-100 bjk-pattern bjk-grid-overlay relative overflow-hidden">
      {/* Kırmızı Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto drop-shadow-[0_4px_16px_rgba(227,10,23,0.4)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bjk-logo.svg"
            alt="Beşiktaş JK"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Başlık ve Açıklama */}
        <div className="space-y-2">
          <span className="text-xs font-black tracking-widest text-red-500 uppercase px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 inline-block">
            404 • SAYFA BULUNAMADI
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Ofsayta Düştünüz!
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
            Aradığınız sayfa Tüpraş Stadyumu çimlerinde bulunamadı. Fikstür ve maç takvimine dönerek Kara Kartal'ı takip etmeye devam edebilirsiniz.
          </p>
        </div>

        {/* Aksiyon Butonları */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 border border-red-500/30 shadow-lg shadow-red-950/60 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Fikstüre Geri Dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
