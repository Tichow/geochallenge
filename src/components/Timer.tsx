import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
      <TimerIcon className="w-5 h-5 text-gray-600" />
      <span className="font-mono text-xl font-semibold text-gray-800">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;