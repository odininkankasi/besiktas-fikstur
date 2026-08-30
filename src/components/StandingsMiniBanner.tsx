'use client';

import React from 'react';
import { LeagueStandings } from '@/lib/types';
import { Trophy, ChevronRight, Globe } from 'lucide-react';

interface StandingsMiniBannerProps {
  superLig: LeagueStandings | null;
  europaLeague: LeagueStandings | null;
  onOpenFullStandings: (leagueId?: string) => void;
}

export const StandingsMiniBanner: React.FC<StandingsMiniBannerProps> = ({
  superLig,
  europaLeague,
  onOpenFullStandings
}) => {
  const bjkSuperLig = superLig?.rows.find(r => r.isBjk);
  const bjkEuropa = europaLeague?.rows.find(r => r.isBjk);

  const europaPlayed = bjkEuropa?.played ?? 0;
  const europaPoints = bjkEuropa?.points ?? 0;

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Süper Lig Mini Kartı */}
        <div
          onClick={() => onOpenFullStandings('super-lig')}
          className="group cursor-pointer p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-red-900/60 transition-all flex items-center justify-between shadow-lg shadow-black/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Trendyol Süper Lig</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5 flex items-center gap-2">
                <span>Beşiktaş:</span>
                <span className="text-base font-black text-red-500 font-mono">
                  {bjkSuperLig ? `${bjkSuperLig.rank}. Sırada` : '13. Sırada'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="text-lg font-black text-white font-mono leading-none">
                {bjkSuperLig ? bjkSuperLig.points : 3} <span className="text-xs text-neutral-400 font-normal">Puan</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                {bjkSuperLig ? `${bjkSuperLig.played} Maç • ${bjkSuperLig.goalDiff >= 0 ? `+${bjkSuperLig.goalDiff}` : bjkSuperLig.goalDiff} AV` : '2 Maç • 0 AV'}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* UEFA Avrupa Ligi Mini Kartı */}
        <div
          onClick={() => onOpenFullStandings('europa-league')}
          className="group cursor-pointer p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-amber-900/60 transition-all flex items-center justify-between shadow-lg shadow-black/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>UEFA Avrupa Ligi</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5 flex items-center gap-2">
                <span>Beşiktaş:</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {europaPlayed > 0 && bjkEuropa ? `${bjkEuropa.rank}. Sırada` : 'Lig Aşaması'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="text-lg font-black text-white font-mono leading-none">
                {europaPoints} <span className="text-xs text-neutral-400 font-normal">Puan</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                {europaPlayed > 0 ? `${europaPlayed} Maç` : 'Yakında Başlayacak'}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </section>
  );
};
