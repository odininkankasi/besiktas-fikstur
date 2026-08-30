import { FixturesView } from '@/components/FixturesView';
import fixturesData from '@/../public/bjk-fixtures.json';
import standingsData from '@/../public/bjk-standings.json';
import { Match, SeasonStats } from '@/lib/types';
import { StandingsData } from '@/components/StandingsModal';

export default function Home() {
  const initialFixtures = (fixturesData.fixtures || (fixturesData as any).matches || []) as Match[];
  const initialStats = (fixturesData.stats || null) as SeasonStats | null;
  const initialNextMatch = (fixturesData.nextMatch || null) as Match | null;
  const initialStandings = (standingsData.success ? standingsData : null) as StandingsData | null;

  return (
    <FixturesView
      initialFixtures={initialFixtures}
      initialStats={initialStats}
      initialNextMatch={initialNextMatch}
      initialStandings={initialStandings}
    />
  );
}
