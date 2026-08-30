'use client';

import React, { useState, useEffect } from 'react';
import { LeagueStandings } from '@/lib/types';
import { getTeamBadgeInfo } from '@/lib/utils';
import { X, Trophy, Globe } from 'lucide-react';

interface StandingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLeague?: string;
  superLig: LeagueStandings | null;
  europaLeague: LeagueStandings | null;
}

export const StandingsModal: React.FC<StandingsModalProps> = ({
  isOpen,
  onClose,
  initialLeague = 'super-lig',
  superLig,
  europaLeague
}) => {
  const [activeTab, setActiveTab] = useState<'super-lig' | 'europa-league'>(
    initialLeague === 'europa-league' ? 'europa-league' : 'super-lig'
  );

  // Prop her değiştiğinde veya modal açıldığında istenen sekmeyi seç
  useEffect(() => {
    if (initialLeague === 'europa-league' || initialLeague === 'europe') {
      setActiveTab('europa-league');
    } else {
      setActiveTab('super-lig');
    }
  }, [initialLeague, isOpen]);

  if (!isOpen) return null;

  const currentStandings = activeTab === 'super-lig' ? superLig : europaLeague;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl shadow-red-950/40 overflow-hidden">
        {/* Modal Başlığı */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-600/30 text-red-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                Canlı Puan Durumu
              </h3>
              <p className="text-xs text-neutral-400">
                Sezon 2026/2027 • {activeTab === 'super-lig' ? 'Trendyol Süper Lig' : 'UEFA Avrupa Ligi'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Turnuva Sekmeleri */}
        <div className="p-3 bg-neutral-900/40 border-b border-neutral-800/60 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('super-lig')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'super-lig' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Trendyol Süper Lig</span>
          </button>

          <button
            onClick={() => setActiveTab('europa-league')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'europa-league' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>UEFA Avrupa Ligi</span>
          </button>
        </div>

        {/* Tablo İçeriği (Kaydırılabilir) */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-2 text-center w-8">#</th>
                  <th className="py-2.5 px-3">TAKIM</th>
                  <th className="py-2.5 px-2 text-center">O</th>
                  <th className="py-2.5 px-2 text-center">G</th>
                  <th className="py-2.5 px-2 text-center">B</th>
                  <th className="py-2.5 px-2 text-center">M</th>
                  <th className="py-2.5 px-2 text-center hidden sm:table-cell">AG</th>
                  <th className="py-2.5 px-2 text-center hidden sm:table-cell">YG</th>
                  <th className="py-2.5 px-2 text-center">AV</th>
                  <th className="py-2.5 px-3 text-center font-black text-white">P</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {currentStandings?.rows.map((row) => {
                  const badge = getTeamBadgeInfo(row.teamName);
                  const isBjk = row.isBjk;

                  return (
                    <tr
                      key={row.rank}
                      className={`transition-colors font-medium ${isBjk ? 'bg-red-950/40 hover:bg-red-950/60 font-bold border-l-4 border-l-red-600' : 'hover:bg-neutral-900/50'}`}
                    >
                      {/* Sıra & Eleme Rengi Çizgisi */}
                      <td className="py-3 px-2 text-center font-mono">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-bold ${row.rank <= 2 ? 'text-amber-400 font-black' : row.rank <= 4 ? 'text-blue-400' : row.rank >= 16 ? 'text-rose-500' : 'text-neutral-400'}`}>
                          {row.rank}
                        </span>
                      </td>

                      {/* Takım Bilgisi */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {badge.logoUrl ? (
                            <div className="w-5 h-5 rounded bg-neutral-900/90 p-0.5 border border-neutral-800 flex items-center justify-center shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={badge.logoUrl}
                                alt={row.teamName}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded bg-gradient-to-br ${badge.bgGradient} border ${badge.borderColor} flex items-center justify-center text-[8px] font-black ${badge.textColor} shrink-0`}>
                              {badge.shortName}
                            </div>
                          )}
                          <span className={`truncate max-w-[140px] sm:max-w-[200px] ${isBjk ? 'text-white font-black' : 'text-neutral-200'}`}>
                            {row.teamName}
                          </span>
                        </div>
                      </td>

                      {/* O, G, B, M */}
                      <td className="py-3 px-2 text-center text-neutral-300 font-mono">{row.played}</td>
                      <td className="py-3 px-2 text-center text-neutral-300 font-mono">{row.won}</td>
                      <td className="py-3 px-2 text-center text-neutral-400 font-mono">{row.drawn}</td>
                      <td className="py-3 px-2 text-center text-neutral-400 font-mono">{row.lost}</td>

                      {/* AG, YG */}
                      <td className="py-3 px-2 text-center text-neutral-500 font-mono hidden sm:table-cell">{row.goalsFor}</td>
                      <td className="py-3 px-2 text-center text-neutral-500 font-mono hidden sm:table-cell">{row.goalsAgainst}</td>

                      {/* Averaj */}
                      <td className={`py-3 px-2 text-center font-mono font-semibold ${row.goalDiff > 0 ? 'text-emerald-400' : row.goalDiff < 0 ? 'text-rose-400' : 'text-neutral-400'}`}>
                        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                      </td>

                      {/* Puan */}
                      <td className="py-3 px-3 text-center font-black text-sm font-mono text-white">
                        <span className={isBjk ? 'text-red-400 font-extrabold text-base' : ''}>
                          {row.points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alt Açıklama / Legend */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-900/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Şampiyonlar Ligi / Doğrudan Tur</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Avrupa Ligi / Play-off</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Küme Düşme Hattı</span>
            </span>
          </div>

          <div className="font-mono text-neutral-500 text-[10px]">
            TFF / UEFA Resmi Verileri
          </div>
        </div>
      </div>
    </div>
  );
};
