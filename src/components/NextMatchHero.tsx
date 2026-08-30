'use client';

import React, { useState, useEffect } from 'react';
import { Match } from '@/lib/types';
import { getTeamBadgeInfo, formatDateTurkish, TeamBadge } from '@/lib/utils';
import { MapPin, Calendar, Flame } from 'lucide-react';

interface NextMatchHeroProps {
  match: Match | null;
  onOpenCalendarModal: () => void;
}

const HeroLogoView: React.FC<{ badge: TeamBadge; teamName: string }> = ({ badge, teamName }) => {
  const [imgError, setImgError] = useState(false);

  if (badge.logoUrl && !imgError) {
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-neutral-900/90 p-2 sm:p-3 flex items-center justify-center shadow-2xl shadow-black/80 border border-neutral-800/80 group-hover:scale-105 transition-transform duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badge.logoUrl}
          alt={teamName}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        />
      </div>
    );
  }

  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${badge.bgGradient} flex items-center justify-center shadow-xl shadow-black/60 border border-white/10 group-hover:scale-105 transition-transform duration-300`}
    >
      <span className={`text-base sm:text-xl md:text-2xl font-black ${badge.textColor} tracking-tight`}>
        {badge.shortName}
      </span>
    </div>
  );
};

export const NextMatchHero: React.FC<NextMatchHeroProps> = ({
  match,
  onOpenCalendarModal
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!match || !match.startTime) return;

    const calculateTimeLeft = () => {
      const matchDate = new Date(match.startTime).getTime();
      const now = new Date().getTime();
      const difference = matchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [match]);

  if (!match) return null;

  const homeBadge = getTeamBadgeInfo(match.homeTeam);
  const awayBadge = getTeamBadgeInfo(match.awayTeam);
  const { dateFormatted, timeFormatted } = formatDateTurkish(match.startTime);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-800/80 bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-neutral-950 shadow-2xl shadow-red-950/20 backdrop-blur-sm">
      {/* Ambient Kırmızı Işık */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-red-600/20 blur-[90px] pointer-events-none rounded-full" />

      {/* Üst Şerit: Lig / Kategori */}
      <div className="relative px-4 sm:px-6 py-3 sm:py-3.5 border-b border-neutral-800/60 flex items-center justify-between bg-neutral-900/40 text-xs sm:text-sm">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs shrink-0">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            SIRADAKİ MAÇ
          </span>
          <span className="text-neutral-400 font-medium hidden sm:inline">•</span>
          <span className="text-neutral-200 font-bold truncate text-xs sm:text-sm">
            {match.competition}
          </span>
        </div>

        <div className="text-neutral-300 text-xs sm:text-sm font-mono font-semibold flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span className="hidden sm:inline">{dateFormatted}</span>
          <span className="text-white font-bold px-2 py-0.5 rounded-lg bg-neutral-800 text-xs sm:text-sm">
            {timeFormatted}
          </span>
        </div>
      </div>

      {/* Maç Kartı Ana Gövde */}
      <div className="relative p-4 sm:p-6 md:p-8">
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 md:gap-6">
          {/* Ev Sahibi */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0">
            <HeroLogoView badge={homeBadge} teamName={match.homeTeam} />
            <h3 className="mt-2.5 sm:mt-3.5 text-sm sm:text-base md:text-xl font-black text-white tracking-wide truncate w-full" title={match.homeTeam}>
              {match.homeTeam}
            </h3>
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:block mt-0.5">
              {match.bjkIsHome ? 'KARA KARTAL' : 'EV SAHİBİ'}
            </span>
          </div>

          {/* Orta Alan: VS & Geri Sayım */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 shrink-0">
            <div className="px-3 py-0.5 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-[10px] sm:text-xs font-black tracking-widest text-neutral-300 uppercase mb-2.5 sm:mb-3.5">
              VS
            </div>

            {/* Canlı Geri Sayım */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 text-center">
              <div className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 min-w-[40px] sm:min-w-[52px] md:min-w-[60px]">
                <span className="block text-sm sm:text-lg md:text-2xl font-black text-white font-mono leading-none">
                  {timeLeft.days}
                </span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-neutral-400 uppercase font-bold mt-0.5 block">
                  GÜN
                </span>
              </div>
              <div className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 min-w-[40px] sm:min-w-[52px] md:min-w-[60px]">
                <span className="block text-sm sm:text-lg md:text-2xl font-black text-white font-mono leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-neutral-400 uppercase font-bold mt-0.5 block">
                  SAAT
                </span>
              </div>
              <div className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 min-w-[40px] sm:min-w-[52px] md:min-w-[60px]">
                <span className="block text-sm sm:text-lg md:text-2xl font-black text-white font-mono leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-neutral-400 uppercase font-bold mt-0.5 block">
                  DK
                </span>
              </div>
              <div className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2.5 rounded-xl bg-red-950/40 border border-red-800/40 min-w-[40px] sm:min-w-[52px] md:min-w-[60px]">
                <span className="block text-sm sm:text-lg md:text-2xl font-black text-red-500 font-mono leading-none animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-red-400 uppercase font-bold mt-0.5 block">
                  SN
                </span>
              </div>
            </div>
          </div>

          {/* Deplasman */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0">
            <HeroLogoView badge={awayBadge} teamName={match.awayTeam} />
            <h3 className="mt-2.5 sm:mt-3.5 text-sm sm:text-base md:text-xl font-black text-white tracking-wide truncate w-full" title={match.awayTeam}>
              {match.awayTeam}
            </h3>
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:block mt-0.5">
              {!match.bjkIsHome ? 'KARA KARTAL' : 'DEPLASMAN'}
            </span>
          </div>
        </div>

        {/* Alt Detaylar (Stadyum, Şehir & Takvime Ekle) */}
        <div className="mt-5 sm:mt-7 pt-3.5 sm:pt-5 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-neutral-300">
          <div className="flex items-center gap-2 truncate max-w-full">
            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
            <span className="font-semibold truncate text-xs sm:text-sm">
              {match.stadiumName}
              {match.city && <span className="text-neutral-400"> • {match.city}</span>}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCalendarModal}
              className="px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 transition-all flex items-center gap-2 shadow"
            >
              <Calendar className="w-4 h-4 text-red-500" />
              <span>Takvime Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
