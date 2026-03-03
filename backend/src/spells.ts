import fs from 'fs';                                   // File system module
import path from 'path';                               // Path utility module
import { fileURLToPath } from 'url';                   // URL to path utility

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Directory name
const I18N_PATH = path.join(__dirname, '../../i18n');  // Path to i18n folder

export interface SpellStat {
  damage: number;                                      // Damage value
  heal: number;                                        // Healing value
  cooldown: number;                                    // Cooldown in ms
}

export const SPELL_STATS: Record<string, SpellStat> = {
  FIRE: { damage: 10, heal: 0, cooldown: 1000 },       // Basic attack
  EMBER: { damage: 20, heal: 0, cooldown: 5000 },      // Light attack
  HEAT_WAVE: { damage: 35, heal: 0, cooldown: 10000 }, // Medium attack
  FLAMETHROWER: { damage: 60, heal: 0, cooldown: 20000 }, // Ultimate attack
  HEAL: { damage: 0, heal: 30, cooldown: 15000 },      // Recovery
};

const i18nCache: Record<string, Record<string, string>> = {}; // Local cache

const loadI18n = (lang: 'EN' | 'PT') => {
  if (i18nCache[lang]) return i18nCache[lang];         // Return from cache if available
  const filePath = path.join(I18N_PATH, `spells_${lang.toLowerCase()}.json`); // JSON path
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')); // Read and parse
  i18nCache[lang] = data;                              // Store in cache
  return data;                                         // Return data
};

export const getSpellIdByName = (name: string, lang: 'EN' | 'PT'): string | undefined => {
  const data = loadI18n(lang);                         // Load translations
  return Object.keys(data).find(key => data[key].toUpperCase() === name.toUpperCase()); // Find key
};
