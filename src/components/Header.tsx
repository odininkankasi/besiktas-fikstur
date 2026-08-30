'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface HeaderProps {
  onOpenCalendarModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCalendarModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md transition-all">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Sol: Orijinal Resmi Beşiktaş Logosu & Başlık */}
        <div
          onClick={scrollToTop}
          className="flex items-center gap-3 cursor-pointer group select-none min-w-0"
          title="Sayfanın Başına Dön"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bjk-logo.svg"
              alt="Beşiktaş JK Resmi Logosu"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-white uppercase group-hover:text-red-500 transition-colors">
                Beşiktaş
              </h1>
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 group-hover:border-red-500/60 transition-colors">
                1903
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium group-hover:text-neutral-300 transition-colors truncate">
              Kara Kartal Maç Takvimi
            </p>
          </div>
        </div>

        {/* Sağ: Sadece Takvime Ekle Butonu */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenCalendarModal}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 border border-red-500/30 shadow-lg shadow-red-950/50 hover:shadow-red-900/60 transition-all flex items-center gap-2 transform active:scale-95 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Takvime Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
