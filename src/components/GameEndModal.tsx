import React from 'react';
import { Player } from '../types/game';
import { Trophy } from 'lucide-react';

interface GameEndModalProps {
  players: Player[];
  onNewGame: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({ players, onNewGame }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
        <p className="text-lg text-gray-600 mb-6">
          {winner.name} wins with {winner.score} points!
        </p>

        <div className="space-y-4 mb-8">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{index + 1}</span>
                <span className="font-medium">{player.name}</span>
              </div>
              <span className="font-bold">{player.score} pts</span>
            </div>
          ))}
        </div>

        <button
          onClick={onNewGame}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameEndModal;