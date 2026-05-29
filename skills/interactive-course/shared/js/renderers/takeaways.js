import { t } from '../i18n.js';
import { setInline } from './inline.js';

export default function renderTakeaways(block) {
  const wrap = document.createElement('aside');
  wrap.className = 'takeaways';
  wrap.setAttribute('role', 'note');

  const label = document.createElement('div');
  label.className = 'takeaways-label';
  label.textContent = `✓ ${block.label || t('takeaways')}`;
  wrap.appendChild(label);

  const ul = document.createElement('ul');
  (block.items || []).forEach((item) => {
    const li = document.createElement('li');
    setInline(li, item);
    ul.appendChild(li);
  });
  wrap.appendChild(ul);
  return wrap;
}
