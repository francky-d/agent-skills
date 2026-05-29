import { highlight } from '../highlight.js';

let uid = 0;
const nextId = (prefix) => `${prefix}-${++uid}`;

/**
 * Block shape:
 *   { type: 'code', lang: 'js', code: '…' }
 *   { type: 'code', tabs: [{ name: 'Before', lang: 'js', code: '…' }, { name: 'After', lang: 'js', code: '…' }] }
 */
export default function renderCodeBlock(block) {
  const wrap = document.createElement('div');
  wrap.className = 'code-block';
  wrap.setAttribute('data-tabs', '');

  const tabs = block.tabs || [{ name: block.filename || block.lang || 'code', lang: block.lang, code: block.code }];

  if (tabs.length > 1) {
    const tabBar = document.createElement('div');
    tabBar.className = 'code-tabs';
    tabBar.setAttribute('role', 'tablist');

    tabs.forEach((tab, i) => {
      const tabBtn = document.createElement('button');
      tabBtn.className = 'code-tab';
      tabBtn.setAttribute('role', 'tab');
      tabBtn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      const panelId = nextId('panel');
      tab._panelId = panelId;
      tabBtn.setAttribute('aria-controls', panelId);
      tabBtn.textContent = tab.name;
      tabBar.appendChild(tabBtn);
    });
    wrap.appendChild(tabBar);
  }

  tabs.forEach((tab, i) => {
    const panel = document.createElement('div');
    panel.className = 'code-panel' + (i === 0 ? ' active' : '');
    panel.setAttribute('role', 'tabpanel');
    panel.id = tab._panelId || nextId('panel');

    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const filename = document.createElement('span');
    filename.textContent = tab.filename || tab.name || tab.lang || '';
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    const codeId = nextId('code');
    copyBtn.setAttribute('data-copy-target', codeId);
    toolbar.appendChild(filename);
    toolbar.appendChild(copyBtn);

    const pre = document.createElement('pre');
    pre.tabIndex = 0;
    const codeEl = document.createElement('code');
    codeEl.id = codeId;
    codeEl.innerHTML = highlight(tab.code || '', tab.lang || block.lang);
    pre.appendChild(codeEl);

    panel.appendChild(toolbar);
    panel.appendChild(pre);
    wrap.appendChild(panel);
  });

  return wrap;
}
