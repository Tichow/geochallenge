export interface Position {
  lat: number;
  lng: number;
}

export interface Player {
  id: string;
  name: string;
  guess?: Position;
  score: number;
  roundScores: number[];
}

export interface GameRoom {
  code: string;
  players: Player[];
  currentRound: number;
  timeRemaining: number;
  locations: Position[];
  status: 'waiting' | 'playing' | 'roundEnd' | 'gameEnd';
}