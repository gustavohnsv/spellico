import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import CreateRoomModal from '../components/CreateRoomModal';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('room-created', ({ code }) => {
      navigate(`/waiting/${code}`, { state: { nickname } });
    });

    socket.on('room-ready', (data) => {
      navigate('/arena', { state: { language: data.language, players: data.players } });
    });

    socket.on('room-error', ({ message }) => {
      alert(message);                                  // Basic error handling
    });

    return () => {
      socket.off('room-created');
      socket.off('room-ready');
      socket.off('room-error');
    };
  }, [navigate, nickname]);

  const handleJoin = () => {
    if (!nickname || !roomCode) return;
    socket.emit('join-room', { nickname, code: roomCode.toUpperCase() });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-serif tracking-widest">
      <motion.h1
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl mb-24"
      >
        SPELLICO
      </motion.h1>

      <div className="w-full max-w-xs flex flex-col gap-6">
        <input
          type="text"
          placeholder="APELIDO"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="bg-transparent border-b border-slate-700 p-2 text-center focus:outline-none focus:border-slate-500 uppercase"
        />

        <input
          type="text"
          placeholder="CÓDIGO DA SALA"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          className="bg-transparent border-b border-slate-700 p-2 text-center focus:outline-none focus:border-slate-500 uppercase"
        />

        <div className="flex items-center gap-4">
          <div className="h-[1px] bg-slate-800 flex-1" />
          <span className="text-sm text-slate-500">ou</span>
          <div className="h-[1px] bg-slate-800 flex-1" />
        </div>

        <button
          onClick={() => nickname && setShowModal(true)}
          className="border border-slate-700 py-3 hover:bg-slate-900 transition-colors disabled:opacity-50"
          disabled={!nickname}
        >
          CRIAR SALA
        </button>
      </div>

      {showModal && (
        <CreateRoomModal
          nickname={nickname}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
