import { Match, SeasonStats } from './types';

// RFC 5545 Çok Satırlı iCalendar Katlamasını (Line Unfolding) Çözer
export function unfoldICS(icsContent: string): string {
  return icsContent.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

export function parseICS(rawICS: string): Match[] {
  if (!rawICS) return [];

  const cleanICS = unfoldICS(rawICS);
  const rawEvents = cleanICS.split('BEGIN:VEVENT').slice(1);
  const matches: Match[] = [];

  for (let index = 0; index < rawEvents.length; index++) {
    const block = rawEvents[index];
    const summaryMatch = block.match(/SUMMARY:([^\r\n]+)/);
    const dtstartMatch = block.match(/DTSTART:([^\r\n]+)/);
    const uidMatch = block.match(/UID:([^\r\n]+)/);
    const descMatch = block.match(/DESCRIPTION:([^\r\n]+)/);
    const locMatch = block.match(/LOCATION:([^\r\n]+)/);

    const summary = summaryMatch ? summaryMatch[1].trim() : '';
    const dtstart = dtstartMatch ? dtstartMatch[1].trim() : '';
    const uid = uidMatch ? uidMatch[1].trim() : `bjk-match-${index}`;
    const description = descMatch ? descMatch[1].trim() : '';
    const location = locMatch ? locMatch[1].trim() : 'Tüpraş Stadyumu';

    if (!summary || !dtstart || summary.toLowerCase().includes('starting in')) {
      continue;
    }

    let rawSummary = summary.replace(/⚽️/g, '').trim();

    let score: string | undefined = undefined;
    const scoreMatch = rawSummary.match(/\(\s*([0-9]+\s*-\s*[0-9]+)\s*\)/);
    if (scoreMatch) {
      score = scoreMatch[1].replace(/\s+/g, '');
      rawSummary = rawSummary.replace(scoreMatch[0], '').trim();
    }

    const teamParts = rawSummary.split(/\s*-\s*/);
    let homeTeam = teamParts[0]?.trim() || 'Beşiktaş';
    let awayTeam = teamParts[1]?.trim() || 'Rakip Takım';

    const isBjkHome = homeTeam.toLowerCase().includes('beşiktaş') || homeTeam.toLowerCase().includes('besiktas');

    const cleanDt = dtstart.replace(/[^0-9T]/g, '');
    let startTime = '';

    if (cleanDt.length >= 15) {
      const year = cleanDt.substring(0, 4);
      const month = cleanDt.substring(4, 6);
      const day = cleanDt.substring(6, 8);
      const hour = cleanDt.substring(9, 11);
      const minute = cleanDt.substring(11, 13);
      const second = cleanDt.substring(13, 15);
      startTime = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
    } else if (cleanDt.length >= 8) {
      const year = cleanDt.substring(0, 4);
      const month = cleanDt.substring(4, 6);
      const day = cleanDt.substring(6, 8);
      startTime = `${year}-${month}-${day}T18:00:00.000Z`;
    } else {
      startTime = new Date().toISOString();
    }

    const desc = (description || '').toLowerCase();
    const summaryLower = rawSummary.toLowerCase();
    let competition = 'Trendyol Süper Lig';
    let competitionCode: 'super-lig' | 'europe' | 'cup' = 'super-lig';

    if (desc.includes('europa') || summaryLower.includes('europa') || desc.includes('uefa') || summaryLower.includes('uefa') || desc.includes('avrupa') || summaryLower.includes('avrupa') || desc.includes('qualification') || desc.includes('playoff') || desc.includes('play-off')) {
      competition = 'UEFA Avrupa Ligi';
      competitionCode = 'europe';
    } else if (desc.includes('kupa') || summaryLower.includes('kupa') || desc.includes('cup')) {
      competition = 'Ziraat Türkiye Kupası';
      competitionCode = 'cup';
    }

    const isFinished = !!score;

    matches.push({
      id: uid,
      homeTeam,
      awayTeam,
      bjkIsHome: isBjkHome,
      startTime,
      competition,
      competitionCode,
      location,
      stadiumName: isBjkHome ? 'Tüpraş Stadyumu' : (location || 'Deplasman'),
      city: isBjkHome ? 'İstanbul' : 'Deplasman',
      score,
      isFinished
    });
  }

  return matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
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
