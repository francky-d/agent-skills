import { renderBlock } from './renderers/index.js';
import { setInline } from './renderers/inline.js';
import { t } from './i18n.js';
import { scrollToSection } from './nav.js';
import { getStatus, toggleFinished, markFinished, subscribe } from './progress.js';

export function renderCourse(config, root) {
  const title = config._title || config.title;
  const duration = config._duration || config.duration;
  document.title = title;

  const html = `
    <button class="menu-btn" aria-label="${t('open_menu')}" type="button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <div class="sidebar-backdrop"></div>

    <div class="app">
      <aside class="sidebar" aria-label="Course chapters">
        <div class="sidebar-header">
          <div>
            <div class="sidebar-title">${escapeHtml(title)}</div>
            <a class="sidebar-back" href="../../index.html">${t('back_to_catalog')}</a>
          </div>
          <div class="sidebar-actions">
            <div class="lang-switch" role="group" aria-label="${t('toggle_lang')}">
              <button type="button" data-lang-switch="en">EN</button>
              <button type="button" data-lang-switch="fr">FR</button>
            </div>
            <button class="theme-toggle" data-theme-toggle aria-label="${t('toggle_theme')}" type="button">🌙</button>
          </div>
        </div>
        <nav class="sidebar-nav" id="sidebar-nav"></nav>
        <div class="sidebar-footer">
          <span style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(duration || '')}</span>
        </div>
      </aside>

      <main class="main">
        <div class="progress-bar"><div class="progress-bar-fill" id="progress-fill"></div></div>
        <article class="content" id="content"></article>
      </main>
    </div>
  `;

  root.innerHTML = html;

  const content = root.querySelector('#content');

  const chapters = config._flatChapters || config.chapters;
  chapters.forEach((chapter, i) => {
    const section = document.createElement('section');
    section.id = chapter.id;
    section.className = 'chapter';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'chapter-eyebrow';
    eyebrow.textContent = `${String(i + 1).padStart(2, '0')} · ${chapter.eyebrow || ''}`.replace(/ · $/, '');
    section.appendChild(eyebrow);

    const h1 = document.createElement('h1');
    h1.textContent = chapter.title;
    section.appendChild(h1);

    if (chapter.intro) {
      const p = document.createElement('p');
      if (typeof chapter.intro === 'string') setInline(p, chapter.intro);
      else p.innerHTML = chapter.intro.html;
      section.appendChild(p);
    }

    (chapter.blocks || []).forEach((block) => {
      section.appendChild(renderBlock(block));
    });

    section.appendChild(buildFinishButton(chapter.id));
    section.appendChild(buildChapterNav(chapters, i));
    content.appendChild(section);
  });
}

function buildFinishButton(chapterId) {
  const wrap = document.createElement('div');
  wrap.className = 'chapter-finish';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'chapter-finish-btn';

  const paint = () => {
    const finished = getStatus(chapterId) === 'finished';
    btn.dataset.finished = String(finished);
    btn.textContent = finished ? t('mark_finished_undo') : t('mark_finished');
    btn.setAttribute('aria-pressed', String(finished));
  };

  btn.addEventListener('click', () => toggleFinished(chapterId));
  subscribe(paint);
  paint();

  wrap.appendChild(btn);
  return wrap;
}

function buildChapterNav(chapters, index) {
  const nav = document.createElement('div');
  nav.className = 'chapter-nav';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'nav-btn prev';
  if (index > 0) {
    const target = chapters[index - 1];
    prev.innerHTML = `<span class="nav-btn-label">← ${t('prev')}</span><span class="nav-btn-title">${escapeHtml(target.title)}</span>`;
    prev.addEventListener('click', () => scrollToSection(target.id));
  } else {
    prev.disabled = true;
    prev.innerHTML = `<span class="nav-btn-label">${t('prev')}</span><span class="nav-btn-title">—</span>`;
  }

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'nav-btn next';
  if (index < chapters.length - 1) {
    const target = chapters[index + 1];
    next.innerHTML = `<span class="nav-btn-label">${t('next')} →</span><span class="nav-btn-title">${escapeHtml(target.title)}</span>`;
    next.addEventListener('click', () => {
      markFinished(chapters[index].id);
      scrollToSection(target.id);
    });
  } else {
    next.disabled = true;
    next.innerHTML = `<span class="nav-btn-label">${t('next')}</span><span class="nav-btn-title">—</span>`;
  }

  nav.appendChild(prev);
  nav.appendChild(next);
  return nav;
}

function escapeHtml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
