import { t } from '../i18n.js';
import { setInline } from './inline.js';

export default function renderPrerequisites(block) {
  const wrap = document.createElement('aside');
  wrap.className = 'prerequisites';
  wrap.setAttribute('role', 'note');

  const label = document.createElement('div');
  label.className = 'prerequisites-label';
  label.textContent = `🎒 ${block.label || t('prerequisites')}`;
  wrap.appendChild(label);

  const body = document.createElement('div');
  body.className = 'prerequisites-body';

  if (Array.isArray(block.items) && block.items.length) {
    const ul = document.createElement('ul');
    block.items.forEach((item) => {
      const li = document.createElement('li');
      setInline(li, item);
      ul.appendChild(li);
    });
    body.appendChild(ul);
  } else if (block.html) {
    const div = document.createElement('div');
    div.innerHTML = block.html;
    body.appendChild(div);
  } else if (block.text) {
    const p = document.createElement('p');
    setInline(p, block.text);
    body.appendChild(p);
  }

  wrap.appendChild(body);
  return wrap;
}
