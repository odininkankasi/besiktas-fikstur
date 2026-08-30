const fs = require('fs');
const path = require('path');
const https = require('https');

const FOTMOB_ICS_URL = 'https://pub.fotmob.com/prod/pub/api/v2/calendar/team/10188.ics';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

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
  const rawEvents = cleanICS.split('BEGIN:VEVENT').slice(1);
  const matches = [];

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

    let score = undefined;
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
    let competitionCode = 'super-lig';

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

async function main() {
  console.log('🔄 Statik fikstür ve puan durumu veri dosyaları oluşturuluyor...');

  try {
    // 1. FotMob Fikstür ve Maç Takvimi
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

    console.log(`✅ Fikstür verileri üretildi! Toplam Maç: ${matches.length} (Biten: ${totalPlayed}, Galibiyet: ${wins}, Beraberlik: ${draws}, Mağlubiyet: ${losses}, Atılan Gol: ${goalsScored})`);

    // 2. Canlı CollectAPI Süper Lig Puan Durumu (Bağımsız)
    console.log('📡 CollectAPI üzerinden canlı Süper Lig puan durumu alınıyor...');
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
        console.log(`✅ CollectAPI Süper Lig tablosu başarıyla alındı (${superLigRows.length} takım, BJK Sıra: ${bjkRank}, Puan: ${bjkPoints})`);
      }
    } catch (err) {
      console.error('CollectAPI puan durumu çekim hatası:', err.message);
    }

    const standingsPayload = {
      success: true,
      lastUpdated: new Date().toISOString(),
      leagueName: 'Trendyol Süper Lig',
      bjkRank,
      bjkPoints,
      rows: superLigRows
    };

    fs.writeFileSync(path.join(PUBLIC_DIR, 'bjk-standings.json'), JSON.stringify(standingsPayload, null, 2));

    console.log('✅ Tüm bağımsız veri dosyaları hazır!');
  } catch (err) {
    console.error('Hata:', err);
  }
}

main();
