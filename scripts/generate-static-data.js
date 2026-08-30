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

function parseICS(icsText) {
  const events = [];
  const lines = icsText.split(/\r\n|\n|\r/);
  let currentEvent = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (line === 'END:VEVENT' && currentEvent) {
      if (currentEvent.summary && currentEvent.dtstart) {
        events.push(currentEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith('SUMMARY:')) currentEvent.summary = line.substring(8);
      else if (line.startsWith('DTSTART:')) currentEvent.dtstart = line.substring(8);
      else if (line.startsWith('DTEND:')) currentEvent.dtend = line.substring(6);
      else if (line.startsWith('LOCATION:')) currentEvent.location = line.substring(9);
      else if (line.startsWith('DESCRIPTION:')) currentEvent.description = line.substring(12);
      else if (line.startsWith('UID:')) currentEvent.uid = line.substring(4);
    }
  }

  return events.map((ev, index) => {
    const summary = ev.summary || '';
    const parts = summary.split(' - ');
    const homeTeam = parts[0]?.trim() || 'Beşiktaş';
    const awayTeam = parts[1]?.trim() || 'Rakip';
    const isHome = homeTeam.toLowerCase().includes('beşiktaş') || homeTeam.toLowerCase().includes('besiktas');

    let startTime = '';
    if (ev.dtstart) {
      const clean = ev.dtstart.replace(/[^0-9T]/g, '');
      const year = clean.substring(0, 4);
      const month = clean.substring(4, 6);
      const day = clean.substring(6, 8);
      const hour = clean.substring(9, 11) || '00';
      const min = clean.substring(11, 13) || '00';
      startTime = `${year}-${month}-${day}T${hour}:${min}:00Z`;
    }

    const desc = ev.description || '';
    let score = '';
    let isFinished = false;
    const scoreMatch = desc.match(/Result:\s*([0-9]+\s*-\s*[0-9]+)/i);
    if (scoreMatch) {
      score = scoreMatch[1].replace(/\s+/g, '');
      isFinished = true;
    } else if (new Date(startTime).getTime() < Date.now() - 1000 * 60 * 120) {
      isFinished = true;
    }

    let comp = 'Trendyol Süper Lig';
    let compCode = 'super-lig';
    const lower = (summary + ' ' + desc).toLowerCase();
    if (lower.includes('europa') || lower.includes('uefa') || lower.includes('avrupa')) {
      comp = 'UEFA Avrupa Ligi';
      compCode = 'europe';
    } else if (lower.includes('kupa') || lower.includes('cup') || lower.includes('ziraat')) {
      comp = 'Ziraat Türkiye Kupası';
      compCode = 'cup';
    }

    return {
      id: ev.uid || `match-${index}`,
      homeTeam,
      awayTeam,
      bjkIsHome: isHome,
      startTime,
      stadiumName: ev.location || (isHome ? 'Tüpraş Stadyumu' : 'Deplasman'),
      city: isHome ? 'İstanbul' : 'Deplasman',
      competition: comp,
      competitionCode: compCode,
      score: score || undefined,
      isFinished
    };
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

async function main() {
  console.log('🔄 Statik veri dosyaları oluşturuluyor...');
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  try {
    const rawIcs = await fetchText(FOTMOB_ICS_URL);
    const matches = parseICS(rawIcs);

    let wins = 0, draws = 0, losses = 0, scored = 0, conceded = 0, played = 0;
    matches.forEach(m => {
      if (m.isFinished && m.score) {
        played++;
        const [h, a] = m.score.split('-').map(Number);
        const bjkScore = m.bjkIsHome ? h : a;
        const oppScore = m.bjkIsHome ? a : h;
        scored += bjkScore || 0;
        conceded += oppScore || 0;
        if (bjkScore > oppScore) wins++;
        else if (bjkScore === oppScore) draws++;
        else losses++;
      }
    });

    const now = Date.now();
    const upcoming = matches.filter(m => !m.isFinished && new Date(m.startTime).getTime() >= now - 1000 * 60 * 120);

    const fixturesPayload = {
      success: true,
      lastUpdated: new Date().toISOString(),
      webcalUrl: 'webcal://bjk.8080.tr/besiktas-fikstur.ics',
      icsUrl: '/besiktas-fikstur.ics',
      stats: {
        totalPlayed: played,
        wins,
        draws,
        losses,
        goalsScored: scored,
        goalsConceded: conceded,
        goalDifference: scored - conceded,
        upcomingCount: matches.length - played
      },
      nextMatch: upcoming[0] || null,
      fixtures: matches,
      matches
    };

    // 1. JSON Fikstür
    fs.writeFileSync(path.join(PUBLIC_DIR, 'bjk-fixtures.json'), JSON.stringify(fixturesPayload, null, 2));

    // 2. Özel ICS Dosyası
    const customizedIcs = rawIcs
      .replace(/X-WR-CALNAME:Beşiktaş/g, 'X-WR-CALNAME:Beşiktaş Fikstürü (bjk.8080.tr)')
      .replace(/X-WR-CALDESC:Beşiktaş fixtures/g, 'X-WR-CALDESC:Beşiktaş JK Canlı Maç Takvimi (bjk.8080.tr)')
      .replace(/PRODID:-\/\/FOTMOB\/\/FOTMOB 1.0\/\/EN/g, 'PRODID:-//Besiktas JK Fikstur//TR');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'besiktas-fikstur.ics'), customizedIcs);

    // 3. Puan Durumu JSON
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

    console.log('✅ Statik dosyalar (bjk-fixtures.json, bjk-standings.json, besiktas-fikstur.ics) başarıyla üretildi.');
  } catch (err) {
    console.error('Statik veri üretilirken hata:', err);
  }
}

main();
