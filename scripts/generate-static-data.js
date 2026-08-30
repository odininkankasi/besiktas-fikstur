const fs = require('fs');
const path = require('path');
const https = require('https');

const FOTMOB_ICS_URL = 'https://pub.fotmob.com/prod/pub/api/v2/calendar/team/10188.ics';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// .env.local dosyasından COLLECT_API_KEY oku
function getCollectApiKey() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/COLLECT_API_KEY=([^\r\n]+)/);
      if (match) return match[1].trim();
    }
  } catch (e) {}
  return process.env.COLLECT_API_KEY || '56ouwZQF50T1dNXJXi4PF8:638xHT2v02u6BmASDlIn48';
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function fetchJsonFromCollectAPI(pathStr, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.collectapi.com',
      path: pathStr,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `apikey ${apiKey}`
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
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

    if (line === 'IN-EVENT' || inEvent) {
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
  let startTime = '';

  if (cleanDt.length >= 15) {
    const year = cleanDt.substring(0, 4);
    const month = cleanDt.substring(4, 6);
    const day = cleanDt.substring(6, 8);
    const hour = cleanDt.substring(9, 11);
    const minute = cleanDt.substring(11, 13);
    const second = cleanDt.substring(13, 15);
    startTime = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
  } else {
    startTime = new Date().toISOString();
  }

  const desc = ev.description || '';
  let competition = 'Trendyol Süper Lig';
  let competitionId = 'super-lig';

  if (desc.toLowerCase().includes('europa') || rawSummary.toLowerCase().includes('europa') || desc.toLowerCase().includes('uefa') || rawSummary.toLowerCase().includes('uefa') || desc.toLowerCase().includes('avrupa') || rawSummary.toLowerCase().includes('avrupa') || desc.toLowerCase().includes('qualification') || desc.toLowerCase().includes('playoff') || desc.toLowerCase().includes('play-off')) {
    competition = 'UEFA Avrupa Ligi';
    competitionId = 'europe';
  } else if (desc.toLowerCase().includes('kupa') || rawSummary.toLowerCase().includes('kupa') || desc.toLowerCase().includes('cup')) {
    competition = 'Ziraat Türkiye Kupası';
    competitionId = 'turkiye-kupasi';
  }

  const isFinished = !!score;
  const matchDate = new Date(startTime);
  const now = new Date();

  return {
    id: ev.uid || `bjk-match-${index}`,
    homeTeam,
    awayTeam,
    bjkIsHome: isBjkHome,
    startTime,
    competition,
    competitionId,
    location: ev.location || 'Tüpraş Stadyumu',
    score,
    isFinished
  };
}

async function main() {
  console.log('🔄 Statik veri dosyaları oluşturuluyor...');

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

    // 2. Canlı CollectAPI Üzerinden Süper Lig Puan Durumu Çekme
    console.log('📡 CollectAPI üzerinden canlı Süper Lig puan tablosu çekiliyor...');
    const apiKey = getCollectApiKey();
    let superLigRows = [];
    let bjkRank = 13;
    let bjkPoints = 3;

    try {
      const apiRes = await fetchJsonFromCollectAPI('/sport/league?league=super-lig', apiKey);
      if (Array.isArray(apiRes) && apiRes.length > 0) {
        superLigRows = apiRes.map((item) => {
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

        const bjkFound = superLigRows.find(r => r.isBjk);
        if (bjkFound) {
          bjkRank = bjkFound.rank;
          bjkPoints = bjkFound.points;
        }
        console.log(`✅ Canlı CollectAPI puan tablosu başarıyla alındı! Beşiktaş Sıra: ${bjkRank}, Puan: ${bjkPoints}`);
      }
    } catch (err) {
      console.error('CollectAPI canlı çekim hatası:', err.message);
    }

    const standingsPayload = {
      success: true,
      lastUpdated: new Date().toISOString(),
      standings: {
        'super-lig': {
          leagueId: 'super-lig',
          leagueName: 'Trendyol Süper Lig',
          season: '2026/2027',
          bjkRank,
          bjkPoints,
          rows: superLigRows
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

    console.log('✅ Tüm statik ve canlı API verileri başarıyla üretildi!');
  } catch (err) {
    console.error('Hata:', err);
  }
}

main();
