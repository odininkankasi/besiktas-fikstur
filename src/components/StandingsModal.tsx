'use client';

import React from 'react';
import { X, Trophy, AlertCircle } from 'lucide-react';

export interface StandingRow {
  rank: number;
  teamName: string;
  shortName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  isBjk: boolean;
  qualification?: string;
}

export interface StandingsData {
  success: boolean;
  lastUpdated: string;
  leagueName: string;
  bjkRank: number;
  bjkPoints: number;
  rows: StandingRow[];
}

interface StandingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  standings: StandingsData | null;
  isLoading?: boolean;
}

export const StandingsModal: React.FC<StandingsModalProps> = ({
  isOpen,
  onClose,
  standings,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Başlığı */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Trendyol Süper Lig</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                  Canlı Puan Durumu
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-medium">
                TFF Resmi Puan Cetveli
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tablo İçeriği */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 no-scrollbar">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-neutral-400">Puan durumu yükleniyor...</p>
            </div>
          ) : !standings || !standings.rows || standings.rows.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-neutral-500" />
              <p className="text-sm">Puan tablosu verisi alınamadı.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2 text-center w-8">#</th>
                    <th className="py-2.5 px-2">Takım</th>
                    <th className="py-2.5 px-2 text-center w-8">O</th>
                    <th className="py-2.5 px-2 text-center w-8">G</th>
                    <th className="py-2.5 px-2 text-center w-8">B</th>
                    <th className="py-2.5 px-2 text-center w-8">M</th>
                    <th className="py-2.5 px-2 text-center w-8 hidden sm:table-cell">AG</th>
                    <th className="py-2.5 px-2 text-center w-8 hidden sm:table-cell">YG</th>
                    <th className="py-2.5 px-2 text-center w-9">AV</th>
                    <th className="py-2.5 px-2 text-center w-10 font-black text-white">P</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60 font-medium">
                  {standings.rows.map((row) => (
                    <tr
                      key={row.rank}
                      className={`transition-colors ${
                        row.isBjk
                          ? 'bg-red-950/40 text-white font-bold border-l-4 border-l-red-600'
                          : 'hover:bg-neutral-900/40 text-neutral-300'
                      }`}
                    >
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-neutral-400">
                        {row.rank}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="truncate">{row.teamName}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">{row.played}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-emerald-400">{row.won}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-amber-400">{row.drawn}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-rose-400">{row.lost}</td>
                      <td className="py-2.5 px-2 text-center font-mono hidden sm:table-cell text-neutral-400">{row.goalsFor}</td>
                      <td className="py-2.5 px-2 text-center font-mono hidden sm:table-cell text-neutral-400">{row.goalsAgainst}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">
                        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-black text-white text-sm">
                        {row.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Alt Bilgi */}
        <div className="p-3 sm:p-4 border-t border-neutral-800/80 bg-neutral-900/40 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>Veri Kaynağı: CollectAPI (TFF Resmi)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
