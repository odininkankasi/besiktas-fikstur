'use client';

import React from 'react';
import { SeasonStats } from '@/lib/types';
import { CheckCircle2, MinusCircle, XCircle, Activity } from 'lucide-react';

interface SeasonStatsBannerProps {
  stats: SeasonStats | null;
  selectedCompetitionTitle?: string;
}

export const SeasonStatsBanner: React.FC<SeasonStatsBannerProps> = ({
  stats,
  selectedCompetitionTitle = '2026/2027 Sezonu Genel Performansı'
}) => {
  if (!stats) return null;

  const goalDiff = stats.goalsScored - stats.goalsConceded;
  const isPositiveDiff = goalDiff >= 0;

  return (
    <section className="w-full space-y-2">
      {/* Şerit Üst Başlığı & Sezon Etiketi */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Activity className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <h2 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-300">
            {selectedCompetitionTitle}
          </h2>
        </div>
        <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800">
          Canlı Sezon Verisi
        </span>
      </div>

      {/* İstatistik Kutucukları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {/* Toplam Oynanan */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col items-center justify-center text-center shadow-md">
          <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            OYNANAN
          </span>
          <span className="text-lg sm:text-2xl font-black text-white font-mono mt-0.5">
            {stats.totalPlayed}
          </span>
        </div>

        {/* Galibiyet */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/60 border border-emerald-950/40 flex flex-col items-center justify-center text-center shadow-md">
          <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            GALİBİYET
          </span>
          <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">
            {stats.wins}
          </span>
        </div>

        {/* Beraberlik */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/60 border border-amber-950/40 flex flex-col items-center justify-center text-center shadow-md">
          <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <MinusCircle className="w-3 h-3" />
            BERABERLİK
          </span>
          <span className="text-lg sm:text-2xl font-black text-amber-400 font-mono mt-0.5">
            {stats.draws}
          </span>
        </div>

        {/* Mağlubiyet */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/60 border border-red-950/40 flex flex-col items-center justify-center text-center shadow-md">
          <span className="text-[9px] sm:text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            MAĞLUBİYET
          </span>
          <span className="text-lg sm:text-2xl font-black text-red-500 font-mono mt-0.5">
            {stats.losses}
          </span>
        </div>

        {/* Atılan Gol */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col items-center justify-center text-center shadow-md">
          <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            ATILAN GOL
          </span>
          <span className="text-lg sm:text-2xl font-black text-white font-mono mt-0.5">
            {stats.goalsScored}
          </span>
        </div>

        {/* Yenilen Gol */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col items-center justify-center text-center shadow-md">
          <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            YENİLEN GOL
          </span>
          <span className="text-lg sm:text-2xl font-black text-neutral-300 font-mono mt-0.5">
            {stats.goalsConceded}
          </span>
        </div>

        {/* Gol Averajı */}
        <div className="col-span-2 sm:col-span-4 md:col-span-1 p-2.5 sm:p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col items-center justify-center text-center shadow-md">
          <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            AVERAJ
          </span>
          <span className={`text-lg sm:text-2xl font-black font-mono mt-0.5 ${isPositiveDiff ? 'text-emerald-400' : 'text-red-500'}`}>
            {isPositiveDiff ? `+${goalDiff}` : goalDiff}
          </span>
        </div>
      </div>
    </section>
  );
};
