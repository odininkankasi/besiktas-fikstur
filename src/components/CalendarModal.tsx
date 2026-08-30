'use client';

import React, { useState } from 'react';
import { X, Calendar, Check, Copy, ExternalLink, Smartphone, Laptop } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  webcalUrl: string;
  icsUrl: string;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  webcalUrl,
  icsUrl
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(icsUrl || webcalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const googleCalSubscribeUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl shadow-red-950/40">
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Başlığı */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-red-600/20 border border-red-600/30 text-red-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Beşiktaş Fikstürünü Takvime Ekle
            </h3>
            <p className="text-xs text-neutral-400">
              Tüm maçlar otomatik güncellenir ve takviminize işlenir.
            </p>
          </div>
        </div>

        {/* Seçenekler */}
        <div className="space-y-3 my-6">
          {/* iOS / Mac / Apple Calendar Tek Tık */}
          <a
            href={webcalUrl}
            className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                  iPhone & Apple Calendar
                </div>
                <div className="text-xs text-neutral-400">
                  Tek dokunuşla Takvimler uygulamasına abone ol
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white" />
          </a>

          {/* Google Calendar */}
          <a
            href={googleCalSubscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                  Google Takvim
                </div>
                <div className="text-xs text-neutral-400">
                  Google hesabına otomatik olarak ekle
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white" />
          </a>

          {/* Manuel ICS Bağlantısı Kopyala */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Takvim URL (ICS):</span>
              <span className="text-[10px] text-neutral-500 font-mono">webcal / ics</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={icsUrl || webcalUrl}
                className="w-full text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-lg px-2.5 py-1.5 focus:outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bilgilendirme */}
        <div className="text-[11px] text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-3">
          💡 Maç günleri veya saatleri TFF veya UEFA tarafından değiştirildiğinde takviminiz arka planda otomatik olarak güncellenecektir.
        </div>
      </div>
    </div>
  );
};
