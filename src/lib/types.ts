export interface Match {
  id: string;
  uid: string;
  summary: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  isFinished: boolean;
  bjkIsHome: boolean;
  bjkResult?: 'win' | 'loss' | 'draw';
  competition: string;
  competitionCode: 'super-lig' | 'europe' | 'cup' | 'friendly' | 'other';
  startTime: string;
  endTime: string;
  location: string;
  stadiumName: string;
  city: string;
  url: string;
  description: string;
}

export interface SeasonStats {
  totalPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  upcomingCount: number;
}

export interface StandingRow {
  rank: number;
  teamName: string;
  shortName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  isBjk: boolean;
  qualification?: 'champions-league' | 'europa-league' | 'conference-league' | 'relegation' | 'none';
}

export interface LeagueStandings {
  leagueId: string;
  leagueName: string;
  season: string;
  bjkRank?: number;
  bjkPoints?: number;
  rows: StandingRow[];
}
