const STORAGE_KEY = 'courses-theme';

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  setTheme(saved);
}

export function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  const btn = document.querySelector('[data-theme-toggle]');
  if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

export function toggleTheme() {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
}
