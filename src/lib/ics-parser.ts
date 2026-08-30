import { Match, SeasonStats } from './types';

// RFC 5545 Çok Satırlı iCalendar Katlamasını (Line Unfolding) Çözer
export function unfoldICS(icsContent: string): string {
  return icsContent.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

export function parseICS(rawICS: string): Match[] {
  if (!rawICS) return [];

  const cleanICS = unfoldICS(rawICS);
  const lines = cleanICS.split(/\r\n|\n|\r/);
  const matches: Match[] = [];

  let inEvent = false;
  let inAlarm = false;
  let currentEvent: Record<string, string> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      inAlarm = false;
      currentEvent = {};
      continue;
    }

    if (line === 'END:VEVENT') {
      if (inEvent && currentEvent.dtstart && currentEvent.summary) {
        const match = processEvent(currentEvent, matches.length);
        if (match) {
          matches.push(match);
        }
      }
      inEvent = false;
      inAlarm = false;
      continue;
    }

    if (line === 'BEGIN:VALARM') {
      inAlarm = true;
      continue;
    }

    if (line === 'END:VALARM') {
      inAlarm = false;
      continue;
    }

    if (inEvent && !inAlarm) {
      if (line.startsWith('UID:')) currentEvent.uid = line.substring(4);
      else if (line.startsWith('SUMMARY:')) currentEvent.summary = line.substring(8);
      else if (line.startsWith('DTSTART:')) currentEvent.dtstart = line.substring(8);
      else if (line.startsWith('DTEND:')) currentEvent.dtend = line.substring(6);
      else if (line.startsWith('DESCRIPTION:')) currentEvent.description = line.substring(12);
      else if (line.startsWith('LOCATION:')) currentEvent.location = line.substring(9);
      else if (line.startsWith('URL:')) currentEvent.url = line.substring(4);
    }
  }

  // Tarihe göre sırala
  return matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

function processEvent(ev: Record<string, string>, index: number): Match | null {
  // 1. Özet ve Skor Ayrıştırma
  let rawSummary = (ev.summary || '').replace(/⚽️/g, '').trim();

  // Skoru yakala (Örn: "Beşiktaş - FC Midtjylland (1-0)" veya " ( 1 - 0 )")
  let score: string | undefined = undefined;
  const scoreMatch = rawSummary.match(/\(\s*([0-9]+\s*-\s*[0-9]+)\s*\)/);
  if (scoreMatch) {
    score = scoreMatch[1].replace(/\s+/g, '');
    rawSummary = rawSummary.replace(scoreMatch[0], '').trim();
  }

  // Takımları ayır
  const teamParts = rawSummary.split(/\s*-\s*/);
  let homeTeam = teamParts[0]?.trim() || 'Beşiktaş';
  let awayTeam = teamParts[1]?.trim() || 'Rakip Takım';

  // "starting in 15 minutes" gibi bildirim kalıntılarını temizle
  homeTeam = homeTeam.replace(/starting in \d+ minutes/gi, '').trim();
  awayTeam = awayTeam.replace(/starting in \d+ minutes/gi, '').trim();

  const isBjkHome = homeTeam.toLowerCase().includes('beşiktaş') || homeTeam.toLowerCase().includes('besiktas');

  // 2. Başlangıç Tarihi Ayrıştırma (ISO 8601 UTC)
  const dtstart = ev.dtstart || '';
  const cleanDt = dtstart.replace(/[^0-9T]/g, '');
  if (cleanDt.length < 8) return null;

  const year = cleanDt.substring(0, 4);
  const month = cleanDt.substring(4, 6);
  const day = cleanDt.substring(6, 8);
  const hours = cleanDt.substring(9, 11) || '00';
  const minutes = cleanDt.substring(11, 13) || '00';
  const startTime = `${year}-${month}-${day}T${hours}:${minutes}:00Z`;

  const matchTimeMs = new Date(startTime).getTime();
  const now = Date.now();
  const isFinished = !!score || matchTimeMs < now - 1000 * 60 * 120;

  // 3. Konum & Stadyum Temizleme
  let locationRaw = (ev.location || '')
    .replace(/\\,/g, ',')
    .replace(/\\n/g, ' ')
    .replace(/\\;/g, ';')
    .trim();

  let stadiumName = isBjkHome ? 'Tüpraş Stadyumu' : 'Deplasman';
  let city = isBjkHome ? 'İstanbul' : 'Deplasman';

  if (locationRaw) {
    const locParts = locationRaw.split(',').map(s => s.trim()).filter(Boolean);
    if (locParts.length > 0) {
      stadiumName = locParts[0];
      if (locParts.length > 1) {
        city = locParts[locParts.length - 2] || locParts[locParts.length - 1];
      }
    }
  }

  // 4. Turnuva Tespiti
  const desc = (ev.description || '').toLowerCase();
  const summaryLower = rawSummary.toLowerCase();
  let competition = 'Trendyol Süper Lig';
  let competitionCode: 'super-lig' | 'europe' | 'cup' = 'super-lig';

  if (desc.includes('europa') || desc.includes('uefa') || desc.includes('avrupa') || summaryLower.includes('europa') || summaryLower.includes('uefa')) {
    competition = 'UEFA Avrupa Ligi';
    competitionCode = 'europe';
  } else if (desc.includes('turkiye kupasi') || desc.includes('ziraat') || desc.includes('cup') || desc.includes('kupa')) {
    competition = 'Ziraat Türkiye Kupası';
    competitionCode = 'cup';
  } else if (desc.includes('friendly') || desc.includes('hazırlık')) {
    competition = 'Hazırlık Maçı';
    competitionCode = 'super-lig';
  }

  return {
    id: ev.uid || `match-${index}-${startTime}`,
    homeTeam,
    awayTeam,
    bjkIsHome: isBjkHome,
    startTime,
    stadiumName,
    city,
    competition,
    competitionCode,
    score,
    isFinished
  };
}

export function calculateSeasonStats(matches: Match[]): SeasonStats {
  let totalPlayed = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;
  let upcomingCount = 0;

  for (const m of matches) {
    if (m.isFinished && m.score) {
      totalPlayed++;
      const [h, a] = m.score.split('-').map(Number);
      const bjkGoals = m.bjkIsHome ? h : a;
      const oppGoals = m.bjkIsHome ? a : h;

      if (!isNaN(bjkGoals) && !isNaN(oppGoals)) {
        goalsScored += bjkGoals;
        goalsConceded += oppGoals;

        if (bjkGoals > oppGoals) wins++;
        else if (bjkGoals === oppGoals) draws++;
        else losses++;
      }
    } else {
      upcomingCount++;
    }
  }

  return {
    totalPlayed,
    wins,
    draws,
    losses,
    goalsScored,
    goalsConceded,
    goalDifference: goalsScored - goalsConceded,
    upcomingCount
  };
}
