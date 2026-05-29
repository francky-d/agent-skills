import { setInline } from './inline.js';

/**
 * Block shape:
 *   { type: 'advanced-topics',
 *     items: [{ title: '…', what: '…', why: '…' }] }
 */
export default function renderAdvancedTopics(block) {
  const wrap = document.createElement('div');
  wrap.className = 'advanced-topics';

  (block.items || []).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'advanced-topic';

    const title = document.createElement('div');
    title.className = 'advanced-topic-title';
    setInline(title, item.title);
    card.appendChild(title);

    const what = document.createElement('p');
    what.className = 'advanced-topic-what';
    setInline(what, item.what);
    card.appendChild(what);

    if (item.why) {
      const why = document.createElement('p');
      why.className = 'advanced-topic-why';
      setInline(why, item.why);
      card.appendChild(why);
    }

    wrap.appendChild(card);
  });

  return wrap;
}
