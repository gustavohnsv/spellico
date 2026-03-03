import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { socket } from '../socket';

export default function Waiting() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('room-ready', (data) => {
      navigate('/arena', { state: { language: data.language, players: data.players } });
    });

    return () => {
      socket.off('room-ready');
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-serif tracking-widest">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-sm text-slate-500 mb-4"
      >
        AGUARDANDO CONEXÃO
      </motion.div>

      <div className="text-6xl text-slate-100 tracking-[1em] mr-[-1em]">
        {code}
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-24 text-xs text-slate-600 hover:text-slate-400 transition-colors"
      >
        ABANDONAR SALA
      </button>
    </div>
  );
}
