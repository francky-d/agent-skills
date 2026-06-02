# agent-skills

🇫🇷 *Version française : [README_FR.md](./README_FR.md)*

A small collection of skills for AI coding agents, maintained as standalone,
self-contained folders. Each skill is a `SKILL.md` (plus optional supporting
files) describing a specialized capability the agent can use.

Works with any agent that reads skill folders — [Claude Code](https://claude.com/claude-code),
the [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview), and
other clients adopting the same convention. Drop a skill into the location your
agent reads from (e.g. `.claude/skills/` for Claude Code) and it becomes
available.

## Skills in this repo

### [`skills/interactive-course/`](./skills/interactive-course/)

A zero-build engine for **premium interactive crash courses on any subject** —
programming, design, science, business, languages, history, music, cooking,
finance, anything teachable. Authors write content as plain JavaScript data
objects (typed blocks: explanation, analogy, code, quiz, diagram, …) and the
shared layer renders accessible, themed, responsive courses with sidebar
navigation, scroll-spy progress, syntax-highlighted code, MCQ quizzes, dark/light
theme, and i18n. No build step. No JS dependencies. Deployable to GitHub Pages
or Vercel.

**Live demo:** [a Git Basics example course](./skills/interactive-course/courses/example-course/)
(serve `skills/interactive-course/` over HTTP — see below).

### [`skills/commit/`](./skills/commit/)

Write **high-quality git commit messages** that follow Conventional Commits and
explain the *why* behind a change. The skill reads the actual diff (`git status`,
`git diff --staged`, `git log`) to understand both what changed and the project's
existing style, then enforces **atomic commits** — splitting unrelated edits
into separate, focused commits with imperative subjects and motivation-first
bodies. By default it only proposes the message(s); it doesn't run `git commit`
unless asked.

## Install a skill

Pick a skill folder under `skills/` and copy it into the directory your agent
reads skills from. For Claude Code, that's `.claude/skills/` in the project or
`~/.claude/skills/` globally; for other clients, check their documentation.

```bash
# Per-project (Claude Code)
mkdir -p my-project/.claude/skills
cp -R skills/interactive-course my-project/.claude/skills/
cp -R skills/commit             my-project/.claude/skills/

# Or globally for your user (Claude Code)
mkdir -p ~/.claude/skills
cp -R skills/interactive-course ~/.claude/skills/
cp -R skills/commit             ~/.claude/skills/
```

Then ask the agent something the skill is designed for — e.g. *"create an
interactive crash course on X"* or *"write a commit message for these
changes"* — and the matching skill activates.

## Run the demo locally

ES modules don't work over `file://`, so the demo needs a tiny HTTP server.
From the repo root:

```bash
cd skills/interactive-course
python3 -m http.server 8000
# open http://localhost:8000/
```

The catalog page is `skills/interactive-course/index.html`. The example course
lives at `skills/interactive-course/courses/example-course/`.

## Repo layout

```text
skills/                            ← repo root
├── README.md
├── LICENSE
├── .gitignore
└── skills/                        ← all skills live here
    ├── commit/                    ← commit-message skill (single SKILL.md)
    └── interactive-course/        ← course-authoring skill, self-contained
        ├── SKILL.md               ← what Claude reads
        ├── references/            ← deeper docs referenced from SKILL.md
        ├── shared/                ← the rendering engine (CSS, JS, strings)
        ├── courses/
        │   ├── _template/         ← skeleton consumers copy when authoring a course
        │   └── example-course/    ← Git Basics demo
        └── index.html             ← live catalog landing page
```

`skills/interactive-course/` is fully self-contained: SKILL.md tells Claude to
copy `shared/` and `courses/_template/` into the consumer's project the first
time it creates a course, so the template's `../../shared/...` imports resolve
from `<project>/courses/<slug>/`.

## License

MIT © 2026 Franck Djacoto. See [LICENSE](./LICENSE).
