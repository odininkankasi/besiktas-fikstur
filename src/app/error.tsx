'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Uygulama hatası:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-950 text-neutral-100 bjk-pattern bjk-grid-overlay relative overflow-hidden">
      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500 shadow-xl shadow-black/60">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black tracking-widest text-red-500 uppercase px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 inline-block">
            BİR HATA OLUŞTU
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Bağlantı Hatası
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
            Maç verileri yüklenirken beklenmeyen bir durum oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 border border-red-500/30 shadow-lg shadow-red-950/60 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Yeniden Dene</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
