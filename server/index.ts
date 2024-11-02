import { createServer } from 'http';
import { Server } from 'socket.io';
import { Position, Player, GameRoom } from '../src/types/game';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map<string, GameRoom>();

// Locations with good Street View coverage
const LOCATIONS: Position[] = [
  { lat: 48.8584, lng: 2.2945 },  // Paris
  { lat: 40.7580, lng: -73.9855 }, // New York
  { lat: 35.6762, lng: 139.6503 }, // Tokyo
  { lat: 51.5074, lng: -0.1278 },  // London
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 48.2082, lng: 16.3738 },   // Vienna
  { lat: 41.9028, lng: 12.4964 },   // Rome
  { lat: -22.9068, lng: -43.1729 }, // Rio
  { lat: 1.3521, lng: 103.8198 },   // Singapore
];

function getRandomLocation(): Position {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

io.on('connection', (socket) => {
  socket.on('joinRoom', (roomCode: string, player: Player) => {
    let room = rooms.get(roomCode);
    
    if (!room) {
      room = {
        code: roomCode,
        players: [],
        currentRound: 1,
        timeRemaining: 180,
        locations: Array.from({ length: 5 }, () => getRandomLocation()),
        status: 'waiting'
      };
      rooms.set(roomCode, room);
    }

    if (room.players.length < 2) {
      room.players.push(player);
      socket.join(roomCode);
      io.to(roomCode).emit('playerJoined', player);
    }
  });

  socket.on('startGame', (roomCode: string) => {
    const room = rooms.get(roomCode);
    if (room && room.players.length === 2) {
      room.status = 'playing';
      io.to(roomCode).emit('gameStart', room.locations[0]);

      // Start round timer
      const timer = setInterval(() => {
        room.timeRemaining--;
        io.to(roomCode).emit('updateTimer', room.timeRemaining);

        if (room.timeRemaining === 0) {
          clearInterval(timer);
          io.to(roomCode).emit('roundEnd');
        }
      }, 1000);
    }
  });

  socket.on('submitGuess', (roomCode: string, playerId: string, guess: Position) => {
    const room = rooms.get(roomCode);
    if (room) {
      const player = room.players.find(p => p.id === playerId);
      if (player) {
        player.guess = guess;
        io.to(roomCode).emit('playerGuess', playerId, guess);

        // Check if all players have guessed
        if (room.players.every(p => p.guess)) {
          io.to(roomCode).emit('roundEnd');
        }
      }
    }
  });

  socket.on('disconnect', () => {
    // Clean up rooms when players disconnect
    for (const [code, room] of rooms.entries()) {
      if (room.players.length === 0) {
        rooms.delete(code);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});