import { motion } from 'framer-motion';

export default function Home() {
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
          className="bg-transparent border-b border-slate-700 p-2 text-center focus:outline-none focus:border-slate-500 uppercase"
        />

        <input
          type="text"
          placeholder="CÓDIGO DA SALA"
          className="bg-transparent border-b border-slate-700 p-2 text-center focus:outline-none focus:border-slate-500 uppercase"
        />

        <div className="flex items-center gap-4">
          <div className="h-[1px] bg-slate-800 flex-1" />
          <span className="text-sm text-slate-500">ou</span>
          <div className="h-[1px] bg-slate-800 flex-1" />
        </div>

        <button className="border border-slate-700 py-3 hover:bg-slate-900 transition-colors">
          CRIAR SALA
        </button>
      </div>
    </div>
  );
}
