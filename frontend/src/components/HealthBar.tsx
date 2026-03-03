import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  type: 'player' | 'enemy';
}

export const HealthBar: React.FC<HealthBarProps> = ({ current, max, type }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const isPlayer = type === 'player';

  return (
    <div className="w-32 sm:w-48 space-y-1">
      <div className="flex justify-between text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-400">
        <span>{isPlayer ? 'Player' : 'Enemy'}</span>
        <span>{current}/{max}</span>
      </div>
      <div className="h-1 sm:h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            isPlayer ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]' : 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
