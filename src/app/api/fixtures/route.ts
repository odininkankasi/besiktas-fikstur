import { NextResponse } from 'next/server';
import { parseICS, calculateSeasonStats } from '@/lib/ics-parser';

const CALENDAR_ICS_URL = 'https://pub.fotmob.com/prod/pub/api/v2/calendar/team/10188.ics';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 dakikada bir yenile

export async function GET() {
  try {
    const res = await fetch(CALENDAR_ICS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/calendar, text/plain, */*'
      },
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      throw new Error(`FotMob takvim kaynağına ulaşılamadı. HTTP ${res.status}`);
    }

    const icsText = await res.text();
    const matches = parseICS(icsText);
    const stats = calculateSeasonStats(matches);

    // Sıradaki maçı bul (şimdiki zamandan sonraki ilk maç veya henüz bitmemiş olan)
    const now = new Date().getTime();
    const upcomingMatches = matches.filter(m => !m.isFinished && new Date(m.startTime).getTime() >= now - 1000 * 60 * 120);
    const nextMatch = upcomingMatches[0] || null;

    return NextResponse.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      webcalUrl: '/api/calendar.ics',
      icsUrl: '/api/calendar.ics',
      stats,
      nextMatch,
      fixtures: matches,
      matches
    });
  } catch (error: unknown) {
    console.error('Fikstür yüklenirken hata oluştu:', error);
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json(
      {
        success: false,
        error: message,
        matches: [],
        stats: { totalPlayed: 0, wins: 0, draws: 0, losses: 0, goalsScored: 0, goalsConceded: 0, upcomingCount: 0 }
      },
      { status: 500 }
    );
  }
}
