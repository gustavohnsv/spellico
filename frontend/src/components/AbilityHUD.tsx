import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const SPELLS = [
  { id: 'FIRE', name: 'FIRE', power: 1, cooldown: 1000 },
  { id: 'EMBER', name: 'EMBER', power: 2, cooldown: 5000 },
  { id: 'HEAT_WAVE', name: 'HEAT WAVE', power: 3, cooldown: 10000 },
  { id: 'FLAMETHROWER', name: 'FLAMETHROWER', power: 4, cooldown: 20000 },
  { id: 'HEAL', name: 'HEAL', power: 2, cooldown: 15000 },
];

export const AbilityHUD: React.FC = () => {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [, setTick] = useState(0);                     // Force re-render

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 100); // Update every 100ms
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleSpellCast = (payload: { spellId: string, casterId: string }) => {
      if (payload.casterId === socket.id) {            // Check if player casted
        const spell = SPELLS.find(s => s.id === payload.spellId || s.name === payload.spellId);
        if (spell) {                                   // Start cooldown
          setCooldowns(prev => ({ ...prev, [spell.id]: Date.now() + spell.cooldown }));
        }
      }
    };

    socket.on('spell-cast', handleSpellCast);          // Listen for spell cast
    return () => { socket.off('spell-cast', handleSpellCast); };
  }, []);

  return (
    <div className="flex gap-2 sm:gap-4 p-4 sm:p-6 bg-gradient-to-t from-slate-950/80 to-transparent">
      {SPELLS.map((spell, index) => {
        const isCooldown = cooldowns[spell.id] > Date.now();
        const remaining = isCooldown ? (cooldowns[spell.id] - Date.now()) : 0;
        const progress = isCooldown ? (remaining / spell.cooldown) * 100 : 0;

        return (
          <div
            key={index}
            className="group relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center border border-slate-800 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-red-900/50 hover:bg-slate-900/60 overflow-hidden"
          >
            {isCooldown && (                           // Radial cooldown overlay
              <div
                className="absolute inset-0 bg-slate-950/80 z-10"
                style={{
                  clipPath: `inset(${100 - progress}% 0 0 0)` // Vertical sweep for simplicity if radial is hard with CSS
                }}
              />
            )}
            {isCooldown && (                           // Circular sweep (conic-gradient)
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: `conic-gradient(rgba(0,0,0,0.7) ${progress}%, transparent 0)`
                }}
              />
            )}
            <div
              className="absolute inset-0.5 opacity-20 group-hover:opacity-40 transition-opacity"
              style={{
                background: `radial-gradient(circle, ${index === 4 ? '#ef4444' : '#b91c1c'} 0%, transparent 70%)`,
                filter: `brightness(${0.5 + spell.power * 0.2})`
              }}
            />
            <span className="relative z-20 text-[8px] sm:text-[10px] text-slate-400 group-hover:text-red-200 text-center font-serif leading-tight px-1">
              {spell.name}
            </span>
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-red-600/50 transition-all duration-300 group-hover:w-full"
              style={{ width: '10%', opacity: spell.power * 0.2 }}
            />
          </div>
        );
      })}
    </div>
  );
};
