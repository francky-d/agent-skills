import { t } from '../i18n.js';
import { setInline } from './inline.js';

export default function renderAnalogy(block) {
  const wrap = document.createElement('aside');
  wrap.className = 'analogy';
  wrap.setAttribute('role', 'note');

  const icon = document.createElement('div');
  icon.className = 'analogy-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = block.icon || '💡';
  wrap.appendChild(icon);

  const body = document.createElement('div');
  body.className = 'analogy-body';

  const label = document.createElement('div');
  label.className = 'analogy-label';
  label.textContent = block.label || t('analogy');
  body.appendChild(label);

  if (block.html) {
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
