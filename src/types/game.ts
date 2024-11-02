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

export interface GameState {
  roomCode: string;
  currentRound: number;
  timeRemaining: number;
  players: Player[];
  currentLocation?: Position;
  gameStatus: 'waiting' | 'playing' | 'roundEnd' | 'gameEnd';
  isHost: boolean;
}