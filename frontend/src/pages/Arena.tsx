import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WizardAvatar } from '../components/WizardAvatar';
import { HealthBar } from '../components/HealthBar';
import { AbilityHUD } from '../components/AbilityHUD';
import { CommandInput } from '../components/CommandInput';
import { GameOverModal } from '../components/GameOverModal';
import { socket } from '../socket';

interface FloatingText {
  id: number;
  value: number;
  type: 'damage' | 'heal';
  target: 'player' | 'enemy';
}

export default function Arena() {
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [gameOverData, setGameOverData] = useState<{ winnerId: string, winnerName: string } | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const prevHPs = useRef({ player: 100, enemy: 100 });
  const location = useLocation();
  const players = location.state?.players || [];
  const isHost = players[0]?.id === socket.id;

  useEffect(() => {
    socket.on('game-over', (data: { winnerId: string, winnerName: string }) => {
      setGameOverData(data);                           // Set game over data
    });

    socket.on('hp-update', (data: { player1HP: number, player2HP: number }) => {
      const newPlayerHP = isHost ? data.player1HP : data.player2HP;
      const newEnemyHP = isHost ? data.player2HP : data.player1HP;

      if (newPlayerHP !== prevHPs.current.player) {
        const diff = newPlayerHP - prevHPs.current.player;
        spawnFloatingText(Math.abs(diff), diff > 0 ? 'heal' : 'damage', 'player');
        setPlayerHP(newPlayerHP);
        prevHPs.current.player = newPlayerHP;
      }

      if (newEnemyHP !== prevHPs.current.enemy) {
        const diff = newEnemyHP - prevHPs.current.enemy;
        spawnFloatingText(Math.abs(diff), diff > 0 ? 'heal' : 'damage', 'enemy');
        setEnemyHP(newEnemyHP);
        prevHPs.current.enemy = newEnemyHP;
      }
    });

    return () => {
      socket.off('hp-update');
      socket.off('game-over');
    };
  }, [isHost]);

  const spawnFloatingText = (value: number, type: 'damage' | 'heal', target: 'player' | 'enemy') => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, value, type, target }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-serif tracking-widest overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-between p-8 sm:p-12">

        <div className="flex justify-end items-start"> {/* Top Section: Enemy */}
          <div className="flex flex-col items-center gap-4 relative">
            <AnimatePresence>
              {floatingTexts.filter(t => t.target === 'enemy').map(t => (
                <motion.span
                  key={t.id}
                  initial={{ y: 0, opacity: 0, scale: 0.5 }}
                  animate={{ y: -60, opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  className={`absolute -top-8 font-bold text-lg ${t.type === 'damage' ? 'text-red-500' : 'text-green-500'}`}
                >
                  {t.type === 'damage' ? '-' : '+'}{t.value}
                </motion.span>
              ))}
            </AnimatePresence>
            <HealthBar current={enemyHP} max={100} type="enemy" />
            <WizardAvatar type="enemy" />
          </div>
        </div>

        <div className="flex justify-center items-center"> {/* Middle Section: Command Input */}
          <CommandInput />
        </div>

        <div className="flex justify-start items-end"> {/* Bottom Section: Player */}
          <div className="flex flex-col items-center gap-4 relative">
            <AnimatePresence>
              {floatingTexts.filter(t => t.target === 'player').map(t => (
                <motion.span
                  key={t.id}
                  initial={{ y: 0, opacity: 0, scale: 0.5 }}
                  animate={{ y: -60, opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  className={`absolute -top-20 font-bold text-lg ${t.type === 'damage' ? 'text-red-500' : 'text-green-500'}`}
                >
                  {t.type === 'damage' ? '-' : '+'}{t.value}
                </motion.span>
              ))}
            </AnimatePresence>
            <WizardAvatar type="player" />
            <HealthBar current={playerHP} max={100} type="player" />
          </div>
        </div>
      </div>

      <div className="relative z-20 flex justify-center pb-8"> {/* HUD: Base da tela */}
        <AbilityHUD />
      </div>

      {gameOverData && (                               // Show modal on game over
        <GameOverModal
          winnerName={gameOverData.winnerName}
          isWinner={gameOverData.winnerId === socket.id}
        />
      )}
    </div>
  );
}
