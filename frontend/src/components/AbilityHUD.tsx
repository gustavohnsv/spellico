import React from 'react';

const SPELLS = [
  { name: 'FIRE', power: 1 },
  { name: 'EMBER', power: 2 },
  { name: 'HEAT WAVE', power: 3 },
  { name: 'FLAMETHROWER', power: 4 },
  { name: 'HEAL', power: 2 },
];

export const AbilityHUD: React.FC = () => {
  return (
    <div className="flex gap-2 sm:gap-4 p-4 sm:p-6 bg-gradient-to-t from-slate-950/80 to-transparent">
      {SPELLS.map((spell, index) => (
        <div
          key={index}
          className="group relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center border border-slate-800 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-red-900/50 hover:bg-slate-900/60"
        >
          <div
            className="absolute inset-0.5 opacity-20 group-hover:opacity-40 transition-opacity"
            style={{
              background: `radial-gradient(circle, ${index === 4 ? '#ef4444' : '#b91c1c'} 0%, transparent 70%)`,
              filter: `brightness(${0.5 + spell.power * 0.2})`
            }}
          />
          <span className="relative text-[8px] sm:text-[10px] text-slate-400 group-hover:text-red-200 text-center font-serif leading-tight px-1">
            {spell.name}
          </span>
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-red-600/50 transition-all duration-300 group-hover:w-full"
            style={{ width: '10%', opacity: spell.power * 0.2 }}
          />
        </div>
      ))}
    </div>
  );
};
