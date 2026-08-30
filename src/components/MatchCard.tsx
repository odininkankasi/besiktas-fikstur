'use client';

import React, { useState } from 'react';
import { Match } from '@/lib/types';
import { getTeamBadgeInfo, formatDateTurkish, TeamBadge } from '@/lib/utils';
import { MapPin, Trophy, CheckCircle2, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

const TeamLogoView: React.FC<{ badge: TeamBadge; teamName: string; size?: string }> = ({
  badge,
  teamName,
  size = 'w-9 h-9 sm:w-11 sm:h-11'
}) => {
  const [imgError, setImgError] = useState(false);

  if (badge.logoUrl && !imgError) {
    return (
      <div className={`${size} rounded-xl bg-neutral-900/90 p-1.5 flex items-center justify-center shrink-0 shadow-md border border-neutral-800/80`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badge.logoUrl}
          alt={teamName}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain drop-shadow"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`${size} rounded-xl bg-gradient-to-br ${badge.bgGradient} flex items-center justify-center shrink-0 shadow-md border border-white/10`}
    >
      <span className={`text-xs sm:text-sm font-black ${badge.textColor}`}>
        {badge.shortName}
      </span>
    </div>
  );
};

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const homeBadge = getTeamBadgeInfo(match.homeTeam);
  const awayBadge = getTeamBadgeInfo(match.awayTeam);
  const { dateFormatted, timeFormatted } = formatDateTurkish(match.startTime);

  const isWin = match.bjkResult === 'win';
  const isLoss = match.bjkResult === 'loss';
  const isDraw = match.bjkResult === 'draw';

  return (
    <div className="group relative rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-700/80 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/50">
      {/* Sol Kenar Durum Çizgisi */}
      {match.isFinished ? (
        <div
          className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${
            isWin ? 'bg-emerald-500' : isLoss ? 'bg-red-600' : 'bg-amber-500'
          }`}
        />
      ) : (
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-neutral-700" />
      )}

      {/* Üst Bilgi: Turnuva & Tarih */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-800/60 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-400 font-medium truncate">
          <Trophy className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">{match.competition}</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400 shrink-0">
          <span>{dateFormatted}</span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-white font-bold">
            {timeFormatted}
          </span>
        </div>
      </div>

      {/* Maç Ortası: Ev Sahibi vs Deplasman */}
      <div className="grid grid-cols-12 items-center gap-2 sm:gap-4 my-1">
        {/* Ev Sahibi */}
        <div className="col-span-5 flex items-center gap-2.5 sm:gap-3">
          <TeamLogoView badge={homeBadge} teamName={match.homeTeam} />
          <div className="min-w-0">
            <h4
              className={`text-xs sm:text-sm font-bold truncate ${
                match.bjkIsHome ? 'text-white font-black' : 'text-neutral-300'
              }`}
            >
              {match.homeTeam}
            </h4>
          </div>
        </div>

        {/* Skor / VS */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          {match.isFinished ? (
            <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-black px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-white shadow-inner">
              <span>{match.homeScore ?? '-'}</span>
              <span className="text-neutral-500">:</span>
              <span>{match.awayScore ?? '-'}</span>
            </div>
          ) : (
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800">
              VS
            </span>
          )}

          {match.isFinished && (
            <span
              className={`text-[9px] font-extrabold uppercase tracking-wider mt-1 px-1.5 py-0.2 rounded ${
                isWin
                  ? 'text-emerald-400 bg-emerald-950/40'
                  : isLoss
                  ? 'text-red-400 bg-red-950/40'
                  : 'text-amber-400 bg-amber-950/40'
              }`}
            >
              {isWin ? 'GALİBİYET' : isLoss ? 'MAĞLUBİYET' : 'BERABERLİK'}
            </span>
          )}
        </div>

        {/* Deplasman */}
        <div className="col-span-5 flex items-center justify-end gap-2.5 sm:gap-3 text-right">
          <div className="min-w-0">
            <h4
              className={`text-xs sm:text-sm font-bold truncate ${
                !match.bjkIsHome ? 'text-white font-black' : 'text-neutral-300'
              }`}
            >
              {match.awayTeam}
            </h4>
          </div>
          <TeamLogoView badge={awayBadge} teamName={match.awayTeam} />
        </div>
      </div>

      {/* Alt Bilgi: Stadyum & Şehir */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-800/40 text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span className="truncate">
            {match.stadiumName}
            {match.city && ` • ${match.city}`}
          </span>
        </div>

        <div>
          {match.isFinished ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Oynandı</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>Bekleniyor</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
