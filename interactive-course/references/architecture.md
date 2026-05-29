# Architecture (current)

The architecture lives in actual code, not docs. When authoring a course:

- **Block types & renderers** → `shared/js/renderers/index.js` (registry) and the sibling files in that folder.
- **CSS / theming** → `shared/css/index.css` imports tokens, layout, components.
- **Course shell** → `courses/_template/index.html` + `course.config.js`.
- **A worked example of every block** → `courses/_template/content/01-sample-chapter.js`.

For the authoring workflow and block schema reference, see `../SKILL.md`.

> The previous version of this file documented a single-file HTML architecture that the project moved away from. If you need to migrate an old single-file course (e.g., the legacy `*.html` files at the repo root), port its chapters into the new data-driven structure described in SKILL.md.
