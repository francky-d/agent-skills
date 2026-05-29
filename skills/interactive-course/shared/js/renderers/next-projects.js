import { setInline } from './inline.js';
import { t } from '../i18n.js';

/**
 * Block shape:
 *   { type: 'next-projects',
 *     items: [{ title: '…', difficulty: 'easy'|'intermediate'|'challenging',
 *               reinforces: ['…','…'], description: '…' }] }
 */
const DIFF_KEY = {
  easy: 'difficulty_easy',
  intermediate: 'difficulty_intermediate',
  challenging: 'difficulty_challenging',
};

export default function renderNextProjects(block) {
  const wrap = document.createElement('div');
  wrap.className = 'next-projects';

  (block.items || []).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'next-project';

    const title = document.createElement('div');
    title.className = 'next-project-title';
    setInline(title, item.title);
    card.appendChild(title);

    if (item.description) {
      const p = document.createElement('p');
      setInline(p, item.description);
      card.appendChild(p);
    }

    const meta = document.createElement('div');
    meta.className = 'next-project-meta';
    if (item.difficulty) {
      const diff = document.createElement('span');
      diff.className = `difficulty ${item.difficulty}`;
      const key = DIFF_KEY[item.difficulty];
      diff.textContent = key ? t(key) : item.difficulty;
      meta.appendChild(diff);
    }
    if (item.reinforces && item.reinforces.length) {
      const r = document.createElement('span');
      r.textContent = `${t('reinforces')}: ${item.reinforces.join(' · ')}`;
      meta.appendChild(r);
    }
    card.appendChild(meta);

    wrap.appendChild(card);
  });

  return wrap;
}
