import { highlight } from '../highlight.js';
import { setInline } from './inline.js';

/**
 * Block shape:
 *   { type: 'side-by-side',
 *     left:  { title: 'Before', html: '<p>…</p>' },
 *     right: { title: 'After',  code: { lang: 'ts', code: '…' } } }
 *
 * Each panel accepts one of:
 *   - html: '...'                  → rendered as trusted HTML
 *   - code: { lang, code }         → rendered as a syntax-highlighted <pre><code>
 *   - text: '...'                  → rendered as plain text
 */
export default function renderSideBySide(block) {
  const wrap = document.createElement('div');
  wrap.className = 'side-by-side';

  ['left', 'right'].forEach((key) => {
    const data = block[key];
    if (!data) return;
    const panel = document.createElement('div');
    panel.className = 'side-panel';

    if (data.title) {
      const h = document.createElement('div');
      h.className = 'side-panel-header';
      h.textContent = data.title;
      panel.appendChild(h);
    }
    const body = document.createElement('div');
    body.className = 'side-panel-body';

    if (data.code && typeof data.code === 'object' && typeof data.code.code === 'string') {
      const pre = document.createElement('pre');
      pre.className = 'code-block';
      const codeEl = document.createElement('code');
      codeEl.className = `language-${data.code.lang || 'text'}`;
      codeEl.innerHTML = highlight(data.code.code, data.code.lang);
      pre.appendChild(codeEl);
      body.appendChild(pre);
    } else if (data.html) {
      body.innerHTML = data.html;
    } else if (data.text) {
      setInline(body, data.text);
    }

    panel.appendChild(body);
    wrap.appendChild(panel);
  });

  return wrap;
}
