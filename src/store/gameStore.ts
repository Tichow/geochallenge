import { create } from 'zustand';
import { GameState, Position, Player } from '../types/game';
import { gameSocket } from '../services/socket';

interface GameStore extends GameState {
  initGame: (roomCode: string, isHost: boolean) => void;
  setCurrentLocation: (location: Position) => void;
  submitGuess: (playerId: string, guess: Position) => void;
  updateTimeRemaining: (time: number) => void;
  nextRound: () => void;
  addPlayer: (player: Player) => void;
  calculateScore: (guess: Position, actual: Position) => number;
  startGame: () => void;
  resetGame: () => void;
}

const MAX_SCORE = 5000;
const EARTH_RADIUS = 6371; // km

const calculateDistance = (guess: Position, actual: Position): number => {
  const lat1 = guess.lat * Math.PI / 180;
  const lat2 = actual.lat * Math.PI / 180;
  const lng1 = guess.lng * Math.PI / 180;
  const lng2 = actual.lng * Math.PI / 180;

  const dlat = lat2 - lat1;
  const dlng = lng2 - lng1;

  const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
           Math.cos(lat1) * Math.cos(lat2) *
           Math.sin(dlng/2) * Math.sin(dlng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return EARTH_RADIUS * c;
};

export const useGameStore = create<GameStore>((set, get) => ({
  roomCode: '',
  currentRound: 1,
  timeRemaining: 180,
  players: [],
  gameStatus: 'waiting',
  isHost: false,

  initGame: (roomCode, isHost) => {
    set({ roomCode, isHost, gameStatus: 'waiting' });
    
    gameSocket.onPlayerJoined((player) => {
      get().addPlayer(player);
      if (get().players.length === 2 && isHost) {
        get().startGame();
      }
    });

    gameSocket.onGameStart((location) => {
      set({ currentLocation: location, gameStatus: 'playing' });
    });

    gameSocket.onPlayerGuess((playerId, guess) => {
      get().submitGuess(playerId, guess);
    });

    gameSocket.onUpdateTimer((time) => {
      set({ timeRemaining: time });
    });

    gameSocket.onRoundEnd(() => {
      set({ gameStatus: 'roundEnd' });
    });

    gameSocket.onGameEnd(() => {
      set({ gameStatus: 'gameEnd' });
    });
  },
  
  startGame: () => {
    if (get().isHost) {
      gameSocket.startGame(get().roomCode);
    }
  },
  
  setCurrentLocation: (location) => set({ currentLocation: location }),
  
  submitGuess: (playerId, guess) => {
    gameSocket.submitGuess(get().roomCode, playerId, guess);
    set((state) => ({
      players: state.players.map(player =>
        player.id === playerId
          ? { 
              ...player,
              guess,
              roundScores: [...player.roundScores, get().calculateScore(guess, state.currentLocation!)],
              score: player.score + get().calculateScore(guess, state.currentLocation!)
            }
          : player
      )
    }));
  },
  
  updateTimeRemaining: (time) => set({ timeRemaining: time }),
  
  nextRound: () => set((state) => ({
    currentRound: state.currentRound + 1,
    timeRemaining: 180,
    players: state.players.map(player => ({ ...player, guess: undefined })),
    gameStatus: state.currentRound === 5 ? 'gameEnd' : 'playing'
  })),
  
  addPlayer: (player) => {
    gameSocket.joinRoom(get().roomCode, player);
    set((state) => ({
      players: [...state.players, player]
    }));
  },
  
  calculateScore: (guess, actual) => {
    const distance = calculateDistance(guess, actual);
    return Math.round(MAX_SCORE * Math.exp(-distance / 2000));
  },

  resetGame: () => set({
    roomCode: '',
    currentRound: 1,
    timeRemaining: 180,
    players: [],
    currentLocation: undefined,
    gameStatus: 'waiting',
    isHost: false
  })
}));