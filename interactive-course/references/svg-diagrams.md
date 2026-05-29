# SVG diagrams — visual style reference

Diagrams are inline SVG embedded in `svg` (or `diagram`) blocks. The renderer
(`shared/js/renderers/svg.js`) wraps your markup in a figure with a `<figcaption>`,
and applies `aria-label` from the block's `label` field.

This file documents the **house style** for diagrams across courses.
A flat, monochrome `currentColor` look reads as cheap. Colorful boxes
keyed off CSS theme tokens read as polished — and they switch with light/dark
theme automatically.

## The 10-second rule

A diagram should be readable in ten seconds. If a learner has to study it,
the diagram is doing too much. Two ways to make that happen:

1. **One color per role.** Inputs are one color, outputs another, errors a
   third. The eye groups by hue before it reads.
2. **Title + subtitle in every box.** Title is the noun ("HTTP request").
   Subtitle is the qualifier in a smaller, dimmer font ("JSON body").

If you can't fit both, drop the subtitle. Never drop the title.

## Color tokens (use these — never hardcode hex)

These are defined in `shared/css/tokens.css` and respond to the active theme:

| Token             | Default hue | Use for                                              |
|-------------------|-------------|------------------------------------------------------|
| `var(--accent)`   | indigo/cyan | Primary actor, current item, "you are here"          |
| `var(--secondary)`| cyan/purple | Secondary actor, the framework's own machinery       |
| `var(--success)`  | green       | Outputs, completed, healthy paths, "JSON 201"        |
| `var(--warning)`  | amber       | The "other" framework column (Laravel vs Go), middle |
| `var(--danger)`   | red         | Errors, 4xx/5xx branches, dangerous data             |
| `var(--pink)`     | pink        | Validation, third-party APIs, anything to highlight  |
| `currentColor`    | text color  | Plain captions, neutral connector text               |

Course authors can override `--accent` and `--secondary` per course
in `course.config.js`'s `theme` block; the rest are global.

**Never hardcode `#xxxxxx`** unless you genuinely need a brand color
(e.g., the Go gopher cyan). Hardcoded colors fail when the user toggles
light mode, and they desync from the rest of the page.

## Anatomy of a "good" box

```svg
<rect x="60" y="40" width="220" height="58" rx="10"
      fill="none" stroke="var(--accent)" stroke-width="2"/>
<text x="170" y="65" text-anchor="middle"
      fill="var(--accent)" font-weight="600">HTTP request</text>
<text x="170" y="83" text-anchor="middle"
      fill="currentColor" font-size="10" font-weight="400" opacity="0.7">JSON body</text>
```

Things that make this box land:
- `rx="10"` — soft corners. Never use `rx="0"`. `rx="6"` is the absolute
  minimum; `rx="10"–"14"` is what feels modern.
- `stroke-width="2"` — anything thinner reads as a wireframe.
- Title and stroke share the same `var(--…)` color — the eye unifies them.
- Subtitle is `currentColor` + `opacity="0.7"` + smaller font + lighter weight.
- `fill="none"` on the rect — never solid-fill the box; let the page color
  show through.

## Anatomy of a "good" arrow

Define one marker at the top of the SVG, reuse it:

```svg
<defs>
  <marker id="arrow-foo" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
  </marker>
</defs>

<line x1="280" y1="69" x2="320" y2="69"
      stroke="var(--accent)" stroke-width="1.8"
      marker-end="url(#arrow-foo)"/>
```

- The marker uses `fill="currentColor"`. The arrow head adopts the **line's**
  color because `currentColor` inside the marker resolves against the
  referencing element. So one marker works for every hue.
- Give the marker a unique id per chapter (e.g., `arrow-jwt`, `arrow-crud`).
  SVGs share the document — same id across chapters causes collisions.
- `stroke-width="1.8"` for arrows feels right next to a `stroke-width="2"` box.

## Pattern: lifecycle / flow

Five colored boxes in a row with arrows. The pattern used in 00-intro.js,
04-form-validation.js, and 07-full-crud.js.

Each step gets its own color. Avoid more than 5 colors in one row;
beyond that, group related steps under one hue.

```svg
<svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg" font-family="DM Sans" font-size="12">
  <defs>
    <marker id="arrow-flow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
  </defs>

  <g font-weight="600">
    <rect x="20"  y="40" width="130" height="58" rx="10" fill="none" stroke="var(--accent)"    stroke-width="2"/>
    <text x="85"  y="66" text-anchor="middle" fill="var(--accent)">HTTP request</text>
    <text x="85"  y="84" text-anchor="middle" fill="currentColor" font-size="10" font-weight="400" opacity="0.7">JSON body</text>

    <rect x="170" y="40" width="130" height="58" rx="10" fill="none" stroke="var(--secondary)" stroke-width="2"/>
    <text x="235" y="66" text-anchor="middle" fill="var(--secondary)">Bind</text>
    <text x="235" y="84" text-anchor="middle" fill="currentColor" font-size="10" font-weight="400" opacity="0.7">→ struct</text>

    <rect x="320" y="40" width="130" height="58" rx="10" fill="none" stroke="var(--warning)"   stroke-width="2"/>
    <text x="385" y="66" text-anchor="middle" fill="var(--warning)">Validate</text>
    <text x="385" y="84" text-anchor="middle" fill="currentColor" font-size="10" font-weight="400" opacity="0.7">tags checked</text>

    <rect x="470" y="40" width="130" height="58" rx="10" fill="none" stroke="var(--success)"   stroke-width="2"/>
    <text x="535" y="66" text-anchor="middle" fill="var(--success)">Handler</text>
    <text x="535" y="84" text-anchor="middle" fill="currentColor" font-size="10" font-weight="400" opacity="0.7">DB / response</text>
  </g>

  <g fill="none" marker-end="url(#arrow-flow)">
    <line x1="150" y1="69" x2="170" y2="69" stroke="var(--accent)"    stroke-width="1.8"/>
    <line x1="300" y1="69" x2="320" y2="69" stroke="var(--secondary)" stroke-width="1.8"/>
    <line x1="450" y1="69" x2="470" y2="69" stroke="var(--warning)"   stroke-width="1.8"/>
  </g>

  <!-- Optional error branch — use --danger + dashed stroke -->
  <line x1="385" y1="98" x2="385" y2="160"
        stroke="var(--danger)" stroke-width="1.8" stroke-dasharray="5 3"
        marker-end="url(#arrow-flow)" fill="none"/>
  <text x="395" y="130" fill="var(--danger)" font-size="11" font-weight="600">if err != nil</text>
</svg>
```

## Pattern: side-by-side comparison

Two columns (e.g., Laravel vs Go). Use **warm** hues for the "old" / familiar
side, **cool** hues for the "new" side. Same shape on both — it reads as
"same flow, different vocabulary".

- Left column: `var(--warning)` (amber)
- Right column: `var(--accent)` (the course's primary)
- Terminal node ("JSON 201"): `var(--success)` on both sides

This is the layout used in 00-intro.js — 5 stacked boxes per side, vertical
arrows in the column color.

## Pattern: sequence diagram (swimlanes)

Three actors (Client / Server / DB), vertical lifelines, horizontal messages.
Used in 08-auth-jwt.js.

- Lane headers as small rounded rects, each with its own color.
- Lifelines are `stroke-dasharray="3 4"` + `opacity="0.55"` of the lane color.
- Messages are arrows colored by what they represent (request = accent,
  success response = `var(--success)`, protected request = `var(--pink)`).
- Place the message label slightly above the arrow, `text-anchor="middle"`.

```svg
<rect x="20"  y="14" width="100" height="26" rx="8" fill="none" stroke="var(--accent)"    stroke-width="2"/>
<text x="70"  y="32" text-anchor="middle" font-weight="700" fill="var(--accent)">Client</text>

<line x1="70" y1="40" x2="70" y2="220" stroke="var(--accent)"
      stroke-width="1" stroke-dasharray="3 4" opacity="0.55"/>
```

## Pattern: directory tree

Used in 01-go-essentials.js and 02-echo-foundations.js.

- Wrap the whole tree in one rounded rect (`stroke="var(--accent)" opacity="0.45"`)
  to set off the figure.
- Folder names use distinct colors (`--secondary`, `--pink`, `--warning`, `--danger`)
  so each top-level folder is visually anchored.
- Use `font-family="JetBrains Mono"` for the tree, `font-family="DM Sans"` for
  inline `# comments`. Comments in `var(--success)` + `opacity="0.85"` —
  they look like syntax-highlighted comments rather than diagram text.

## Pattern: onion / concentric layers

Used in 05-middleware.js for the middleware onion. Concentric ellipses,
each in a different color, with the handler in the center as a solid colored circle.

```svg
<ellipse cx="320" cy="125" rx="280" ry="95" fill="none" stroke="var(--accent)"    stroke-width="2"/>
<ellipse cx="320" cy="125" rx="215" ry="72" fill="none" stroke="var(--secondary)" stroke-width="2"/>
<ellipse cx="320" cy="125" rx="150" ry="50" fill="none" stroke="var(--warning)"   stroke-width="2"/>
<circle  cx="320" cy="125" r="34"             fill="none" stroke="var(--success)"   stroke-width="2.5"/>

<text x="320" y="129" text-anchor="middle" font-weight="700" fill="var(--success)">handler</text>
```

Color order from outside to inside: outer = generic (`--accent`),
inner = specific (`--success`). The eye reads outside-in.

## Pattern: roadmap / skill tree

Used in 99-where-to-go.js. Three zones:

- **Completed** (left): green spine + filled `var(--success)` circles.
- **Current** (middle): a ring + filled `var(--accent)` circle, larger radius
  (~`r="14"`) plus an outer halo (`r="20"` stroke-only, `opacity="0.35"`).
- **Future** (right): branching dashed lines in `var(--secondary)` and
  `var(--pink)`; outline-only circles with `stroke-dasharray="3 3"`.

The completed-vs-future distinction must be obvious at a glance: solid filled =
done, hollow + dashed = future.

## Pattern: entity relationship

Used in `courses/django-rest/content/02-models-migrations.js`.

- Each entity = a rounded rect. Inside: a colored title row, a thin separator
  line, then field names in `JetBrains Mono`.
- Each entity gets its **own color** so multi-FK lines can be color-coded back
  to their owner. Pick distinct hues from the token list.
- Relationship lines: `1—1`, `1—N`, `N—N` labels in the relationship color.
- A "built-in" / external entity (e.g., Django's User) uses
  `stroke-dasharray="4 4"` + `opacity="0.7"` to signal "not yours".

## Accessibility rules (non-negotiable)

1. **Always pass a `label` field on the block** — the renderer turns it into
   `aria-label`. Make it descriptive: not "diagram" but "Validation request
   flow showing bind, validate, handler, with an error branch to 422."
2. **Maintain WCAG AA contrast** in both themes. The token colors above were
   picked to clear AA against both `--bg` and `--bg-card`. If you write a
   colored text on a colored background (avoid this), test both themes.
3. **Never put text inside the marker arrowhead** — screen readers can't reach
   it and small text in markers is unreadable.
4. **Do not** use red/green as the **only** signal of state. Always pair with
   shape (solid vs dashed) or with a text label ("✓ done" / "↗ next").
5. **Forbidden combos**: white-on-green, red-on-green, low-contrast pastels on
   `--bg-card`. If a designer would call it "muddy," scrap and try again.

## Sizing and viewBox

- Set `viewBox` and let the SVG scale via CSS. **Don't** hardcode `width=`/`height=`
  on the `<svg>` root.
- Common viewBox widths: `600`–`760` for full-width figures, `480`–`560` for
  ones in a side-by-side. Heights vary; pad ~20px below the bottom-most label.
- Inside the viewBox you're free to use whatever coordinates make the math easy.
  100-pixel grid increments make box positioning trivial.

## Fonts

- Title text: `font-family="DM Sans"` (the body font; inherited by default,
  but worth setting explicitly on the `<svg>` root).
- Code-flavored labels (filenames, struct fields, CLI flags):
  `font-family="JetBrains Mono"`.
- Sizes: title `12–14px`, subtitle `10–11px`, axis/header `13–15px`.

## Before/after checklist

When you finish a diagram:

- [ ] Every box uses a `var(--token)` stroke + matching title color.
- [ ] No `currentColor` on box strokes. (Captions and arrows are fine.)
- [ ] Subtitles are `currentColor` + `opacity="0.7"` + smaller font.
- [ ] All arrows share a single `<marker>` definition.
- [ ] Each marker `id` is unique within its chapter.
- [ ] `rx` is at least `8` on every rect.
- [ ] `stroke-width="2"` on boxes, `1.8` on arrows.
- [ ] Light theme tested — text still readable, colors not blown out.
- [ ] `label` field on the block is descriptive, not generic.
- [ ] No hardcoded hex colors (unless brand-required).

## Common mistakes

| Symptom                                    | Fix                                                |
|--------------------------------------------|----------------------------------------------------|
| Diagram looks washed out in light theme    | You're using `opacity="0.5"` on strokes — don't. Use a different token instead. |
| Arrow head is the wrong color              | Marker uses `fill="currentColor"` — make sure the line itself is the color you want, not the marker. |
| Arrows missing on second instance of marker| Two SVGs share the same marker `id`. Make ids unique per chapter. |
| Text spills outside the box                | Wider rect or shorter label. Don't shrink font below 10px. |
| Boxes feel "boxy"                          | Increase `rx` to 10–14 and `stroke-width` to 2.    |
| Colors clash                               | You used 6+ different hues. Cut to 4. Group related steps under one color. |
| Long captions wrap awkwardly               | The renderer caption wraps automatically — but keep it under ~120 chars. |

## When in doubt

Open one of these as a reference:

- `courses/go-echo/content/00-intro.js` — side-by-side flow with terminal nodes
- `courses/go-echo/content/04-form-validation.js` — flow with error branch
- `courses/go-echo/content/05-middleware.js` — concentric onion
- `courses/go-echo/content/07-full-crud.js` — multi-tier architecture
- `courses/go-echo/content/08-auth-jwt.js` — sequence/swimlane
- `courses/go-echo/content/10-queue-jobs.js` — fan-out architecture
- `courses/go-echo/content/99-where-to-go.js` — roadmap / skill tree
- `courses/django-rest/content/02-models-migrations.js` — entity-relationship
