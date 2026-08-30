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
        // "starting in" bildirim hatırlatıcılarını atla
        if (!currentEvent.summary.toLowerCase().includes('starting in')) {
          const match = processEvent(currentEvent, matches.length);
          if (match) {
            matches.push(match);
          }
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

  let score = undefined;
  const scoreMatch = rawSummary.match(/\(\s*([0-9]+\s*-\s*[0-9]+)\s*\)/);
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
  } else if (cleanDt.length >= 8) {
    const year = cleanDt.substring(0, 4);
    const month = cleanDt.substring(4, 6);
    const day = cleanDt.substring(6, 8);
    startTime = `${year}-${month}-${day}T18:00:00.000Z`;
  } else {
    startTime = new Date().toISOString();
  }

  const desc = (ev.description || '').toLowerCase();
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

  return {
    id: ev.uid || `bjk-match-${index}`,
    homeTeam,
    awayTeam,
    bjkIsHome: isBjkHome,
    startTime,
    competition,
    competitionCode,
    location: ev.location || 'Tüpraş Stadyumu',
    stadiumName: isBjkHome ? 'Tüpraş Stadyumu' : (ev.location || 'Deplasman'),
    city: isBjkHome ? 'İstanbul' : 'Deplasman',
    score,
    isFinished
  };
}

async function main() {
  console.log('🔄 Statik fikstür veri dosyaları oluşturuluyor...');

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

    // Eğer bjk-standings.json varsa temizle
    const standingsPath = path.join(PUBLIC_DIR, 'bjk-standings.json');
    if (fs.existsSync(standingsPath)) {
      fs.unlinkSync(standingsPath);
    }

    console.log(`✅ Fikstür verileri başarıyla üretildi! Toplam Maç: ${matches.length} (Biten: ${totalPlayed}, Galibiyet: ${wins}, Beraberlik: ${draws}, Mağlubiyet: ${losses}, Atılan Gol: ${goalsScored})`);
  } catch (err) {
    console.error('Hata:', err);
  }
}

main();
