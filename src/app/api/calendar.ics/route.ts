import { NextResponse } from 'next/server';

const FOTMOB_CALENDAR_URL = 'https://pub.fotmob.com/prod/pub/api/v2/calendar/team/10188.ics';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 dakikada bir güncelle

export async function GET(request: Request) {
  try {
    const res = await fetch(FOTMOB_CALENDAR_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'text/calendar, text/plain, */*'
      },
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      return new NextResponse('Takvim beslemesi alınamadı', { status: 502 });
    }

    let icsContent = await res.text();

    // Takvim başlığı, açıklaması ve linklerini tamamen temizle/özelleştir
    icsContent = icsContent
      .replace(/X-WR-CALNAME:Beşiktaş/g, 'X-WR-CALNAME:Beşiktaş Fikstürü (Kara Kartal)')
      .replace(/X-WR-CALDESC:Beşiktaş fixtures/g, 'X-WR-CALDESC:Beşiktaş JK Resmi Maç Fikstürü ve Canlı Takvimi')
      .replace(/PRODID:-\/\/FOTMOB\/\/FOTMOB 1.0\/\/EN/g, 'PRODID:-//Besiktas JK Fikstur//TR')
      .replace(/https:\/\/www\.fotmob\.com\/match\/\d+\\n/g, '')
      .replace(/https:\/\/www\.fotmob\.com\/match\/\d+/g, '')
      .replace(/@fotmob\.com/g, '@bjkfikstur.local');

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="besiktas-fikstur.ics"',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    return new NextResponse('Sunucu hatası', { status: 500 });
  }
}
