import { t } from '../i18n.js';
import { setInline } from './inline.js';

/**
 * Block shape:
 *   { type: 'worked-example',
 *     title: 'Compute the gross margin',
 *     steps: [{ text: '…', cue: '…' }, ...] }
 */
export default function renderWorkedExample(block) {
  const wrap = document.createElement('div');
  wrap.className = 'worked-example';

  const header = document.createElement('div');
  header.className = 'worked-example-header';
  header.textContent = block.title || t('example');
  wrap.appendChild(header);

  const body = document.createElement('div');
  body.className = 'worked-example-body';

  (block.steps || []).forEach((step, i) => {
    const row = document.createElement('div');
    row.className = 'worked-step';

    const num = document.createElement('div');
    num.className = 'worked-step-num';
    num.textContent = String(i + 1);
    row.appendChild(num);

    const stepBody = document.createElement('div');
    stepBody.className = 'worked-step-body';

    const p = document.createElement('p');
    if (typeof step === 'string') {
      setInline(p, step);
    } else {
      if (step.html) p.innerHTML = step.html;
      else setInline(p, step.text || '');
    }
    stepBody.appendChild(p);

    if (step && step.cue) {
      const cue = document.createElement('span');
      cue.className = 'worked-step-cue';
      setInline(cue, step.cue);
      stepBody.appendChild(cue);
    }

    row.appendChild(stepBody);
    body.appendChild(row);
  });

  wrap.appendChild(body);
  return wrap;
}
