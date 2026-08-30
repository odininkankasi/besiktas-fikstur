'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { NextMatchHero } from '@/components/NextMatchHero';
import { SeasonStatsBanner } from '@/components/SeasonStatsBanner';
import { StandingsMiniBanner } from '@/components/StandingsMiniBanner';
import { MatchCard } from '@/components/MatchCard';
import { StandingsModal } from '@/components/StandingsModal';
import { CalendarModal } from '@/components/CalendarModal';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Match, SeasonStats, LeagueStandings } from '@/lib/types';
import { Search, Trophy, CheckCircle2, Flame, RefreshCw } from 'lucide-react';

export default function Home() {
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [stats, setStats] = useState<SeasonStats | null>(null);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [standings, setStandings] = useState<{
    'super-lig': LeagueStandings | null;
    'europa-league': LeagueStandings | null;
  }>({ 'super-lig': null, 'europa-league': null });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'finished' | 'all'>('upcoming');

  // Modallar
  const [isStandingsModalOpen, setIsStandingsModalOpen] = useState(false);
  const [selectedStandingsLeague, setSelectedStandingsLeague] = useState<'super-lig' | 'europa-league'>('super-lig');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Verileri Çek
  const loadData = async () => {
    setLoading(true);
    try {
      // Statik JSON veya API'den eşzamanlı çek
      const [fixturesRes, standingsRes] = await Promise.all([
        fetch('/bjk-fixtures.json').catch(() => fetch('/api/fixtures')),
        fetch('/bjk-standings.json').catch(() => fetch('/api/standings'))
      ]);

      if (fixturesRes && fixturesRes.ok) {
        const fJson = await fixturesRes.json();
        if (fJson.success) {
          setFixtures(fJson.fixtures || fJson.matches || []);
          setStats(fJson.stats || null);
          setNextMatch(fJson.nextMatch || null);
        }
      }

      if (standingsRes && standingsRes.ok) {
        const sJson = await standingsRes.json();
        if (sJson.success && sJson.standings) {
          setStandings(sJson.standings);
        }
      }
    } catch (error) {
      console.error('Veri çekilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtreleme ve Arama
  const filteredFixtures = useMemo(() => {
    return fixtures.filter((match) => {
      // Tab filtreleme
      if (activeTab === 'upcoming' && match.isFinished) return false;
      if (activeTab === 'finished' && !match.isFinished) return false;

      // Turnuva filtreleme
      if (selectedCompetition !== 'all') {
        if (selectedCompetition === 'super-lig' && match.competitionCode !== 'super-lig') return false;
        if (selectedCompetition === 'europe' && match.competitionCode !== 'europe') return false;
        if (selectedCompetition === 'cup' && match.competitionCode !== 'cup') return false;
      }

      // Arama filtreleme (Rakip takım, Şehir, Stadyum)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const opponent = match.bjkIsHome ? match.awayTeam : match.homeTeam;
        const matchesQuery =
          opponent.toLowerCase().includes(q) ||
          match.stadiumName.toLowerCase().includes(q) ||
          match.competition.toLowerCase().includes(q) ||
          match.city.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [fixtures, activeTab, selectedCompetition, searchQuery]);

  // Turnuva Seçenekleri
  const competitions = useMemo(() => {
    const counts = { all: fixtures.length, 'super-lig': 0, europe: 0, cup: 0 };
    fixtures.forEach((f) => {
      if (f.competitionCode === 'super-lig') counts['super-lig']++;
      else if (f.competitionCode === 'europe') counts['europe']++;
      else if (f.competitionCode === 'cup') counts['cup']++;
    });
    return counts;
  }, [fixtures]);

  // Seçili Turnuvaya Göre Canlı Performans İstatistikleri Hesaplama
  const activeStats = useMemo(() => {
    let played = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let scored = 0;
    let conceded = 0;
    let upcoming = 0;

    fixtures.forEach((m) => {
      // Turnuva filtresi
      if (selectedCompetition !== 'all' && m.competitionCode !== selectedCompetition) {
        return;
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
        onRefresh={loadData}
        isLoading={loading}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full space-y-6">
        {/* 1. Sıradaki Maç Geri Sayım Hero Alanı */}
        <NextMatchHero
          match={nextMatch}
          onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
        />

        {/* 2. Sezon İstatistikleri Şeridi (Filtreye ve Canlı Maçlara Göre Dinamik) */}
        <SeasonStatsBanner
          stats={activeStats}
          selectedCompetitionTitle={competitionTitle}
        />

        {/* 3. Puan Durumu Mini Şeridi */}
        <StandingsMiniBanner
          superLig={standings['super-lig']}
          europaLeague={standings['europa-league']}
          onOpenFullStandings={(leagueId) => {
            if (leagueId === 'europa-league') {
              setSelectedStandingsLeague('europa-league');
            } else {
              setSelectedStandingsLeague('super-lig');
            }
            setIsStandingsModalOpen(true);
          }}
        />

        {/* 3. Filtreleme, Sekmeler ve Arama */}
        <div className="space-y-2.5 pt-1">
          {/* Ana Sekmeler (Gelecek, Oynanan, Tümü) & Arama Kutusu */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="p-1 bg-neutral-950/90 rounded-2xl border border-neutral-800/80 flex items-center shadow-lg w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'upcoming'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Gelecek</span>
                {stats && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-white/90">
                    {stats.upcomingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('finished')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'finished'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Biten</span>
                {stats && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-white/90">
                    {stats.totalPlayed}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'all'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Tümü</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-white/90">
                  {fixtures.length}
                </span>
              </button>
            </div>

            {/* Arama Kutusu */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Takım veya stadyum ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Turnuva Filtre Butonları */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCompetition('all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all text-[11px] sm:text-xs ${
                selectedCompetition === 'all'
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'bg-neutral-950/60 text-neutral-400 border border-neutral-800/80 hover:text-neutral-200'
              }`}
            >
              Tümü ({competitions.all})
            </button>
            <button
              onClick={() => setSelectedCompetition('super-lig')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 text-[11px] sm:text-xs ${
                selectedCompetition === 'super-lig'
                  ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                  : 'bg-neutral-950/60 text-neutral-400 border border-neutral-800/80 hover:text-neutral-200'
              }`}
            >
              <Trophy className="w-3 h-3 text-red-500" />
              <span>Süper Lig ({competitions['super-lig']})</span>
            </button>
            <button
              onClick={() => setSelectedCompetition('europe')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 text-[11px] sm:text-xs ${
                selectedCompetition === 'europe'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'bg-neutral-950/60 text-neutral-400 border border-neutral-800/80 hover:text-neutral-200'
              }`}
            >
              <Trophy className="w-3 h-3 text-blue-400" />
              <span>Avrupa ({competitions.europe})</span>
            </button>
          </div>
        </div>

        {/* 4. Fikstür Listesi */}
        <div className="space-y-3 pt-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-neutral-400 font-medium">Fikstür ve maçlar yükleniyor...</p>
            </div>
          ) : filteredFixtures.length === 0 ? (
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

      {/* Puan Durumu Modalı */}
      <StandingsModal
        isOpen={isStandingsModalOpen}
        onClose={() => setIsStandingsModalOpen(false)}
        initialLeague={selectedStandingsLeague}
        superLig={standings['super-lig']}
        europaLeague={standings['europa-league']}
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

      {/* Alt Bilgi (Footer) - Yasal Bildirim, Künye & İletişim Bağlantıları */}
      <footer className="w-full border-t border-neutral-800/80 bg-neutral-950 py-8 mt-14 text-xs text-neutral-400">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          {/* Yasal Uyarı Metni */}
          <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800/60 text-center text-neutral-400 text-[11px] leading-relaxed">
            &quot;Bu site bağımsız bir taraftar projesidir. Beşiktaş JK ile resmi bir bağı bulunmamaktadır.&quot;
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[11px]">
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
}
