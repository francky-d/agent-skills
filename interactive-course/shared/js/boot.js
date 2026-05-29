import { renderCourse } from './course.js';
import { setLanguage, getLanguage } from './i18n.js';
import { getLang, setLang, pickLang } from './lang.js';
import { initTheme, toggleTheme } from './theme.js';
import { buildSidebarNav, attachScrollSpy, attachMobileMenu, refreshNavStatus } from './nav.js';
import { initProgress, getLastChapter, subscribe, refresh as refreshProgress } from './progress.js';
import { attachAllQuizzes } from './quiz.js';
import { attachCopyButtons } from './copy.js';
import { attachTabs } from './tabs.js';

export async function boot(configInput) {
  const lang = getLang();
  setLanguage(lang);

  const config = await resolveConfig(configInput, lang);
  config._navItems = config.chapters;
  config._flatChapters = flattenChapters(config.chapters);
  validateConfig(config);

  config._activeLang = lang;
  config._title = pickLang(config.title, lang);
  config._duration = pickLang(config.duration, lang);

  document.documentElement.lang = lang;

  applyThemeOverrides(config.theme);

  const root = document.getElementById('course-root');
  if (!root) throw new Error('boot(): #course-root element missing in HTML');

  renderCourse(config, root);

  initTheme();
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', toggleTheme);
  attachLangSwitcher();

  buildSidebarNav(config._navItems, document.getElementById('sidebar-nav'));
  attachScrollSpy(config._flatChapters);
  attachMobileMenu();

  initProgress(config.slug, config._flatChapters, document.getElementById('progress-fill'));
  subscribe(refreshNavStatus);
  // Sidebar dots and finish buttons were built before initProgress set the
  // slug, so their initial state reflected an empty slug. Re-fan now.
  refreshProgress();

  resumeLastChapter(config._flatChapters);

  attachAllQuizzes(root);
  attachCopyButtons(root);
  attachTabs(root);
}

function resumeLastChapter(chapters) {
  const lastId = getLastChapter();
  if (!lastId) return;
  if (chapters[0] && chapters[0].id === lastId) return;
  const el = document.getElementById(lastId);
  if (!el) return;
  // Instant (not smooth) — initial-load scrolls fight with image/font reflow.
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

function flattenChapters(items) {
  const out = [];
  items.forEach((item) => {
    if (item && Array.isArray(item.chapters)) {
      item.chapters.forEach((c) => out.push(c));
    } else {
      out.push(item);
    }
  });
  return out;
}

async function resolveConfig(configInput, lang) {
  const value = typeof configInput === 'function' ? configInput(lang) : configInput;
  return value instanceof Promise ? await value : value;
}

function attachLangSwitcher() {
  document.querySelectorAll('[data-lang-switch]').forEach((el) => {
    const target = el.dataset.langSwitch;
    if (!target) return;
    el.addEventListener('click', () => setLang(target));
    if (target === getLanguage()) el.setAttribute('aria-current', 'true');
  });
}

function validateConfig(config) {
  if (!config) throw new Error('boot(): config is required');
  if (!config.slug) throw new Error('boot(): config.slug is required');
  if (!config.title) throw new Error('boot(): config.title is required');
  if (!Array.isArray(config.chapters) || config.chapters.length === 0) {
    throw new Error('boot(): config.chapters must be a non-empty array');
  }
  if (!Array.isArray(config._flatChapters) || config._flatChapters.length === 0) {
    throw new Error('boot(): no chapters found (groups may be empty)');
  }

  const ids = new Set();
  config._flatChapters.forEach((chapter, i) => {
    if (!chapter.id) throw new Error(`Chapter ${i} is missing an id`);
    if (!chapter.title) throw new Error(`Chapter ${chapter.id} is missing a title`);
    if (ids.has(chapter.id)) throw new Error(`Duplicate chapter id: ${chapter.id}`);
    ids.add(chapter.id);
    (chapter.blocks || []).forEach((block, bi) => {
      if (!block.type) throw new Error(`Chapter ${chapter.id}, block ${bi} is missing a type`);
    });
  });
}

function applyThemeOverrides(theme) {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.accent) root.style.setProperty('--accent', theme.accent);
  if (theme.secondary) root.style.setProperty('--secondary', theme.secondary);
}
