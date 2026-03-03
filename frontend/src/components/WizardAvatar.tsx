import React from 'react';

interface WizardAvatarProps {
  type: 'player' | 'enemy';
}

export const WizardAvatar: React.FC<WizardAvatarProps> = ({ type }) => {
  const isPlayer = type === 'player';

  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-700 ${
        isPlayer ? 'scale-100 sm:scale-110' : 'scale-75'
      }`}
    >
      <div
        className={`w-28 h-40 sm:w-32 sm:h-48 bg-gradient-to-b from-slate-800 to-slate-950 border-x-2 border-t-2 border-slate-700/50 rounded-t-full relative overflow-hidden shadow-2xl shadow-black ${
          isPlayer ? 'opacity-100' : 'opacity-80'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-[8px] sm:text-[10px] text-center uppercase tracking-[0.2em] pointer-events-none p-4">
          {isPlayer ? 'Mago (Costas)' : 'Inimigo (Frente)'}
        </div>

        {isPlayer ? (
          <div className="absolute inset-x-4 bottom-0 h-4/5 bg-slate-900/80 rounded-t-3xl border-t border-slate-800" /> /* Capa */
        ) : (
          <div className="absolute inset-x-8 top-12 h-4 w-4 bg-slate-400/20 blur-sm rounded-full left-1/2 -translate-x-1/2" /> /* Olhos */
        )}
      </div>

      <div className={`mt-2 w-24 h-3 bg-black/40 blur-xl rounded-full ${isPlayer ? 'scale-150' : 'scale-100'}`} /> {/* Sombra */}
    </div>
  );
};
