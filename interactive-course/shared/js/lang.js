export const SUPPORTED = ['en', 'fr'];
export const DEFAULT_LANG = 'en';

const STORAGE_KEY = 'courses-lang';

export function getLang() {
  const url = new URL(location.href);
  const fromUrl = url.searchParams.get('lang');
  if (SUPPORTED.includes(fromUrl)) {
    try { localStorage.setItem(STORAGE_KEY, fromUrl); } catch {}
    return fromUrl;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(stored)) return stored;
  } catch {}

  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('fr')) return 'fr';
  return DEFAULT_LANG;
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  location.href = url.toString();
}

export function pickLang(value, lang = getLang()) {
  if (value == null) return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[lang] ?? value[DEFAULT_LANG] ?? value.en ?? value.fr ?? '';
  }
  return value;
}
