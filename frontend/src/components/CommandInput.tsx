import React from 'react';

export const CommandInput: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <label className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-serif opacity-60">
        escrever as magias
      </label>
      <input
        type="text"
        autoFocus
        className="bg-transparent border-b border-slate-800/50 w-64 sm:w-80 px-4 py-2 text-center text-slate-100 placeholder-slate-700 focus:outline-none focus:border-red-900/40 transition-colors uppercase tracking-widest text-sm"
      />
    </div>
  );
};
