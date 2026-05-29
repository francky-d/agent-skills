import { setInline } from './inline.js';

export default function renderSvg(block) {
  const wrap = document.createElement('figure');
  wrap.className = 'diagram';

  if (block.svg) {
    // Inline SVG markup string
    wrap.innerHTML = block.svg;
    const svg = wrap.querySelector('svg');
    if (svg) {
      svg.setAttribute('role', 'img');
      if (block.label) svg.setAttribute('aria-label', block.label);
    }
  } else if (block.src) {
    const img = document.createElement('img');
    img.src = block.src;
    img.alt = block.label || '';
    img.setAttribute('role', 'img');
    wrap.appendChild(img);
  }

  if (block.caption) {
    const cap = document.createElement('figcaption');
    cap.className = 'diagram-caption';
    setInline(cap, block.caption);
    wrap.appendChild(cap);
  }

  return wrap;
}
