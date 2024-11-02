import { io, Socket } from 'socket.io-client';
import { Position, Player } from '../types/game';

interface ServerToClientEvents {
  playerJoined: (player: Player) => void;
  gameStart: (location: Position) => void;
  playerGuess: (playerId: string, guess: Position) => void;
  roundEnd: () => void;
  gameEnd: () => void;
  updateTimer: (time: number) => void;
}

interface ClientToServerEvents {
  joinRoom: (roomCode: string, player: Player) => void;
  startGame: (roomCode: string) => void;
  submitGuess: (roomCode: string, playerId: string, guess: Position) => void;
}

class GameSocket {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private static instance: GameSocket;

  private constructor() {
    this.socket = io('https://geochallenge.onrender.com');
  }

  public static getInstance(): GameSocket {
    if (!GameSocket.instance) {
      GameSocket.instance = new GameSocket();
    }
    return GameSocket.instance;
  }

  public joinRoom(roomCode: string, player: Player) {
    this.socket.emit('joinRoom', roomCode, player);
  }

  public startGame(roomCode: string) {
    this.socket.emit('startGame', roomCode);
  }

  public submitGuess(roomCode: string, playerId: string, guess: Position) {
    this.socket.emit('submitGuess', roomCode, playerId, guess);
  }

  public onPlayerJoined(callback: (player: Player) => void) {
    this.socket.on('playerJoined', callback);
  }

  public onGameStart(callback: (location: Position) => void) {
    this.socket.on('gameStart', callback);
  }

  public onPlayerGuess(callback: (playerId: string, guess: Position) => void) {
    this.socket.on('playerGuess', callback);
  }

  public onRoundEnd(callback: () => void) {
    this.socket.on('roundEnd', callback);
  }

  public onGameEnd(callback: () => void) {
    this.socket.on('gameEnd', callback);
  }

  public onUpdateTimer(callback: (time: number) => void) {
    this.socket.on('updateTimer', callback);
  }
}

export const gameSocket = GameSocket.getInstance();
