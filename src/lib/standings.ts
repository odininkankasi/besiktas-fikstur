import fs from 'fs';
import path from 'path';
import { LeagueStandings, StandingRow } from './types';

const COLLECT_API_KEY = process.env.COLLECT_API_KEY || '';
const BASE_URL = 'https://api.collectapi.com/sport';

// Disk Tabanlı Önbellek Dosyası Yolu
const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'standings-cache.json');

// 12 Saatlik Önbellek Süresi (Milisaniye) -> Günde En Fazla 2 İstek!
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

interface CachedData {
  timestamp: number;
  data: LeagueStandings;
}

// UEFA Avrupa Ligi Lig Aşaması Tablosu
export const EUROPA_LEAGUE_STANDINGS: LeagueStandings = {
  leagueId: 'europa-league',
  leagueName: 'UEFA Avrupa Ligi (Lig Aşaması)',
  season: '2026/2027',
  bjkRank: 1,
  bjkPoints: 0,
  rows: [
    { rank: 1, teamName: 'Beşiktaş', shortName: 'BJK', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: true, qualification: 'champions-league' },
    { rank: 2, teamName: 'Tottenham Hotspur', shortName: 'TOT', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' },
    { rank: 3, teamName: 'Manchester United', shortName: 'MUN', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' },
    { rank: 4, teamName: 'Athletic Bilbao', shortName: 'ATH', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' },
    { rank: 5, teamName: 'Ajax', shortName: 'AJX', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' },
    { rank: 6, teamName: 'Lazio', shortName: 'LAZ', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' },
    { rank: 7, teamName: 'Fenerbahçe', shortName: 'FB', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' },
    { rank: 8, teamName: 'Galatasaray', shortName: 'GS', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' }
  ]
};

// Diskten Önbellek Oku
function readDiskCache(): CachedData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Önbellek okuma hatası:', e);
  }
  return null;
}

// Diske Önbellek Yaz
function writeDiskCache(data: LeagueStandings) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const payload: CachedData = {
      timestamp: Date.now(),
      data
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (e) {
    console.error('Önbellek yazma hatası:', e);
  }
}

// CollectAPI Üzerinden Canlı Süper Lig Puan Durumu Çekme (Disk Önbellekli & Kota Korumalı)
export async function getStandings(leagueId: 'super-lig' | 'europa-league'): Promise<LeagueStandings> {
  if (leagueId === 'europa-league') {
    return EUROPA_LEAGUE_STANDINGS;
  }

  const now = Date.now();
  const cached = readDiskCache();

  // EĞER 12 SAAT DOLMADIYSA KESİNLİKLE API'YE GİTME! DİREKT ÖNBELLEKTEN VER.
  if (cached && now - cached.timestamp < CACHE_TTL_MS && cached.data.rows.length > 0) {
    return cached.data;
  }

  // 12 saat dolduysa sadece 1 kez API'ye git
  try {
    const res = await fetch(`${BASE_URL}/league?league=super-lig`, {
      headers: {
        'Authorization': `apikey ${COLLECT_API_KEY}`,
        'content-type': 'application/json'
      }
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.result) && json.result.length > 0) {
        const rows: StandingRow[] = json.result.map((item: any) => {
          const rank = Number(item.rank) || 1;
          const name = item.team || '';
          const isBjk = name.toLowerCase().includes('beşiktaş') || name.toLowerCase().includes('besiktas');

          return {
            rank,
            teamName: name,
            shortName: name.substring(0, 3).toUpperCase(),
            played: Number(item.play) || 0,
            won: Number(item.win) || 0,
            drawn: Number(item.draw) || 0,
            lost: Number(item.lose) || 0,
            goalsFor: Number(item.goalfor) || 0,
            goalsAgainst: Number(item.goalagainst) || 0,
            goalDiff: Number(item.goaldistance) || 0,
            points: Number(item.point) || 0,
            isBjk,
            qualification: rank <= 2 ? 'champions-league' : rank <= 4 ? 'europa-league' : rank >= 16 ? 'relegation' : 'none'
          };
        });

        const bjkRow = rows.find(r => r.isBjk);
        const standingsResult: LeagueStandings = {
          leagueId: 'super-lig',
          leagueName: 'Trendyol Süper Lig',
          season: '2026/2027',
          bjkRank: bjkRow?.rank || 13,
          bjkPoints: bjkRow?.points || 3,
          rows
        };

        // Yeni veriyi diske kaydet
        writeDiskCache(standingsResult);
        return standingsResult;
      }
    }
  } catch (error) {
    console.error('CollectAPI isteği başarısız, önbelleğe dönülüyor:', error);
  }

  // API hatası durumunda eski önbelleği dön
  if (cached && cached.data.rows.length > 0) {
    return cached.data;
  }

  // Fallback
  return {
    leagueId: 'super-lig',
    leagueName: 'Trendyol Süper Lig',
    season: '2026/2027',
    bjkRank: 13,
    bjkPoints: 3,
    rows: []
  };
}
