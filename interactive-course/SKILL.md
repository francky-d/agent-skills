---
name: interactive-course
description: 'Create premium interactive crash courses on ANY subject — programming, design, science, business, languages, history, music, cooking, finance, anything teachable. Use this skill whenever the user asks to create a course, tutorial, lesson, learning module, crash course, bootcamp, or interactive guide. Also trigger when the user says "teach me X", "create a course about Y", "build an interactive tutorial", "make a learning platform for Z", or wants to turn documentation/knowledge into an engaging educational experience. The skill produces a small, well-structured course folder under `courses/<slug>/` that consumes the shared engine in `shared/` (CSS, JS renderers, quiz system, theme, nav). Authors write content as JS data objects — chapters and typed blocks — never raw HTML. The shared layer renders accessible, themed, responsive UI with sidebar navigation, progress tracking, SVG diagrams, syntax-highlighted code blocks (when applicable), MCQ quizzes, dark/light theme. No build step, no JS dependencies — pure HTML/CSS/ESM, deployable to Vercel or GitHub Pages. Default assumption: the reader is a complete beginner with zero prior knowledge of the topic. Before generating the course, run a short knowledge-assessment interview (via AskUserQuestion) to learn the reader''s actual level, goals, language, and adjacent background — then tailor the depth, analogies, and examples accordingly. After the assessment, ALWAYS present a course outline (chapter list with one-line descriptions per chapter) and obtain explicit user validation BEFORE writing any chapter file. Apply the **Zero-to-Expert Pareto Path**: identify the 20% of concepts, idioms, and best practices that take a learner from zero to expert-level competence on the subject (not a superficial overview — a real path to proficiency). Structure chapters as **progressive layers** — Foundations → Core Mechanics → Idioms & Best Practices → Expert Patterns & Pitfalls. For technical subjects (languages, frameworks, tools), include a mandatory "Best Practices & Idioms" chapter covering community conventions, idiomatic patterns, anti-patterns, performance gotchas, and security defaults. Every course MUST end with a mandatory "Where to Go From Here" closing chapter that includes a learning roadmap, advanced topics not covered, suggested next projects, curated external resources, and a final recap quiz.'
---

# Interactive Course Builder

Build premium, well-structured interactive crash courses on **any subject the user requests** — technical (programming, DevOps, data, ML), creative (design, music, writing), scientific (biology, physics, statistics), practical (cooking, gardening, finance), human (languages, history, philosophy), or anything else teachable. The output should feel like a high-end learning platform (think: Josh Comeau, Scrimba, Frontend Masters, MasterClass, Brilliant) — not a boring static page.

The skill is **subject-agnostic**. Nothing assumes the topic involves code. Code-related blocks (syntax-highlighted code blocks, multi-tab examples) are optional and only used when the topic actually involves code.

## Architecture (read this first)

Courses live in `courses/<slug>/` and consume a shared engine in `shared/`. Authors write **content as data**, never markup.

This skill ships **bundled inside itself** with everything needed to render a course. The first time you create a course in a fresh project, you copy the bundled `shared/` engine and `courses/_template/` skeleton out to the project root (see "Setup" below), so the relative paths the template uses (`../../shared/...`) resolve.

### How the skill is laid out (what's inside this skill folder)

```
interactive-course/                ← this skill, self-contained
├── SKILL.md                       ← you're reading it
├── references/                    ← deeper docs (architecture, quiz, svg)
├── shared/                        ← the rendering engine to copy into projects
│   ├── css/   (tokens, reset, layout, typography, responsive, components/)
│   ├── js/    (boot, course, theme, nav, progress, quiz, highlight,
│   │          copy, tabs, i18n, renderers/)
│   └── strings/  (en.js, fr.js, …)
├── courses/
│   ├── _template/                 ← skeleton to copy into projects
│   └── example-course/            ← live demo (Git Basics)
└── index.html                     ← slim catalog landing page
```

### What a target project looks like after setup

```
<project-root>/
├── index.html                     ← optional: catalog (only if the project has one)
├── shared/                        ← copied from the skill on first course
├── courses/
│   ├── _template/                 ← copied from the skill on first course
│   └── <your-slug>/               ← what you create per course
│       ├── index.html             ← thin shell (~14 lines)
│       ├── course.config.js       ← course metadata + chapter import order
│       ├── course.css             ← per-course overrides (usually empty)
│       └── content/
│           ├── 00-intro.js
│           ├── 01-…js
│           └── 99-where-to-go.js
```

The shell at `courses/<slug>/index.html` only loads `shared/css/index.css` and the course's `course.config.js`, then calls `boot(config)`. The shared engine handles everything else: sidebar, scroll-spy, progress bar, mobile menu, theme toggle, quiz state, copy buttons, tab switching.

**You will not write HTML for chapters.** You write data objects that the renderer turns into accessible HTML for you. Most courses won't need to touch `course.css` either.

## Setup — getting the engine into a project (Required, once per project)

Before authoring the first course in a given project, make sure the project has the engine and template in place at the project root:

1. **Check** whether `<project-root>/shared/` exists. If it does, skip this step — the engine is already installed.
2. **If absent**, copy the skill's bundled engine and template out to the project root, preserving structure:
   - `<skill>/shared/` → `<project-root>/shared/`
   - `<skill>/courses/_template/` → `<project-root>/courses/_template/`
3. **Contract:** the engine must live at `<project-root>/shared/` and every course must live at `<project-root>/courses/<slug>/`. The template's `index.html` uses `../../shared/css/index.css` and `../../shared/js/boot.js`, which resolve to the project's `shared/` from that depth. If the project insists on a different layout, you must edit those two relative paths in every course `index.html` to match.

Do this copy **once per project**. Subsequent courses in the same project reuse the existing `shared/`.

## Step 0 — Assess the Learner Before You Build (Required)

**Default assumption:** the reader is a complete beginner with zero prior knowledge of the subject. Build for that audience by default.

Before writing a single line, run a short knowledge-assessment interview using the `AskUserQuestion` tool. The goal is to confirm the default assumption or adjust it — not to pad the workflow. Ask **2 to 4 well-chosen questions in a single call**, then proceed.

Recommended questions (pick the ones that matter for this topic; don't ask all):

1. **Current familiarity with the subject** — *"Never heard of it"*, *"Heard about it, never used/practiced it"*, *"Used/practiced a bit"*, *"Comfortable, want to go deeper"*. Sets the baseline depth.
2. **Adjacent background** — what related things they already know, so you can bridge from the familiar to the new. (Programming: which languages/frameworks. Music: which instruments. Languages: which other languages. Finance: whether they already know basic accounting. Etc.)
3. **Goal / what they want to be able to do** — *"Build a small project"*, *"Pass an exam"*, *"Have an informed conversation"*, *"Make a real decision"*, *"Just curious"*. Shapes the closing chapter's project suggestions.
4. **Preferred course language** — only ask if it isn't obvious. Default to the language the user is already using with you.

Other questions are situational and optional: course length (short/medium/deep), preferred analogy theme, learning style preference, accessibility needs.

If the user has already given you all this information in their initial request, **skip the interview** — don't ask questions you already know the answer to. If they explicitly say "just build it" or push back, respect that and proceed with the beginner default.

Use the answers to pick:
- **Depth & pacing** — beginners get more analogies, more diagrams, smaller steps; intermediates get faster bridging from what they already know.
- **Analogy universe** — choose analogies grounded in the learner's existing world.
- **Examples** — concrete, realistic, drawn from their stated goal when possible.
- **Course language** — set `lang: 'en' | 'fr' | …` in `course.config.js`. Translatable UI strings live in `shared/strings/<lang>.js` — if the learner picks a language not yet in `shared/strings/`, add a new `<lang>.js` file by copying `en.js` and translating its values. The renderer pulls every UI string (sidebar back link, prev/next buttons, quiz feedback, results) from this file — no hardcoded strings in the wrong language.

## Step 1 — Propose the Course Plan & Get Validation (Required)

**Hard rule: never start writing chapter files until the user has explicitly validated the outline.** Skipping this step wastes the user's time when the structure is wrong, and it wastes generation effort on chapters that get thrown out.

After Step 0, write a single short message to the user containing the proposed plan. Keep it scannable — bullet points, not prose paragraphs.

### What the plan must include

- **Slug, title, language, estimated duration, chapter count.** One line.
- **Chapter list, in order, tagged by layer.** For each chapter: number, working title, **its progression layer** (Foundations / Core Mechanics / Idioms & Best Practices / Expert Patterns), and a one-line description of what it covers (≤ 20 words). Explicitly include `00-intro` and `99-where-to-go` so the user sees the full arc. The user should be able to see at a glance that all four layers are covered.
- **Best practices chapter.** For technical subjects (language, framework, tool), name the chapter that will carry idiomatic style, anti-patterns, perf, and security. If the subject is non-technical, say so explicitly so the user can ask for one anyway if they want it.
- **The Pareto cut.** Briefly call out the 2–4 topics you are deliberately *leaving out of the main flow* and pushing to the closing chapter's "Advanced topics" section. Frame them with the proficiency test: *"not needed to reach proficiency on this subject"*. This makes scope explicit.
- **Anything that depends on a judgement call you made.** For example: "I grouped X and Y into one chapter rather than splitting them — let me know if you'd rather have them separate." Surface 1–2 such decisions max; don't pad.

### How to ask for validation

End the message with a direct yes/no/adjust prompt. Acceptable phrasings:

- *"Plan OK pour moi de continuer ? Si tu veux ajouter / retirer / fusionner / réordonner un chapitre, dis-le."*
- *"Does this outline look right? I'll start writing the chapters once you confirm — tell me if you want to add, drop, or reorder anything."*

Match the user's language. **Do not** call any other tool in the same turn — wait for the user's reply.

### What counts as validation

Proceed only on a clear positive signal: *"OK"*, *"go"*, *"validé"*, *"yes proceed"*, *"looks good"*, or a list of specific edits followed by approval. If the user replies with edits but no approval, apply the edits and present the updated plan again — keep iterating until they explicitly green-light it.

If the user says *"just build it, I trust you"* or similar at the assessment stage, you may skip the validation pause — but still write the plan into the message that *starts* the build, so they can interrupt if it's off.

### What NOT to do

- Don't bundle the plan with code edits or tool calls in the same turn — the user can't validate and stop you mid-flight.
- Don't present a 3-line plan ("Intro / 5 chapters / Closing"). The point is for the user to catch missing or misordered concepts; that needs per-chapter detail.
- Don't ask about plan changes via `AskUserQuestion` — the answer space is too open-ended. Plain text + free-form reply is the right interface here.

## Authoring Workflow

1. **Read `courses/_template/`** — `index.html`, `course.config.js`, and the three chapter files. They demonstrate every block type.
2. **Decide the slug** — short, lowercase, dash-separated, no spaces (e.g., `docker`, `financial-statements`, `music-theory`).
3. **Copy the template:** create `courses/<slug>/` with the same shape: `index.html`, `course.config.js`, `course.css` (can stay empty), `content/`.
4. **Update `index.html`** — change the `<title>` to the course title; everything else stays.
5. **Fill in `course.config.js`** — `slug`, `title`, `lang`, `duration`, optional `theme.accent` / `theme.secondary`, and the `chapters` array (import each chapter file).
6. **Write the chapters** as data objects (see schema below). One file per chapter under `content/`. Apply the 80/20 rule and the learning architecture.
7. **Write the mandatory closing chapter** as `99-where-to-go.js` — see "Closing Chapter" section.
8. **Translate UI strings** — if `config.lang` is not yet supported in `shared/strings/`, copy `en.js` to `shared/strings/<lang>.js` and translate the values.
9. **Register the course in the project's root `index.html`** (only if the project has one) — see "Catalog Registration".
10. **Verify locally** — run `python3 -m http.server` (or `npx serve`) from the project root and open `http://localhost:8000/courses/<slug>/`. ES modules will not work over `file://`.

## Schemas

### `course.config.js`

```js
import intro from './content/00-intro.js';
import chapter1 from './content/01-…js';
// …
import closing from './content/99-where-to-go.js';

export default {
  slug: 'docker',                  // required, matches folder name
  title: 'Docker — Crash Course',  // required
  lang: 'en',                      // required, matches a file in shared/strings/
  duration: '~3 hours',            // optional, displayed in sidebar footer
  theme: {                         // optional, overrides --accent / --secondary
    accent: '#6366f1',
    secondary: '#22d3ee',
  },
  chapters: [intro, chapter1, /* … */, closing],
};
```

**Optional: chapter groups (collapsible sidebar sections).** For courses with many chapters that fall into clear themes (e.g., one group per cloud provider, one group per topic family), you can wrap chapters in groups. The sidebar then shows each group as a collapsible section (default expanded) while content flows linearly and chapter numbering stays continuous.

```js
chapters: [
  intro,                                              // flat top-level chapter
  { group: 'Foundations', icon: '🌍',
    chapters: [foundations1, foundations2] },         // collapsible group
  { group: 'AWS', icon: '🟧',
    chapters: [aws1, aws2, aws3] },
  recap,                                              // flat top-level
  closing,
]
```

Groups are pure UI grouping — they don't affect prev/next nav, scroll-spy, progress, or chapter ids. Use them when the course has 12+ chapters and a clear hierarchical structure helps readers; skip them for short courses.

### Chapter

```js
export default {
  id: 'containers',          // required, unique per course, used as DOM id + scroll-spy target
  eyebrow: 'Foundations',    // optional, small uppercase label above the title
  title: 'What is a container?',  // required
  intro: 'A short prose intro paragraph.', // optional; string OR { html: '…' }
  blocks: [ /* see block types below */ ],  // required
};
```

### Block types (the only blocks the renderer knows)

Use these exact `type` strings. The renderer is registered in `shared/js/renderers/index.js`. To add a new type, drop a renderer file there and register it.

| `type`              | Required fields                                       | Use for                                          |
|---------------------|-------------------------------------------------------|--------------------------------------------------|
| `explanation`       | `html` *or* `text`                                    | Free prose — paragraphs, lists, inline `<code>`  |
| `analogy`           | `text` *or* `html`; optional `icon`, `label`          | The everyday-life metaphor that opens a concept  |
| `svg` / `diagram`   | `svg` (inline markup) *or* `src`; `label`; `caption?` | Inline SVG diagrams (preferred) or external img  |
| `code`              | `lang` + `code`, *or* `tabs: [{name, lang, code, filename?}]` | Code (single or tabbed variants)         |
| `comparison-table`  | `headers: string[]`, `rows: any[][]`                  | Map new concept ↔ known concept                  |
| `worked-example`    | `title?`, `steps: (string \| {text, cue?})[]`         | Step-by-step solutions for non-code topics       |
| `side-by-side`      | `left: {title?, html}`, `right: {title?, html}`       | Before/after, language A/B, raw/interpretation   |
| `quote`             | `text`, `attribution?`                                | Literature, philosophy, history passages         |
| `quiz`              | `questions: [{q, options[], correct, explanation?}]`, `title?` | Per-chapter MCQs (3–5) and final recap (8–12) |
| `takeaways`         | `items: string[]`                                     | The 3 bullets ending each chapter                |
| `resources`         | `groups: [{title, items: [{href, label, note?}]}]`    | External links grouped by category               |
| `advanced-topics`   | `items: [{title, what, why?}]`                        | Closing chapter — topics not covered             |
| `next-projects`     | `items: [{title, description?, difficulty, reinforces?}]`, `difficulty: 'easy'\|'intermediate'\|'challenging'` | Closing chapter — practice ideas |

The `_template` course exercises every block type — read it.

**HTML strings:** fields ending in `html` accept trusted HTML. Keep markup minimal — most cases need only `<p>`, `<strong>`, `<em>`, `<code>`, lists, and the occasional `<a>`. Don't embed full block UIs inside `html` — use the proper block type instead.

**Inline SVGs:** include `viewBox` for responsiveness. The `svg` renderer adds `role="img"` automatically; pass a `label` so it gets `aria-label`. Maintain WCAG AA contrast and never use white-on-green or red-on-green text. **For visual style — colored boxes, arrows, swimlanes, onion layers, roadmaps — read [`references/svg-diagrams.md`](references/svg-diagrams.md) before authoring a diagram.** Default to coloring boxes with theme tokens (`var(--accent)`, `var(--secondary)`, `var(--success)`, `var(--warning)`, `var(--danger)`, `var(--pink)`) rather than `currentColor` — token colors switch with the theme automatically and look polished; pure `currentColor` reads as a flat wireframe.

## Course Design Principles

### Build for Absolute Beginners by Default
Unless the assessment proves otherwise, write as if the reader has **never encountered the subject before**:
- Define every term the first time you use it. No unexplained jargon.
- Never assume the reader knows what a related concept "is" — give a one-line plain-language definition first.
- Use analogies from everyday life (kitchens, houses, sports, traffic, money, relationships) before reaching for technical analogies.
- Show, don't just tell. The first appearance of any new idea comes with a concrete example or visual.

If the assessment shows the learner is past the absolute-beginner stage, you can compress the basics — but never skip them entirely; make them a quick "Refresher" panel they can scan or skip.

### The Zero-to-Expert Pareto Path
Pareto here is a **trajectory**, not a shortcut. The course must identify the 20% of concepts, idioms, and best practices that genuinely take a learner from zero to expert-level competence on the subject — not the 20% that produces a superficial overview. Test for vital-few inclusion: *"Without this, can someone be considered proficient by a senior practitioner? Without this, will they ship something embarrassing?"* If yes, it stays in the main flow. If no, it goes to the closing chapter's "Advanced topics not covered". The aim is a learner who, after finishing, can build, decide, and reason at a level a senior peer would respect — not one who has heard every term once.

### Progression Layers (Required Structure)
Order chapters as a deliberate climb through four layers. Every course must cover all four — though chapter count per layer scales with topic depth.

1. **Foundations** — what the thing *is*, the mental model, the vocabulary. Usually 1–2 chapters after the intro. Goal: the learner can read intermediate material without feeling lost.
2. **Core Mechanics** — the day-to-day operations: the 5–8 things a practitioner actually does most of the time. Usually 2–4 chapters. Goal: the learner can do a realistic task end-to-end.
3. **Idioms & Best Practices** — community conventions, idiomatic style, the "right way" vs the "naive way", anti-patterns, performance and security defaults, code-review nits. Usually 1–2 chapters (mandatory for languages/frameworks/tools — see below). Goal: the learner writes/does things the way a senior peer would.
4. **Expert Patterns & Pitfalls** — the patterns that separate journeymen from experts: trade-offs, when-to-break-the-rule, gotchas earned from production scars, edge cases real teams hit. Usually 1–2 chapters. Goal: the learner can navigate ambiguity, not just follow recipes.

Set each chapter's `eyebrow:` field to its layer name ("Foundations", "Core Mechanics", "Idioms & Best Practices", "Expert Patterns") so the sidebar telegraphs the progression. For 12+ chapter courses, prefer the chapter-groups form in `course.config.js` with one group per layer.

### Best Practices & Idioms Chapter (Required for technical subjects)
When the subject is a **programming language, framework, library, CLI tool, or developer-facing platform**, the course MUST include at least one chapter dedicated to idiomatic usage and best practices — typically the last chapter of the "Idioms & Best Practices" layer. It is not enough to sprinkle "good practice" notes across chapters; the learner needs a focused chapter that says *"here is how a senior person uses this thing"*.

Required content for that chapter:
- **Idiomatic style** — naming conventions, file organisation, the "blessed" way the community writes code in this stack. Use `side-by-side` blocks: naive code vs idiomatic code, with the diff explained.
- **Anti-patterns** — 4–6 concrete things to avoid, each with a one-line "why it bites you later". Use a `comparison-table` (Don't / Do / Why).
- **Performance gotchas** — the 2–4 mistakes that cause real performance problems (N+1 queries, unbounded recursion, hot-path allocations, missing indexes, blocking the event loop — whatever applies).
- **Security defaults** — the must-know defaults (escape user input, parameterised queries, principle of least privilege, secrets handling, CSRF/CORS/headers as relevant). If the topic has known footguns (`eval`, prototype pollution, SSRF, unsafe deserialization, etc.), name them.
- **Testing & tooling** — the recommended test runner, formatter, linter, type checker (when applicable), and what each is for. Short — pointers, not tutorials.
- **Code review checklist** — a final `takeaways`-style list of ~8 things a reviewer of this stack would flag.

For non-technical subjects (history, cooking, music theory, finance, etc.), this chapter is optional but encouraged — adapt it as "Conventions & Craft": how practitioners actually do this thing in the real world, common mistakes, taste markers, communities of practice.

### The Feynman Technique
Explain every concept as if teaching a curious beginner. If you can't explain it simply, you don't understand it well enough.

### Learning Architecture (per chapter)

```
1. ANALOGY      → Hook with a relatable everyday metaphor   (analogy block)
2. EXPLANATION  → Build understanding step by step          (explanation block)
3. DIAGRAM      → Visual reinforcement                      (svg block)
4. CONCRETE     → Code, worked example, recipe, case study  (code or worked-example block)
5. COMPARISON   → Map new concept to what learner knows     (comparison-table block)
6. QUIZ         → 3–5 MCQs                                  (quiz block)
7. TAKEAWAYS    → 3 bullets summarising the essentials      (takeaways block)
8. RESOURCES    → Links to authoritative sources (optional) (resources block)
```

Not every chapter needs all 8 elements — use judgment. But every chapter MUST contain at minimum: an analogy or explanation, at least one concrete example or diagram, a quiz, and key takeaways.

### Analogies
- Every major concept gets a real-life analogy.
- Use a consistent analogy universe when possible (all restaurant-themed, all house-themed, all road-trip-themed).
- The analogy must map cleanly — if it requires too many caveats, pick a different one.
- Prefer analogies grounded in the learner's stated background.

### Concrete Examples
The form of "concrete example" depends on the subject:
- **Programming / DevOps / data** → `code` blocks with realistic, syntactically correct code.
- **Math / science / statistics** → `worked-example` blocks plus `svg` diagrams.
- **Design / UI / UX** → annotated `svg` blocks or styled `side-by-side` mockups.
- **Languages** → `side-by-side` blocks with literal-translation gloss + natural translation.
- **Cooking / craft** → `worked-example` blocks with a `cue` on each step ("you'll see / smell / feel …").
- **Business / finance** → `worked-example` blocks with numbers, plus `comparison-table` blocks.
- **History / philosophy / soft topics** → short narrative `explanation` + `quote` block + cause-effect `svg`.

Whatever the form, make it **realistic and concrete** — never vague placeholder content. If the learner has a stated goal, tailor at least one example per chapter to that goal.

### Code Examples (when the topic involves code)
- ALL code must be syntactically correct and realistic — never placeholder/pseudocode.
- Use the `tabs` form of the `code` block when comparing approaches ("Before"/"After", "Approach A"/"Approach B").
- Include comments that reinforce the analogy.
- If the learner has a known tech background, bridge from their stack to the new one.

### Comparison Tables
- Use when bridging from a known concept to a new one (or contrasting two new concepts).
- Include a "Role" / "Why" / "When to use" column — not just "A = B".

### Quizzes
- 3–5 MCQs after each main chapter; 8–12 MCQs in the closing chapter's final recap.
- Questions test UNDERSTANDING, not memorization.
- Include plausible distractors that address common misconceptions.
- Include `explanation` strings — the renderer shows them as feedback after submission.
- The shared `quiz` engine handles state, scoring, retry, and the "≥70% = pass" message — you only supply the data.

## The Closing Chapter: "Where to Go From Here" (Required)

Every course must end with this chapter. It transforms the course from a finite tutorial into the start of a real learning journey. Without it, the learner is left wondering "what now?" — and that's a failure of the course, not the learner.

### Title

Default to **"Where to Go From Here"**. Acceptable variations when they fit the course tone better: *"Next Steps"*, *"Continue Your Journey"*, *"What's Next"*, *"Beyond This Course"*. Keep it inviting, never patronizing. Translate the title to the learner's chosen language.

### Required block sequence (in this order)

1. **Roadmap diagram** — `svg` block. Subway map / skill tree showing where they started → what this course covered (✅ completed) → what comes next (branching to advanced topics). Apply the same accessibility rules as all other SVGs (`label` for `aria-label`, WCAG AA contrast, no white-on-green / red-on-green). Use the course's color palette: completed nodes in `var(--success)`, current frontier in `var(--accent)`, future nodes muted/dashed.

2. **Advanced topics not covered** — `advanced-topics` block. 4–8 items. Each item: `title`, `what` (one-sentence plain-language explanation, with an analogy if it helps), `why` (one-sentence "when the learner will need it"). Be honest about why it was skipped: *"This adds complexity that pays off only at scale — come back when you have 1000+ users."* / *"This is mostly relevant for professional performers."*

3. **Suggested next projects** — `next-projects` block. 3–5 concrete next-step ideas. Each item: `title`, `description?`, `difficulty: 'easy' | 'intermediate' | 'challenging'`, `reinforces: string[]` (the 2–3 concepts/skills it practices). Build on the course's running example/project when possible (continuity > novelty).

   For non-doing topics (history, philosophy, theory), use a `resources` block titled "Suggested Next Reads & Reflections" instead, with a guided reading list, a reflection prompt, or a debate/discussion question.

4. **Curated external resources** — `resources` block, grouped:
   - `📖 Official / Authoritative Sources` — primary documentation, official websites, source texts
   - `📚 Books` — title + author + one-line "why this book" (use `note`)
   - `🎥 Talks & Videos` — conference talks, lectures, YouTube channels
   - `🎓 Courses` — paid or free deep-dive courses
   - `🛠 Tools / Instruments / Materials` — what to explore next in the ecosystem (only if relevant)
   - `👥 Communities` — Discord, subreddits, forums, Stack Overflow tags, meetups

   Quality over quantity: 3 great resources per category beats 10 mediocre ones. All `href`s must be real `https://…` URLs (the renderer adds `target="_blank" rel="noopener"` automatically).

5. **Final recap quiz** — `quiz` block with `title: 'Final recap'` and **8–12 MCQs** spanning the entire course. Tests synthesis and connections, not isolated facts. The renderer shows a celebratory completion screen on a passing score (≥70%).

### Tone

This chapter is a send-off, not a goodbye. Open with a short paragraph (set as `intro:` on the chapter object) that acknowledges what the learner just accomplished, then point them forward. Avoid fake humility ("you've barely scratched the surface") and hype ("you're now an expert!"). Be honest and warm.

## Catalog Registration (Optional — only if the project has a catalog)

**If the project has a root `index.html` catalog**, register the new course there so it appears in the listing. Do it in the same turn you create the course folder. **If the project has no root `index.html`** (a fresh consumer project usually won't), skip this section — the course is fully usable at `courses/<slug>/index.html`, and the consumer can add a catalog later if they want one.

### Where the catalog lives

`index.html` groups courses by **subject** (top-level domain) and by **topic** (sub-category). Each card's `href` points at a course folder.

### Step-by-step

1. **Read `index.html`** to see the current structure, existing subject groups, topic chips, and card pattern.
2. **Pick the subject group** — the broad domain the course belongs to. Examples: *Software Development*, *Design & Creative*, *Data, AI & Machine Learning*, *Business, Product & Finance*, *Languages & Communication*, *Health, Cooking & Lifestyle*, *Science & Math*, *Music & Performing Arts*, *History, Philosophy & Humanities*. Keep names broad — don't create one-off groups for a single course if it fits a sibling.
3. **Pick the topic** — the sub-category used as the card's `data-topic` and as a filter chip. Dev: `backend`, `frontend`, `mobile`, `devops`, `data`, `ai`. Non-dev: invent a sensible short slug (e.g., `typography`, `nutrition`, `valuation`).
4. **If the subject group already exists:** append a new `<a class="card">` inside that group's `.grid` element, following the existing pattern. If your topic isn't already in `.filter-chips`, add a new `<button class="chip" data-filter="{topic}">{Label}</button>`.
5. **If the subject group does NOT exist:** add a new `<div class="subject-group" data-subject="{slug}" style="--subject-from: #...; --subject-to: #...;">` block right after the last existing one, copying the structure (header with icon + title + tagline + count, optional `.path-inner`, then `.grid` with the card). Pick a fitting subject icon (inline SVG, `stroke-width="2"`, `stroke-linecap="round"`) and `--subject-from` / `--subject-to` colors that match the subject mood. Add the topic chip(s) for the new group.
6. **Card content** — match the existing markup exactly:
   - `href="courses/<slug>/"` (note the **trailing slash** — this loads `index.html` from the course folder)
   - `data-topic` → the topic slug
   - `data-keywords` → space-separated lowercase keywords (technologies, synonyms, concepts) so search matches
   - `style="--card-from: #...; --card-to: #...;"` → two harmonious hex colors, distinct from neighbouring cards
   - Card icon SVG (36×36 viewBox, white stroke, fits the subject)
   - Level badge: `Beginner` / `Intermediate` / `Advanced`
   - `<h3>` title (concise — match the course's display title)
   - `.card-desc` — one-sentence pitch focused on what the learner walks away able to do
   - `.card-meta` — estimated duration ("~N hours") + chapter count ("N chapters"), reflecting the actual course
   - `.card-tags` — 3–5 short tags
7. **Don't manually edit hero counts** (`#heroCount`, `#totalCount`, `[data-subject-count]`). The page's JS computes them from the cards in the DOM. Just add the card.
8. **Verify** — visually scan the diff: card placed in the right group, colors set, keywords lowercase, no broken HTML, `href` points to the new folder with a trailing slash.

### What you should NOT do

- Don't duplicate the recommended-path block when adding a course — it's per-subject and curated by hand. Only update its steps if the new course meaningfully changes the recommended order for that subject.
- Don't add a course to multiple subject groups — pick one primary domain. Use `data-keywords` for cross-cutting search hits.
- Don't rewrite or restyle `index.html`'s shell (hero, Pareto band, footer) when adding a card. Touch only the catalog section and (if needed) the topic chips.

## Output Checklist

Before delivering the course, verify:

- [ ] You ran the Step 0 assessment (or had clear context to skip it)
- [ ] You presented the chapter outline in Step 1 and received explicit user validation before writing any chapter file
- [ ] The course starts at the level the assessment indicated (default: absolute beginner) and progresses through all four layers (Foundations → Core Mechanics → Idioms & Best Practices → Expert Patterns)
- [ ] Each chapter's `eyebrow:` reflects its progression layer
- [ ] For technical subjects (language/framework/tool), at least one chapter is dedicated to Best Practices & Idioms covering idiomatic style, anti-patterns, performance gotchas, security defaults, testing/tooling pointers, and a review checklist
- [ ] Folder structure matches: `courses/<slug>/` contains `index.html`, `course.config.js`, `course.css`, `content/`
- [ ] `course.config.js` has a unique `slug`, `title`, `lang`, and a non-empty `chapters` array
- [ ] Every chapter has a unique `id`, a `title`, and a `blocks` array
- [ ] Every block has a recognised `type` (one of the 13 in the table) and the required fields
- [ ] Every term is defined the first time it appears
- [ ] All examples (code or otherwise) are correct and realistic
- [ ] All SVGs include a `label` (becomes `aria-label`) and use `currentColor` for theme support
- [ ] All text passes WCAG AA contrast (test by toggling between light and dark themes)
- [ ] Every chapter has a `quiz` block with 3–5 questions
- [ ] Course ends with a `99-where-to-go.js` chapter containing, in order: a roadmap `svg`, an `advanced-topics` block (4–8 items), a `next-projects` block (3–5 items), a categorised `resources` block, and a final-recap `quiz` (8–12 questions)
- [ ] `config.lang` matches a file in `shared/strings/` (or you added one)
- [ ] If the project has a root `index.html` catalog: course is registered in it (card added to the correct subject group — creating the group if none fit; topic chip added if new; colors and metadata match the actual course; `href="courses/<slug>/"` with a trailing slash). If the project has no catalog, this step is skipped.
- [ ] You loaded the course in a browser via a local server (or Vercel preview) — not by opening the file directly. Sidebar nav, scroll-spy, prev/next, theme toggle, copy buttons, tabs, and quizzes all work.

## Example Prompt → Output Flows

### Example 1 — Coding topic

User: *"Create an interactive crash course on Docker"*

1. **Step 0 — Assess.** AskUserQuestion: current Docker familiarity? adjacent stack (which language/framework)? goal (run a personal project? deploy at work? interview prep?)? language?
2. Identify the 80/20: containers, images, Dockerfile, docker-compose, volumes (skip Swarm/Kubernetes/multi-stage for the advanced section).
3. Outline 4–5 chapters following the learning architecture. Bridge from the learner's stack (e.g., for a Node dev: "your `npm install + node server.js` becomes a Dockerfile + docker run").
4. **Step 1 — Propose & validate.** Send the chapter outline (00-intro, ch1 Containers, ch2 Images, ch3 Dockerfile, ch4 docker-compose, ch5 Volumes & networks, 99-where-to-go) with one-line descriptions and the 80/20 cut. Wait for the user's "OK / changes". Don't touch the filesystem yet.
5. Analogies: container = lunchbox (isolated, portable), image = recipe, Dockerfile = recipe card.
6. **Scaffold** — copy `courses/_template/` to `courses/docker/`, update titles in `index.html` and `course.config.js`.
7. **Author chapters** as files in `courses/docker/content/`. Each chapter is a JS object with typed blocks: `analogy` → `explanation` → `svg` → `code` (with `tabs`) → `comparison-table` → `quiz` → `takeaways`.
8. Working `Dockerfile` and `docker-compose.yml` examples for a small app matching the learner's stack — use the `code` block with `tabs`.
9. **Closing chapter** in `99-where-to-go.js`: roadmap `svg`, `advanced-topics`, `next-projects`, `resources`, final 8–12 MCQ recap `quiz`.
10. **Register in `index.html`**: add a card under *Software Development* with `data-topic="devops"`, add a `Devops` chip if missing, pick gradient colors that don't clash with neighbours, fill in real chapter count + duration. `href="courses/docker/"`.
11. **Verify** locally with `python3 -m http.server`.

### Example 2 — Non-coding topic

User: *"Teach me how to read a financial statement"*

1. **Step 0 — Assess.** AskUserQuestion: comfort with basic accounting terms? goal (personal investing? small-business owner? job interview?)? language?
2. Identify the 80/20: the three statements (income, balance sheet, cash flow), how they connect, 5–6 ratios that actually matter.
3. Outline ~4 chapters. NO `code` blocks — use `worked-example` blocks with statement excerpts, plus `comparison-table` blocks.
4. **Step 1 — Propose & validate.** Send the chapter outline (00-intro, ch1 Income statement, ch2 Balance sheet, ch3 Cash flow, ch4 How they connect + key ratios, 99-where-to-go) with one-line descriptions and the topics deferred to "Advanced topics" (DCF, GAAP vs IFRS, working capital). Wait for the user's "OK / changes" before scaffolding.
5. Analogies: balance sheet = a photo at a moment in time; income statement = a video of a year; cash flow = the bank account's diary.
6. **Scaffold** — copy `courses/_template/` to `courses/financial-statements/`.
7. **Author chapters**: each uses `analogy` → `explanation` → `svg` (e.g., how the three statements connect) → `worked-example` (interpret a small fictional company's statements) → `comparison-table` (healthy vs. unhealthy company) → `quiz` (interpretation questions, not memorisation) → `takeaways`.
8. **Closing chapter** in `99-where-to-go.js`:
   - Roadmap `svg`: basics ✅ → ratio analysis / valuation / forensic accounting (next).
   - `advanced-topics`: working capital management, DCF valuation, GAAP vs IFRS, red flags / forensic accounting.
   - `next-projects`: 🟢 read the latest 10-K of a company you use, 🟡 calculate 5 ratios for two competitors, 🔴 build a 3-statement model in a spreadsheet.
   - `resources`: SEC EDGAR, *Financial Statements* by Thomas Ittelson, Aswath Damodaran's lectures, r/SecurityAnalysis.
   - Final 8–12 MCQ recap `quiz`.
9. **Register in `index.html`**: no existing subject group fits → create a new *Business, Product & Finance* group with a briefcase/chart SVG icon and warm/teal gradient. Add the card with `data-topic="finance"` and a matching `Finance` chip. `href="courses/financial-statements/"`.
10. **Verify** locally.

## Adding a New Block Type (advanced)

If the course needs a block the renderer doesn't have:

1. Create `shared/js/renderers/<my-block>.js` exporting a default function `(block) => HTMLElement`.
2. Register it in `shared/js/renderers/index.js`: import + add to the `registry` map.
3. Add CSS in `shared/css/components/<my-block>.css` and `@import` it from `shared/css/index.css`.
4. Document it in this SKILL.md's block-types table.

Every existing course gets the new block for free.
