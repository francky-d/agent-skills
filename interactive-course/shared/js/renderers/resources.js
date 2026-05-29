import { setInline } from './inline.js';

/**
 * Block shape:
 *   { type: 'resources',
 *     groups: [
 *       { title: '📖 Official', items: [{ href: 'https://…', label: '…', note: '…' }] },
 *     ] }
 */
export default function renderResources(block) {
  const wrap = document.createElement('div');
  wrap.className = 'resources';

  (block.groups || []).forEach((group) => {
    const g = document.createElement('section');
    g.className = 'resources-group';

    if (group.title) {
      const h = document.createElement('h4');
      h.className = 'resources-group-title';
      setInline(h, group.title);
      g.appendChild(h);
    }

    const ul = document.createElement('ul');
    ul.className = 'resources-list';
    (group.items || []).forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      setInline(a, item.label);
      li.appendChild(a);
      if (item.note) {
        const note = document.createElement('span');
        note.className = 'resources-note';
        if (String(item.note).includes('<')) {
          note.innerHTML = `— ${item.note}`;
        } else {
          note.textContent = `— ${item.note}`;
        }
        li.appendChild(note);
      }
      ul.appendChild(li);
    });
    g.appendChild(ul);
    wrap.appendChild(g);
  });

  return wrap;
}
