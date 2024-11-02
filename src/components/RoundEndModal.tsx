import React from 'react';
import { Position, Player } from '../types/game';
import { MapPin } from 'lucide-react';

interface RoundEndModalProps {
  players: Player[];
  actualLocation: Position;
  onNextRound: () => void;
}

const RoundEndModal: React.FC<RoundEndModalProps> = ({
  players,
  actualLocation,
  onNextRound,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Round Results</h2>
        
        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{player.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">
                  {player.roundScores[player.roundScores.length - 1]} pts
                </div>
                <div className="text-sm text-gray-500">
                  Total: {player.score} pts
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onNextRound}
          className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Next Round
        </button>
      </div>
    </div>
  );
};

export default RoundEndModal;