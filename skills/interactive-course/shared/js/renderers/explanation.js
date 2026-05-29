import { setInline } from './inline.js';

export default function renderExplanation(block) {
  const wrap = document.createElement('div');
  wrap.className = 'explanation';
  if (block.html) {
    wrap.innerHTML = block.html;
  } else if (block.text) {
    const p = document.createElement('p');
    setInline(p, block.text);
    wrap.appendChild(p);
  }
  return wrap;
}
