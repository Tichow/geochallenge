import React from 'react';

interface RoundProgressProps {
  currentRound: number;
  totalRounds: number;
}

const RoundProgress: React.FC<RoundProgressProps> = ({ currentRound, totalRounds }) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalRounds }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-8 rounded-full ${
            index < currentRound
              ? 'bg-blue-500'
              : index === currentRound
              ? 'bg-blue-200'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export default RoundProgress;