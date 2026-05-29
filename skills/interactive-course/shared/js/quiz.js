import { t } from './i18n.js';

/**
 * Wires up a single .quiz container. Quiz state is local — no localStorage.
 * Expects markup produced by renderers/quiz.js.
 */
export function attachQuiz(container) {
  const submit = container.querySelector('.quiz-submit');
  const retry = container.querySelector('.quiz-retry');
  const result = container.querySelector('.quiz-result');
  const questions = container.querySelectorAll('.quiz-question');

  if (!submit || questions.length === 0) return;

  submit.addEventListener('click', () => {
    let allAnswered = true;
    let correct = 0;

    questions.forEach((q) => {
      const selected = q.querySelector('input[type="radio"]:checked');
      if (!selected) { allAnswered = false; return; }

      const correctIdx = parseInt(q.dataset.correct, 10);
      const isCorrect = parseInt(selected.value, 10) === correctIdx;
      if (isCorrect) correct += 1;

      q.querySelectorAll('.quiz-option').forEach((opt) => {
        opt.classList.remove('correct', 'incorrect');
      });
      const chosenOpt = selected.closest('.quiz-option');
      const correctOpt = q.querySelector(`.quiz-option[data-idx="${correctIdx}"]`);
      if (chosenOpt) chosenOpt.classList.add(isCorrect ? 'correct' : 'incorrect');
      if (correctOpt && !isCorrect) correctOpt.classList.add('correct');

      const feedback = q.querySelector('.quiz-feedback');
      if (feedback) {
        feedback.classList.add('show', isCorrect ? 'correct' : 'incorrect');
        feedback.classList.remove(isCorrect ? 'incorrect' : 'correct');
        const symbolEl = feedback.querySelector('.quiz-feedback-symbol');
        if (symbolEl) symbolEl.textContent = isCorrect ? t('quiz_correct') : t('quiz_incorrect');
      }
    });

    if (!allAnswered) {
      alert(t('quiz_select_all'));
      return;
    }

    const total = questions.length;
    const passed = correct / total >= 0.7;
    const scoreLine = t('quiz_score').replace('{score}', correct).replace('{total}', total);
    const verdict = passed ? t('quiz_pass') : t('quiz_fail');

    result.innerHTML = `${scoreLine}<br>${verdict}`;
    result.classList.add('show', passed ? 'pass' : 'fail');
    result.classList.remove(passed ? 'fail' : 'pass');

    submit.disabled = true;
    if (retry) retry.hidden = false;
  });

  if (retry) {
    retry.hidden = true;
    retry.addEventListener('click', () => {
      questions.forEach((q) => {
        q.querySelectorAll('input[type="radio"]').forEach((r) => { r.checked = false; });
        q.querySelectorAll('.quiz-option').forEach((o) => o.classList.remove('correct', 'incorrect'));
        const fb = q.querySelector('.quiz-feedback');
        if (fb) {
          fb.classList.remove('show', 'correct', 'incorrect');
          const sym = fb.querySelector('.quiz-feedback-symbol');
          if (sym) sym.textContent = '';
        }
      });
      result.classList.remove('show', 'pass', 'fail');
      result.innerHTML = '';
      submit.disabled = false;
      retry.hidden = true;
    });
  }
}

export function attachAllQuizzes(root = document) {
  root.querySelectorAll('.quiz').forEach(attachQuiz);
}
