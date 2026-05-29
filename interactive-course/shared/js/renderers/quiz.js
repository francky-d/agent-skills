import { t } from '../i18n.js';

let qId = 0;

/**
 * Block shape:
 *   { type: 'quiz',
 *     title: 'Quick check',  // optional
 *     questions: [
 *       { q: 'prompt', options: ['a','b','c','d'], correct: 1, explanation: '…' }, ...
 *     ] }
 */
export default function renderQuiz(block) {
  const wrap = document.createElement('section');
  wrap.className = 'quiz';
  wrap.setAttribute('aria-label', t('quiz'));

  const label = document.createElement('div');
  label.className = 'quiz-label';
  label.textContent = `❓ ${t('quiz')}`;
  wrap.appendChild(label);

  if (block.title) {
    const title = document.createElement('h3');
    title.className = 'quiz-title';
    title.textContent = block.title;
    wrap.appendChild(title);
  }

  (block.questions || []).forEach((question, qIndex) => {
    const groupName = `q-${++qId}`;
    const qWrap = document.createElement('div');
    qWrap.className = 'quiz-question';
    qWrap.dataset.correct = String(question.correct);

    const prompt = document.createElement('div');
    prompt.className = 'quiz-prompt';
    prompt.innerHTML = `<span class="quiz-prompt-num">${qIndex + 1}</span>${question.q || ''}`;
    qWrap.appendChild(prompt);

    const options = document.createElement('div');
    options.className = 'quiz-options';

    (question.options || []).forEach((opt, idx) => {
      const optWrap = document.createElement('label');
      optWrap.className = 'quiz-option';
      optWrap.dataset.idx = String(idx);

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = groupName;
      radio.value = String(idx);

      const text = document.createElement('span');
      text.className = 'quiz-option-label';
      text.innerHTML = opt;

      optWrap.appendChild(radio);
      optWrap.appendChild(text);
      options.appendChild(optWrap);
    });

    qWrap.appendChild(options);

    const fb = document.createElement('div');
    fb.className = 'quiz-feedback';
    const sym = document.createElement('span');
    sym.className = 'quiz-feedback-symbol';
    fb.appendChild(sym);
    if (question.explanation) {
      const exp = document.createElement('span');
      exp.innerHTML = question.explanation;
      fb.appendChild(exp);
    }
    qWrap.appendChild(fb);

    wrap.appendChild(qWrap);
  });

  const actions = document.createElement('div');
  actions.className = 'quiz-actions';

  const submit = document.createElement('button');
  submit.className = 'quiz-submit';
  submit.type = 'button';
  submit.textContent = t('quiz_submit');

  const retry = document.createElement('button');
  retry.className = 'quiz-retry';
  retry.type = 'button';
  retry.textContent = t('quiz_retry');
  retry.hidden = true;

  actions.appendChild(submit);
  actions.appendChild(retry);
  wrap.appendChild(actions);

  const result = document.createElement('div');
  result.className = 'quiz-result';
  result.setAttribute('role', 'status');
  result.setAttribute('aria-live', 'polite');
  wrap.appendChild(result);

  return wrap;
}
