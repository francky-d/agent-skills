# skills

A small collection of [Claude Code](https://claude.com/claude-code) skills,
maintained as standalone, self-contained folders. Drop one into your project's
`.claude/skills/` (or your global `~/.claude/skills/`) and Claude can use it.

## Skills in this repo

### [`interactive-course/`](./interactive-course/)

A zero-build engine for **premium interactive crash courses on any subject** —
programming, design, science, business, languages, history, music, cooking,
finance, anything teachable. Authors write content as plain JavaScript data
objects (typed blocks: explanation, analogy, code, quiz, diagram, …) and the
shared layer renders accessible, themed, responsive courses with sidebar
navigation, scroll-spy progress, syntax-highlighted code, MCQ quizzes, dark/light
theme, and i18n. No build step. No JS dependencies. Deployable to GitHub Pages
or Vercel.

**Live demo:** [a Git Basics example course](./interactive-course/courses/example-course/)
(serve `interactive-course/` over HTTP — see below).

## Install a skill

Pick a skill folder and copy it into the project (or user) `.claude/skills/`
directory Claude reads from.

```bash
# Per-project
mkdir -p my-project/.claude/skills
cp -R interactive-course my-project/.claude/skills/

# Or globally for your user
mkdir -p ~/.claude/skills
cp -R interactive-course ~/.claude/skills/
```

Then ask Claude something the skill is designed for — e.g. *"create an
interactive crash course on X"* — and the matching skill activates.

## Run the demo locally

ES modules don't work over `file://`, so the demo needs a tiny HTTP server.
From the repo root:

```bash
cd interactive-course
python3 -m http.server 8000
# open http://localhost:8000/
```

The catalog page is `interactive-course/index.html`. The example course lives
at `interactive-course/courses/example-course/`.

## Repo layout

```
skills/
├── README.md
├── LICENSE
├── .gitignore
└── interactive-course/        ← the skill, self-contained
    ├── SKILL.md               ← what Claude reads
    ├── references/            ← deeper docs referenced from SKILL.md
    ├── shared/                ← the rendering engine (CSS, JS, strings)
    ├── courses/
    │   ├── _template/         ← skeleton consumers copy when authoring a course
    │   └── example-course/    ← Git Basics demo
    └── index.html             ← live catalog landing page
```

`interactive-course/` is fully self-contained: SKILL.md tells Claude to copy
`shared/` and `courses/_template/` into the consumer's project the first time it
creates a course, so the template's `../../shared/...` imports resolve from
`<project>/courses/<slug>/`.

## License

MIT © 2026 Franck Djacoto. See [LICENSE](./LICENSE).
