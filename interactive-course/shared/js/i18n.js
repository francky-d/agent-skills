import en from '../strings/en.js';
import fr from '../strings/fr.js';
import { getLang as detectLang, setLang, pickLang } from './lang.js';

const dictionaries = { en, fr };

let current = en;
let currentLang = 'en';

export function setLanguage(lang) {
  current = dictionaries[lang] || en;
  currentLang = dictionaries[lang] ? lang : 'en';
}

export function getLanguage() {
  return currentLang;
}

export function t(key, fallback = key) {
  return current[key] ?? fallback;
}

export { detectLang, setLang, pickLang };
