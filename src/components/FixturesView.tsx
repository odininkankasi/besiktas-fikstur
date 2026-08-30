'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { NextMatchHero } from '@/components/NextMatchHero';
import { SeasonStatsBanner } from '@/components/SeasonStatsBanner';
import { MatchCard } from '@/components/MatchCard';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Match, SeasonStats } from '@/lib/types';
import { StandingsData } from '@/components/StandingsModal';
import { Search, Trophy, CheckCircle2, Flame, ChevronRight } from 'lucide-react';

const StandingsModal = dynamic(() => import('@/components/StandingsModal').then((mod) => mod.StandingsModal), {
  ssr: false,
});

const CalendarModal = dynamic(() => import('@/components/CalendarModal').then((mod) => mod.CalendarModal), {
  ssr: false,
});

interface FixturesViewProps {
  initialFixtures: Match[];
  initialStats: SeasonStats | null;
  initialNextMatch: Match | null;
  initialStandings: StandingsData | null;
}

export const FixturesView: React.FC<FixturesViewProps> = ({
  initialFixtures,
  initialStats,
  initialNextMatch,
  initialStandings,
}) => {
  const [fixtures] = useState<Match[]>(initialFixtures);
  const [stats] = useState<SeasonStats | null>(initialStats);
  const [nextMatch] = useState<Match | null>(initialNextMatch);
  const [standings, setStandings] = useState<StandingsData | null>(initialStandings);

  const [standingsLoading, setStandingsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'finished' | 'all'>('upcoming');

  // Modallar
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isStandingsModalOpen, setIsStandingsModalOpen] = useState(false);

  const handleOpenStandings = async () => {
    setIsStandingsModalOpen(true);
    if (!standings) {
      setStandingsLoading(true);
      try {
        const res = await fetch('/bjk-standings.json');
        if (res.ok) {
          const sJson = await res.json();
          if (sJson.success) setStandings(sJson);
        }
      } catch (e) {
        console.error('Puan durumu yüklenemedi:', e);
      } finally {
        setStandingsLoading(false);
      }
    }
  };

  // Filtreleme ve Arama
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((match: any) => {
      // Tab filtreleme
      if (activeTab === 'upcoming' && match.isFinished) return false;
      if (activeTab === 'finished' && !match.isFinished) return false;

      const code = match.competitionCode || match.competitionId || 'super-lig';

      // Turnuva filtreleme
      if (selectedCompetition !== 'all') {
        if (selectedCompetition === 'super-lig' && code !== 'super-lig') return false;
        if (selectedCompetition === 'europe' && code !== 'europe') return false;
        if (selectedCompetition === 'cup' && code !== 'cup' && code !== 'turkiye-kupasi') return false;
      }

      // Arama filtreleme
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const opponent = match.bjkIsHome ? match.awayTeam : match.homeTeam;
        const matchesQuery =
          (opponent && opponent.toLowerCase().includes(q)) ||
          (match.stadiumName && match.stadiumName.toLowerCase().includes(q)) ||
          (match.location && match.location.toLowerCase().includes(q)) ||
          (match.competition && match.competition.toLowerCase().includes(q)) ||
          (match.city && match.city.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [fixtures, activeTab, selectedCompetition, searchQuery]);

  // Turnuva Seçenekleri
  const competitions = useMemo(() => {
    const counts = { all: fixtures.length, 'super-lig': 0, europe: 0, cup: 0 };
    fixtures.forEach((f: any) => {
      const code = f.competitionCode || f.competitionId || 'super-lig';
      if (code === 'super-lig') counts['super-lig']++;
      else if (code === 'europe') counts['europe']++;
      else if (code === 'cup' || code === 'turkiye-kupasi') counts['cup']++;
    });
    return counts;
  }, [fixtures]);

  // Seçili Turnuvaya Göre Canlı Performans İstatistikleri
  const activeStats = useMemo(() => {
    let played = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let scored = 0;
    let conceded = 0;
    let upcoming = 0;

    fixtures.forEach((m: any) => {
      const code = m.competitionCode || m.competitionId || 'super-lig';

      if (selectedCompetition !== 'all') {
        if (selectedCompetition === 'super-lig' && code !== 'super-lig') return;
        if (selectedCompetition === 'europe' && code !== 'europe') return;
        if (selectedCompetition === 'cup' && code !== 'cup' && code !== 'turkiye-kupasi') return;
      }

      if (m.isFinished && m.score) {
        played++;
        const parts = m.score.split('-').map(Number);
        const bjk = m.bjkIsHome ? parts[0] : parts[1];
        const opp = m.bjkIsHome ? parts[1] : parts[0];

        if (!isNaN(bjk) && !isNaN(opp)) {
          scored += bjk;
          conceded += opp;
          if (bjk > opp) wins++;
          else if (bjk === opp) draws++;
          else losses++;
        }
      } else if (!m.isFinished) {
        upcoming++;
      }
    });

    return {
      totalPlayed: played,
      wins,
      draws,
      losses,
      goalsScored: scored,
      goalsConceded: conceded,
      goalDifference: scored - conceded,
      upcomingCount: upcoming
    };
  }, [fixtures, selectedCompetition]);

  const competitionTitle = useMemo(() => {
    if (selectedCompetition === 'super-lig') return '2026/2027 Trendyol Süper Lig Performansı';
    if (selectedCompetition === 'europe') return '2026/2027 UEFA Avrupa Ligi Performansı';
    if (selectedCompetition === 'cup') return '2026/2027 Ziraat Türkiye Kupası Performansı';
    return '2026/2027 Sezonu Genel Performansı (Tüm Kulvarlar)';
  }, [selectedCompetition]);

  return (
    <div className="min-h-screen flex flex-col bjk-pattern bjk-grid-overlay text-neutral-100">
      {/* Üst Başlık */}
      <Header
        onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full space-y-6">
        {/* 1. Sıradaki Maç Geri Sayım Hero Alanı */}
        <NextMatchHero
          match={nextMatch}
          onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
        />

        {/* 2. Sıradaki Maçın Hemen Altındaki Bağımsız Puan Durumu Butonu */}
        <div className="w-full">
          <button
            onClick={handleOpenStandings}
            className="w-full group p-3.5 sm:p-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center justify-between shadow-lg shadow-black/40 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Trendyol Süper Lig Puan Durumu</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold hidden sm:inline">
                    Canlı Tablo
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 truncate">
                  TFF resmi 18 takımlı puan cetveli ve sıralamalar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 group-hover:text-amber-400 transition-colors shrink-0">
              <span className="hidden sm:inline">Tabloyu Gör</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* 3. Sezon İstatistikleri Şeridi */}
        <SeasonStatsBanner
          stats={activeStats}
          selectedCompetitionTitle={competitionTitle}
        />

        {/* 4. Filtreleme, Sekmeler ve Arama */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="p-1 sm:p-1.5 bg-neutral-950/90 rounded-2xl border border-neutral-800/80 grid grid-cols-3 sm:flex items-center shadow-lg w-full sm:w-auto gap-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap min-w-0 ${
                  activeTab === 'upcoming'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Gelecek</span>
                {stats && (
                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-black/40 text-white/90 font-mono shrink-0">
                    {stats.upcomingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('finished')}
                className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap min-w-0 ${
                  activeTab === 'finished'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Biten</span>
                {stats && (
                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-black/40 text-white/90 font-mono shrink-0">
                    {stats.totalPlayed}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap min-w-0 ${
                  activeTab === 'all'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="truncate">Tümü</span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-black/40 text-white/90 font-mono shrink-0">
                  {fixtures.length}
                </span>
              </button>
            </div>

            {/* Arama Kutusu */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Takım veya stadyum ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Turnuva Filtre Butonları */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar">
            <button
              onClick={() => setSelectedCompetition('all')}
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all text-xs sm:text-sm ${
                selectedCompetition === 'all'
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'bg-neutral-950/60 text-neutral-400 border border-neutral-800/80 hover:text-neutral-200'
              }`}
            >
              Tümü ({competitions.all})
            </button>
            <button
              onClick={() => setSelectedCompetition('super-lig')}
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 text-xs sm:text-sm ${
                selectedCompetition === 'super-lig'
                  ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                  : 'bg-neutral-950/60 text-neutral-400 border border-neutral-800/80 hover:text-neutral-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-red-500" />
              <span>Süper Lig ({competitions['super-lig']})</span>
            </button>
            <button
              onClick={() => setSelectedCompetition('europe')}
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 text-xs sm:text-sm ${
                selectedCompetition === 'europe'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'bg-neutral-950/60 text-neutral-400 border border-neutral-800/80 hover:text-neutral-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-blue-400" />
              <span>Avrupa ({competitions.europe})</span>
            </button>
          </div>
        </div>

        {/* 5. Fikstür Listesi */}
        <div className="space-y-3 pt-1">
          {filteredFixtures.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-neutral-950/60 border border-neutral-800/60 p-6">
              <p className="text-sm font-semibold text-neutral-300">Aradığınız kriterlere uygun maç bulunamadı.</p>
              <p className="text-xs text-neutral-400 mt-1">Arama kelimesini değiştirebilir veya filtreleri sıfırlayabilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredFixtures.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bağımsız Canlı Süper Lig Puan Durumu Modalı */}
      <StandingsModal
        isOpen={isStandingsModalOpen}
        onClose={() => setIsStandingsModalOpen(false)}
        standings={standings}
        isLoading={standingsLoading}
      />

      {/* Takvim Senkronizasyon Modalı */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        webcalUrl="webcal://bjk.8080.tr/besiktas-fikstur.ics"
        icsUrl="/besiktas-fikstur.ics"
      />

      {/* Yukarı Çık Yüzen Butonu */}
      <ScrollToTopButton />

      {/* Alt Bilgi (Footer) */}
      <footer className="w-full border-t border-neutral-800/80 bg-neutral-950 py-8 mt-14 text-xs sm:text-sm text-neutral-400">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800/60 text-center text-neutral-400 text-xs leading-relaxed">
            &quot;Bu site bağımsız bir taraftar projesidir. Beşiktaş JK ile resmi bir bağı bulunmamaktadır.&quot;
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider">bjk.8080.tr</span>
              <span>•</span>
              <span>Kara Kartal 1903 Maç Takvimi</span>
            </div>

            <div className="flex items-center gap-4 text-neutral-400 font-medium">
              <a href="/hakkinda" className="hover:text-white transition-colors">
                Hakkında
              </a>
              <span>•</span>
              <a href="/iletisim" className="hover:text-white transition-colors">
                İletişim & Künye
              </a>
              <span>•</span>
              <a href="/gizlilik" className="hover:text-white transition-colors">
                Gizlilik
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
