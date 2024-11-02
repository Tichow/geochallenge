import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { Globe, Users } from 'lucide-react';
import Map from './components/Map';
import StreetView from './components/StreetView';
import Timer from './components/Timer';
import RoundProgress from './components/RoundProgress';
import RoundEndModal from './components/RoundEndModal';
import GameEndModal from './components/GameEndModal';

function App() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  
  const gameState = useGameStore();

  useEffect(() => {
    if (gameState.timeRemaining === 0 && gameState.gameStatus === 'playing') {
      gameState.nextRound();
    }
  }, [gameState.timeRemaining]);

  const handleCreateGame = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    gameState.initGame(newRoomCode, true);
  };

  const handleJoinGame = () => {
    if (roomCode && playerName) {
      gameState.initGame(roomCode, false);
      gameState.addPlayer({
        id: Math.random().toString(),
        name: playerName,
        score: 0,
        roundScores: []
      });
      setShowJoinModal(false);
    }
  };

  if (!gameState.roomCode) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <Globe className="mx-auto h-16 w-16 text-blue-500" />
            <h1 className="mt-6 text-3xl font-bold text-gray-900">GeoChallenge</h1>
            <p className="mt-2 text-gray-600">Test your geography knowledge against a friend</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleCreateGame}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Game
            </button>
            
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Join Game
            </button>
          </div>
        </div>

        {showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Join Game</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Room Code</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter room code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleJoinGame}
                    className="flex-1 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (gameState.gameStatus === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-blue-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Waiting for Players</h2>
            <p className="mt-2 text-gray-600">Share this room code with your friend</p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-3xl font-mono font-bold tracking-wider text-gray-800">
                {gameState.roomCode}
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Players joined: {gameState.players.length}/2
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <RoundProgress currentRound={gameState.currentRound} totalRounds={5} />
          <Timer timeRemaining={gameState.timeRemaining} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
          {gameState.currentLocation && (
            <>
              <StreetView position={gameState.currentLocation} />
              <Map
                onGuess={(position) => {
                  if (gameState.players[0]) {
                    gameState.submitGuess(gameState.players[0].id, position);
                  }
                }}
                disabled={gameState.gameStatus !== 'playing'}
                showMarkers={gameState.gameStatus === 'roundEnd'}
                markers={gameState.players.map(p => p.guess).filter(Boolean)}
              />
            </>
          )}
        </div>

        {gameState.gameStatus === 'roundEnd' && gameState.currentLocation && (
          <RoundEndModal
            players={gameState.players}
            actualLocation={gameState.currentLocation}
            onNextRound={gameState.nextRound}
          />
        )}

        {gameState.gameStatus === 'gameEnd' && (
          <GameEndModal
            players={gameState.players}
            onNewGame={() => gameState.resetGame()}
          />
        )}
      </div>
    </div>
  );
}

export default App;