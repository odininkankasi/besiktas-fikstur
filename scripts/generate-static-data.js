const fs = require('fs');
const path = require('path');
const https = require('https');

const FOTMOB_ICS_URL = 'https://pub.fotmob.com/prod/pub/api/v2/calendar/team/10188.ics';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function unfoldICS(icsContent) {
  return icsContent.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

function parseICS(rawICS) {
  if (!rawICS) return [];

  const cleanICS = unfoldICS(rawICS);
  const lines = cleanICS.split(/\r\n|\n|\r/);
  const matches = [];

  let inEvent = false;
  let inAlarm = false;
  let currentEvent = {};

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

  return matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

function processEvent(ev, index) {
  let rawSummary = (ev.summary || '').replace(/⚽️/g, '').trim();

  // Skoru yakala (Örn: "Beşiktaş - FC Midtjylland (1-0)")
  let score = undefined;
  const scoreMatch = rawSummary.match(/\(([0-9]+\s*-\s*[0-9]+)\)/);
  if (scoreMatch) {
    score = scoreMatch[1].replace(/\s+/g, '');
    rawSummary = rawSummary.replace(scoreMatch[0], '').trim();
  }

  const teamParts = rawSummary.split(/\s*-\s*/);
  let homeTeam = teamParts[0]?.trim() || 'Beşiktaş';
  let awayTeam = teamParts[1]?.trim() || 'Rakip Takım';

  homeTeam = homeTeam.replace(/starting in \d+ minutes/gi, '').trim();
  awayTeam = awayTeam.replace(/starting in \d+ minutes/gi, '').trim();

  const isBjkHome = homeTeam.toLowerCase().includes('beşiktaş') || homeTeam.toLowerCase().includes('besiktas');

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

  const desc = (ev.description || '').toLowerCase();
  const summaryLower = rawSummary.toLowerCase();
  let competition = 'Trendyol Süper Lig';
  let competitionCode = 'super-lig';

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

async function main() {
  console.log('🔄 Statik veri dosyaları oluşturuluyor...');
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  try {
    const rawIcs = await fetchText(FOTMOB_ICS_URL);
    const matches = parseICS(rawIcs);

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

    const now = Date.now();
    const upcoming = matches.filter(m => !m.isFinished && new Date(m.startTime).getTime() >= now - 1000 * 60 * 120);

    const fixturesPayload = {
      success: true,
      lastUpdated: new Date().toISOString(),
      webcalUrl: 'webcal://bjk.8080.tr/besiktas-fikstur.ics',
      icsUrl: '/besiktas-fikstur.ics',
      stats: {
        totalPlayed,
        wins,
        draws,
        losses,
        goalsScored,
        goalsConceded,
        goalDifference: goalsScored - goalsConceded,
        upcomingCount
      },
      nextMatch: upcoming[0] || null,
      fixtures: matches,
      matches
    };

    fs.writeFileSync(path.join(PUBLIC_DIR, 'bjk-fixtures.json'), JSON.stringify(fixturesPayload, null, 2));

    const customizedIcs = rawIcs
      .replace(/X-WR-CALNAME:Beşiktaş/g, 'X-WR-CALNAME:Beşiktaş Fikstürü (bjk.8080.tr)')
      .replace(/X-WR-CALDESC:Beşiktaş fixtures/g, 'X-WR-CALDESC:Beşiktaş JK Canlı Maç Takvimi (bjk.8080.tr)')
      .replace(/PRODID:-\/\/FOTMOB\/\/FOTMOB 1.0\/\/EN/g, 'PRODID:-//Besiktas JK Fikstur//TR');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'besiktas-fikstur.ics'), customizedIcs);

    // Puan Durumu
    const standingsPayload = {
      success: true,
      lastUpdated: new Date().toISOString(),
      standings: {
        'super-lig': {
          leagueId: 'super-lig',
          leagueName: 'Trendyol Süper Lig',
          season: '2026/2027',
          bjkRank: 13,
          bjkPoints: 3,
          rows: [
            { rank: 1, teamName: 'Fenerbahçe', shortName: 'FB', played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 8, goalsAgainst: 2, goalDiff: 6, points: 7, isBjk: false, qualification: 'champions-league' },
            { rank: 2, teamName: 'Galatasaray', shortName: 'GS', played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 5, goalsAgainst: 1, goalDiff: 4, points: 6, isBjk: false, qualification: 'champions-league' },
            { rank: 3, teamName: 'Eyüpspor', shortName: 'EYÜP', played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 6, goalsAgainst: 3, goalDiff: 3, points: 6, isBjk: false, qualification: 'europa-league' },
            { rank: 4, teamName: 'Göztepe', shortName: 'GÖZ', played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 4, goalsAgainst: 2, goalDiff: 2, points: 5, isBjk: false, qualification: 'europa-league' },
            { rank: 5, teamName: 'Başakşehir', shortName: 'İBFK', played: 2, won: 1, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 3, goalDiff: 2, points: 4, isBjk: false, qualification: 'none' },
            { rank: 6, teamName: 'Samsunspor', shortName: 'SAM', played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDiff: 0, points: 4, isBjk: false, qualification: 'none' },
            { rank: 13, teamName: 'Beşiktaş', shortName: 'BJK', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 0, goalDiff: 2, points: 3, isBjk: true, qualification: 'none' }
          ]
        },
        'europa-league': {
          leagueId: 'europa-league',
          leagueName: 'UEFA Avrupa Ligi (Lig Aşaması)',
          season: '2026/2027',
          bjkRank: 1,
          bjkPoints: 0,
          rows: [
            { rank: 1, teamName: 'Beşiktaş', shortName: 'BJK', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: true, qualification: 'champions-league' },
            { rank: 2, teamName: 'Tottenham Hotspur', shortName: 'TOT', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' },
            { rank: 3, teamName: 'Manchester United', shortName: 'MUN', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, isBjk: false, qualification: 'champions-league' }
          ]
        }
      }
    };
    fs.writeFileSync(path.join(PUBLIC_DIR, 'bjk-standings.json'), JSON.stringify(standingsPayload, null, 2));

    console.log('✅ Statik dosyalar başarıyla üretildi. Toplam Maç:', matches.length, 'Oynanan:', totalPlayed, 'Galibiyet:', wins, 'Atılan Gol:', goalsScored);
  } catch (err) {
    console.error('Hata:', err);
  }
}

main();
