import { setInline } from './inline.js';

/**
 * Block shape: { type: 'quote', text: '…', attribution: 'Author, Source' }
 */
export default function renderQuote(block) {
  const wrap = document.createElement('blockquote');
  wrap.className = 'quote';

  const text = document.createElement('p');
  text.className = 'quote-text';
  setInline(text, block.text || '');
  wrap.appendChild(text);

  if (block.attribution) {
    const attr = document.createElement('cite');
    attr.className = 'quote-attribution';
    setInline(attr, block.attribution);
    wrap.appendChild(attr);
  }

  return wrap;
}
