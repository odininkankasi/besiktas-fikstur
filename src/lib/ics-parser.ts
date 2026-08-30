import { Match, SeasonStats } from './types';

// Turnuva isimlerini Türkçeleştirme ve kodlama
export function parseCompetition(rawDesc: string): { name: string; code: Match['competitionCode'] } {
  const text = (rawDesc || '').toLowerCase();
  
  if (text.includes('super lig') || text.includes('süper lig') || text.includes('trendyol')) {
    return { name: 'Trendyol Süper Lig', code: 'super-lig' };
  }
  if (text.includes('champions league') || text.includes('şampiyonlar ligi')) {
    return { name: 'UEFA Şampiyonlar Ligi', code: 'europe' };
  }
  if (text.includes('europa league') || text.includes('avrupa ligi')) {
    return { name: 'UEFA Avrupa Ligi', code: 'europe' };
  }
  if (text.includes('conference league') || text.includes('konferans ligi')) {
    return { name: 'UEFA Konferans Ligi', code: 'europe' };
  }
  if (text.includes('turkey cup') || text.includes('turkish cup') || text.includes('türkiye kupası') || text.includes('ziraat')) {
    return { name: 'Ziraat Türkiye Kupası', code: 'cup' };
  }
  if (text.includes('super cup') || text.includes('süper kupa')) {
    return { name: 'TFF Süper Kupa', code: 'cup' };
  }
  if (text.includes('club friendlies') || text.includes('friendly') || text.includes('hazırlık')) {
    return { name: 'Hazırlık Maçı', code: 'friendly' };
  }

  // Açıklamadan link harici ilk anlamlı satırı al
  const lines = rawDesc.split(/\\n|\n/).map(l => l.trim()).filter(l => l && !l.startsWith('http'));
  const fallback = lines[0] || 'Resmi Maç';
  return { name: fallback, code: 'other' };
}

// ICS tarih formatını (örn: 20260723T180000Z) ISO string'e çevir
function parseIcsDate(icsDateStr: string): string {
  if (!icsDateStr) return new Date().toISOString();
  
  // Format: YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS
  const match = icsDateStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (match) {
    const [, year, month, day, hour, minute, second, isUtc] = match;
    if (isUtc) {
      return new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute, +second)).toISOString();
    }
    return new Date(+year, +month - 1, +day, +hour, +minute, +second).toISOString();
  }
  
  // Sadece YYYYMMDD durumunda
  const dateOnlyMatch = icsDateStr.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Date.UTC(+year, +month - 1, +day)).toISOString();
  }

  return new Date(icsDateStr).toISOString();
}

// Konum formatını temizle
function parseLocation(rawLoc: string): { fullLocation: string; stadium: string; city: string } {
  if (!rawLoc) return { fullLocation: '', stadium: 'Belirtilmedi', city: '' };
  
  const cleaned = rawLoc.replace(/\\,/g, ',').replace(/\\n/g, ' ').trim();
  const parts = cleaned.split(',').map(p => p.trim());
  const stadium = parts[0] || 'Stadyum';
  const city = parts.length > 3 ? parts[parts.length - 2] : (parts[1] || 'İstanbul');
  
  return {
    fullLocation: cleaned,
    stadium,
    city
  };
}

export function parseICS(icsContent: string): Match[] {
  // ICS RFC5545: Katlanmış satırları birleştir (Satır başındaki boşluk veya tab)
  const unfolded = icsContent.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
  const lines = unfolded.split(/\r\n|\n|\r/);

  const matches: Match[] = [];
  let inEvent = false;
  let currentEvent: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
      continue;
    }
    if (trimmed === 'END:VEVENT') {
      if (inEvent) {
        const parsed = processEvent(currentEvent);
        if (parsed) {
          matches.push(parsed);
        }
      }
      inEvent = false;
      continue;
    }

    if (inEvent) {
      // VALARM bloklarını atla
      if (trimmed.startsWith('BEGIN:VALARM') || trimmed.startsWith('END:VALARM') || trimmed.startsWith('TRIGGER:') || trimmed.startsWith('ACTION:')) {
        continue;
      }
      
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const rawKey = line.substring(0, colonIdx);
        const value = line.substring(colonIdx + 1);
        // Parametreleri (örn: DTSTART;VALUE=DATE) temizle
        const key = rawKey.split(';')[0].toUpperCase();
        if (!currentEvent[key]) {
          currentEvent[key] = value;
        }
      }
    }
  }

  // Tarihe göre sırala
  return matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

function processEvent(evt: Record<string, string>): Match | null {
  const summaryRaw = evt['SUMMARY'] || '';
  if (!summaryRaw) return null;

  // SUMMARY format: "⚽️ Beşiktaş - FC Midtjylland  (1-0)" veya "⚽️ Beşiktaş - Galatasaray"
  // Emoji ve baştaki/sondaki boşlukları temizle
  let cleanSummary = summaryRaw.replace(/⚽️|⚽/g, '').trim();

  // Skor tespiti: (X-Y) veya [X-Y]
  let homeScore: number | undefined;
  let awayScore: number | undefined;
  let isFinished = false;

  const scoreMatch = cleanSummary.match(/\((\d+)\s*[-:]\s*(\d+)\)/) || cleanSummary.match(/\[(\d+)\s*[-:]\s*(\d+)\]/);
  if (scoreMatch) {
    homeScore = parseInt(scoreMatch[1], 10);
    awayScore = parseInt(scoreMatch[2], 10);
    isFinished = true;
    cleanSummary = cleanSummary.replace(scoreMatch[0], '').trim();
  }

  // Takım isimlerini ayır: "Takım A - Takım B" veya "Takım A vs Takım B"
  let homeTeam = 'Beşiktaş';
  let awayTeam = 'Rakip';
  
  if (cleanSummary.includes(' - ')) {
    const parts = cleanSummary.split(' - ');
    homeTeam = parts[0]?.trim() || '';
    awayTeam = parts[1]?.trim() || '';
  } else if (cleanSummary.includes(' vs ')) {
    const parts = cleanSummary.split(' vs ');
    homeTeam = parts[0]?.trim() || '';
    awayTeam = parts[1]?.trim() || '';
  } else {
    homeTeam = cleanSummary;
    awayTeam = '';
  }

  const bjkIsHome = homeTeam.toLowerCase().includes('beşiktaş') || homeTeam.toLowerCase().includes('besiktas');

  // Beşiktaş açısından galibiyet / mağlubiyet / beraberlik hesabı
  let bjkResult: Match['bjkResult'];
  if (isFinished && homeScore !== undefined && awayScore !== undefined) {
    const bjkScore = bjkIsHome ? homeScore : awayScore;
    const opponentScore = bjkIsHome ? awayScore : homeScore;
    if (bjkScore > opponentScore) {
      bjkResult = 'win';
    } else if (bjkScore < opponentScore) {
      bjkResult = 'loss';
    } else {
      bjkResult = 'draw';
    }
  }

  const comp = parseCompetition(evt['DESCRIPTION'] || '');
  const loc = parseLocation(evt['LOCATION'] || '');
  const startTime = parseIcsDate(evt['DTSTART'] || '');
  const endTime = parseIcsDate(evt['DTEND'] || evt['DTSTART'] || '');
  const uid = evt['UID'] || Math.random().toString(36).substring(2);
  const id = uid.replace(/[^a-zA-Z0-9]/g, '-');
  const url = evt['URL'] || (evt['DESCRIPTION']?.match(/https?:\/\/[^\s\\]+/)?.[0] || 'https://www.fotmob.com');

  return {
    id,
    uid,
    summary: summaryRaw,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    isFinished,
    bjkIsHome,
    bjkResult,
    competition: comp.name,
    competitionCode: comp.code,
    startTime,
    endTime,
    location: loc.fullLocation,
    stadiumName: loc.stadium,
    city: loc.city,
    url,
    description: evt['DESCRIPTION'] || ''
  };
}

export function calculateSeasonStats(matches: Match[]): SeasonStats {
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;
  let upcomingCount = 0;
  let totalPlayed = 0;

  for (const m of matches) {
    if (m.isFinished && m.homeScore !== undefined && m.awayScore !== undefined) {
      totalPlayed++;
      const bjkScore = m.bjkIsHome ? m.homeScore : m.awayScore;
      const oppScore = m.bjkIsHome ? m.awayScore : m.homeScore;
      goalsScored += bjkScore;
      goalsConceded += oppScore;

      if (m.bjkResult === 'win') wins++;
      else if (m.bjkResult === 'draw') draws++;
      else if (m.bjkResult === 'loss') losses++;
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
    upcomingCount
  };
}
