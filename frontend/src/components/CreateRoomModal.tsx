import { motion } from 'framer-motion';
import { socket } from '../socket';

interface Props {
  nickname: string;
  onClose: () => void;
}

export default function CreateRoomModal({ nickname, onClose }: Props) {
  const handleCreate = (language: 'EN' | 'PT') => {
    socket.emit('create-room', { nickname, language });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900/40 border border-slate-700 p-8 rounded-lg glassmorphism max-w-sm w-full mx-4 flex flex-col items-center gap-8"
      >
        <h2 className="text-xl text-slate-300">IDIOMA DA SALA</h2>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => handleCreate('EN')}
            className="flex-1 border border-slate-700 py-4 hover:bg-slate-800 transition-colors"
          >
            ENGLISH
          </button>
          <button
            onClick={() => handleCreate('PT')}
            className="flex-1 border border-slate-700 py-4 hover:bg-slate-800 transition-colors"
          >
            PORTUGUÊS
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-4"
        >
          CANCELAR
        </button>
      </motion.div>
    </div>
  );
}
