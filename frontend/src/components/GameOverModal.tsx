import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface GameOverModalProps {
  winnerName: string;                                  // Name of the winner
  isWinner: boolean;                                   // Whether the local player won
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ winnerName, isWinner }) => {
  const navigate = useNavigate();                      // Navigation hook

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}    // Initial animation state
        animate={{ opacity: 1, scale: 1, y: 0 }}       // Entrance animation
        className="relative w-full max-w-md p-8 bg-slate-900/40 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-8"
      >
        <div className="absolute inset-0.5 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent" />
        </div>

        <h2 className="relative text-3xl sm:text-4xl font-serif tracking-[0.2em] text-slate-100 text-center">
          {isWinner ? 'VITÓRIA' : 'DERROTA'}
        </h2>

        <p className="relative text-slate-400 text-xs tracking-widest uppercase opacity-60">
          {isWinner ? 'A batalha foi vencida.' : `Oponente ${winnerName} triunfou.`}
        </p>

        <button
          onClick={() => navigate('/')}                // Go back to home
          className="relative px-8 py-3 bg-transparent border border-slate-700 text-slate-300 text-[10px] tracking-[0.3em] uppercase hover:bg-slate-100 hover:text-slate-950 transition-all duration-300"
        >
          VOLTAR PARA HOME
        </button>
      </motion.div>
    </div>
  );
};
