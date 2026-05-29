# Quiz System (current)

The quiz engine and styling live in code:

- **Renderer (data → DOM)** → `shared/js/renderers/quiz.js`
- **Engine (state, scoring, retry, ≥70% pass)** → `shared/js/quiz.js`
- **Styling** → `shared/css/components/quiz.css`
- **Localised strings** → `shared/strings/<lang>.js` (keys: `quiz`, `quiz_submit`, `quiz_retry`, `quiz_correct`, `quiz_incorrect`, `quiz_select_all`, `quiz_score`, `quiz_pass`, `quiz_fail`)

Authoring a quiz is just data — see the `quiz` block schema in `../SKILL.md` and the example in `courses/_template/content/01-sample-chapter.js`. The engine handles all interaction and scoring; you only supply the questions.

> The previous version of this file documented a per-course inline quiz implementation that the project moved away from. Quizzes now run on the shared engine.
