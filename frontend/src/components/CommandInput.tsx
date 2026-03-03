import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { socket } from '../socket';

export const CommandInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [spells, setSpells] = useState<Record<string, string>>({});
  const location = useLocation();
  const controls = useAnimation();
  const language = location.state?.language || 'EN';

  useEffect(() => {
    const loadSpells = async () => {
      try {
        const response = await fetch(`/i18n/spells_${language.toLowerCase()}.json`);
        const data = await response.json();
        setSpells(data);
      } catch (err) {
        console.error('Failed to load spells', err);
      }
    };
    loadSpells();
  }, [language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();        // Get upper case value
    const spellValues = Object.values(spells).map(v => v.toUpperCase()); // List valid spells

    const isPrefix = spellValues.some(spell => spell.startsWith(value)); // Check if valid prefix

    if (value && !isPrefix) {                          // Invalid character typed
      setInput(value);                                 // Show invalid char briefly
      controls.start({                                 // Trigger shake animation
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
      setTimeout(() => setInput(''), 400);             // Clear after flash
      return;
    }

    setInput(value);                                   // Update state with valid prefix

    if (spellValues.includes(value)) {                 // Full spell match
      socket.emit('cast-spell', { spell: value });     // Emit spell cast
      setInput('');                                    // Reset input
    }
  };

  const isError = input && !Object.values(spells).some(s => s.toUpperCase().startsWith(input)); // Error state

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-serif opacity-60">
        escrever as magias
      </label>
      <motion.div animate={controls}>
        <input
          type="text"
          autoFocus
          value={input}
          onChange={handleChange}
          className={`bg-transparent border-b w-64 sm:w-80 px-4 py-2 text-center text-slate-100 placeholder-slate-700 focus:outline-none transition-colors uppercase tracking-widest text-sm ${
            isError
              ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' // Red flash
              : 'border-slate-800/50 focus:border-red-900/40'
          }`}
        />
      </motion.div>
    </div>
  );
};
