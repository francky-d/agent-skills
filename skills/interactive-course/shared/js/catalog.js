  import { setLanguage, t } from './i18n.js';
  import { getLang, setLang } from './lang.js';

  const lang = getLang();
  setLanguage(lang);
  document.documentElement.lang = lang;

  // Apply text translations
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });

  // Apply attribute translations: data-i18n-attr="placeholder:key"
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });

  // Card titles, descriptions, level, hours, chapters
  document.querySelectorAll('.card').forEach((card) => {
    const title = card.dataset[`title${cap(lang)}`] || card.dataset.titleEn || '';
    const desc = card.dataset[`desc${cap(lang)}`] || card.dataset.descEn || '';
    const level = card.dataset.level;
    const hours = card.dataset.hours;
    const chapters = card.dataset.chapters;

    const titleEl = card.querySelector('[data-card-title]');
    if (titleEl) titleEl.innerHTML = title;
    const descEl = card.querySelector('[data-card-desc]');
    if (descEl) descEl.innerHTML = desc;

    const levelEl = card.querySelector('[data-card-level]');
    if (levelEl && level) levelEl.textContent = t(`level_${level}`, level);

    const hoursEl = card.querySelector('[data-card-hours]');
    if (hoursEl && hours) hoursEl.textContent = t('meta_hours', '~{n} hours').replace('{n}', hours);

    const chaptersEl = card.querySelector('[data-card-chapters]');
    if (chaptersEl && chapters) chaptersEl.textContent = t('meta_chapters', '{n} chapters').replace('{n}', chapters);
  });

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  // Wire language switcher
  document.querySelectorAll('[data-lang-switch]').forEach((el) => {
    const target = el.dataset.langSwitch;
    if (target === lang) el.setAttribute('aria-current', 'true');
    el.addEventListener('click', () => setLang(target));
  });

  // Theme toggle with persistence
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('courses-theme');
  if (saved) {
    body.dataset.theme = saved;
    themeToggle.textContent = saved === 'dark' ? '🌙' : '☀️';
  }
  themeToggle.addEventListener('click', () => {
    const next = body.dataset.theme === 'dark' ? 'light' : 'dark';
    body.dataset.theme = next;
    themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('courses-theme', next);
  });

  const allCards = document.querySelectorAll('.card');
  const totalCourses = allCards.length;
  document.getElementById('totalCount').textContent = totalCourses;

  function setHeroCount() {
    const key = totalCourses === 1 ? 'cat_hero_badge_one' : 'cat_hero_badge';
    document.getElementById('heroCount').textContent = t(key).replace('{count}', totalCourses);
  }
  setHeroCount();

  // Per-subject totals shown next to each sidebar item
  function updateSidebarCounts() {
    document.querySelectorAll('[data-subject-count]').forEach((el) => {
      const subj = el.dataset.subjectCount;
      const count = subj === 'all'
        ? allCards.length
        : document.querySelectorAll(`.card[data-subject="${subj}"]`).length;
      el.textContent = count;
    });
  }
  updateSidebarCounts();

  // Search + filter
  const searchInput = document.getElementById('searchInput');
  const chips = document.querySelectorAll('.chip');
  const emptyState = document.getElementById('emptyState');
  const subjectNav = document.getElementById('subjectNav');
  let activeSubject = 'all';
  let activeFilter = 'all';

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    let visible = 0;
    allCards.forEach((card) => {
      const matchesSubject = activeSubject === 'all' || card.dataset.subject === activeSubject;
      const matchesFilter = activeFilter === 'all' || card.dataset.topic === activeFilter;
      const haystack = (card.dataset.keywords + ' ' + card.textContent).toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      const show = matchesSubject && matchesFilter && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    emptyState.hidden = visible !== 0;
  }

  searchInput.addEventListener('input', applyFilters);

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  // Subject drawer
  const sidebar = document.getElementById('catSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarCloseBtn = document.getElementById('sidebarClose');

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    sidebarBackdrop.hidden = true;
    sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openSidebar() {
    sidebar.classList.add('is-open');
    sidebarBackdrop.hidden = false;
    sidebarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  sidebarToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('is-open')) closeSidebar();
    else openSidebar();
  });
  sidebarBackdrop.addEventListener('click', closeSidebar);
  sidebarCloseBtn?.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) closeSidebar();
  });

  const catalogSection = document.getElementById('catalog');
  function scrollToCatalog() {
    if (!catalogSection) return;
    const headerOffset = document.querySelector('header')?.offsetHeight || 0;
    const top = catalogSection.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  subjectNav.querySelectorAll('.cat-nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      subjectNav.querySelectorAll('.cat-nav-item').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeSubject = btn.dataset.subject;
      applyFilters();
      closeSidebar();
      // Wait for drawer-close transition + scroll-lock release before scrolling
      requestAnimationFrame(() => setTimeout(scrollToCatalog, 80));
    });
  });
