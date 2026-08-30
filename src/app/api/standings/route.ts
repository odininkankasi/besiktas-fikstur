import { NextResponse } from 'next/server';
import { getStandings } from '@/lib/standings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [superLig, europaLeague] = await Promise.all([
      getStandings('super-lig'),
      getStandings('europa-league')
    ]);

    return NextResponse.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      standings: {
        'super-lig': superLig,
        'europa-league': europaLeague
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Puan durumu yüklenemedi' }, { status: 500 });
  }
}
