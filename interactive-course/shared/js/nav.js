import { getStatus } from './progress.js';

/**
 * Builds the sidebar nav from a list of items that can be either flat
 * chapters or groups of the form { group, icon?, chapters: [...] }.
 * Groups render as collapsible sections (default open). Chapter numbering
 * stays continuous across groups.
 */
export function buildSidebarNav(items, navContainer) {
  navContainer.innerHTML = '';
  let chapterIndex = 0;

  items.forEach((item) => {
    if (item && Array.isArray(item.chapters)) {
      const groupEl = renderGroup(item, chapterIndex);
      navContainer.appendChild(groupEl);
      chapterIndex += item.chapters.length;
    } else {
      navContainer.appendChild(renderChapterLink(item, chapterIndex));
      chapterIndex += 1;
    }
  });
}

function renderGroup(group, startIndex) {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-group';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-group-toggle';
  toggle.setAttribute('aria-expanded', 'true');

  const icon = document.createElement('span');
  icon.className = 'nav-group-icon';
  icon.textContent = group.icon || '';
  if (icon.textContent) toggle.appendChild(icon);

  const label = document.createElement('span');
  label.className = 'nav-group-label';
  label.textContent = group.group;
  toggle.appendChild(label);

  const chevron = document.createElement('span');
  chevron.className = 'nav-group-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.innerHTML = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 6 8 10 12 6"/></svg>';
  toggle.appendChild(chevron);

  const list = document.createElement('div');
  list.className = 'nav-group-chapters';

  group.chapters.forEach((chapter, i) => {
    list.appendChild(renderChapterLink(chapter, startIndex + i));
  });

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });

  wrapper.appendChild(toggle);
  wrapper.appendChild(list);
  return wrapper;
}

function renderChapterLink(chapter, index) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-link';
  btn.dataset.section = chapter.id;

  const num = document.createElement('span');
  num.className = 'nav-num';
  num.textContent = String(index + 1).padStart(2, '0');
  btn.appendChild(num);

  const status = document.createElement('span');
  status.className = 'nav-status';
  status.dataset.status = getStatus(chapter.id);
  status.setAttribute('aria-hidden', 'true');
  btn.appendChild(status);

  const label = document.createElement('span');
  label.className = 'nav-link-label';
  label.textContent = chapter.title;
  btn.appendChild(label);

  btn.addEventListener('click', () => scrollToSection(chapter.id));
  return btn;
}

export function refreshNavStatus() {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const id = link.dataset.section;
    const dot = link.querySelector('.nav-status');
    if (id && dot) dot.dataset.status = getStatus(id);
  });
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Close sidebar on mobile after navigation
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');
  sidebar?.classList.remove('open');
  backdrop?.classList.remove('open');
}

export function attachScrollSpy(chapters) {
  const sections = chapters
    .map((c) => document.getElementById(c.id))
    .filter(Boolean);
  const links = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => {
            const isActive = l.dataset.section === entry.target.id;
            l.classList.toggle('active', isActive);
            if (isActive) {
              const group = l.closest('.nav-group');
              const toggle = group?.querySelector('.nav-group-toggle');
              if (toggle && toggle.getAttribute('aria-expanded') !== 'true') {
                toggle.setAttribute('aria-expanded', 'true');
              }
            }
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
  );

  sections.forEach((s) => observer.observe(s));
}

export function attachMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');

  menuBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop?.classList.toggle('open');
  });

  backdrop?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  });
}
