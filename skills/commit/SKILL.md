---
name: commit
description: Craft high-quality git commit messages that follow Conventional Commits and explain the *why* behind a change. Use this skill whenever the user asks to "write a commit message", "commit these changes", "suggest a commit", "what should I write for this commit", "make a good commit message", or any variation. Trigger when the user wants help authoring a commit message — whether for staged changes, unstaged changes, or a description they paste. The skill inspects the actual diff (via `git status`, `git diff --staged`, `git diff`, and `git log`) to understand both *what* changed and the project's existing commit style, then produces a message that is concise, accurate, and useful to future readers. It enforces **atomic commits**: only files belonging to the same logical change are grouped together, and unrelated changes are split into separate commits — each with its own focused message. It also enforces: a Conventional Commits prefix (feat, fix, chore, refactor, docs, test, perf, build, ci, style, revert), imperative mood, ≤72-char subject, a body that explains motivation and tradeoffs (not a re-description of the diff), and never invents changes that aren't in the diff. The skill does NOT run `git commit` unless the user explicitly asks — by default it only proposes the message(s).
---

# Commit Message Writer

Author commit messages that a teammate reading `git log` six months from now will actually thank you for. Most commit messages fail in the same predictable ways — this skill exists to avoid those failures by reading the diff, understanding the change, and writing a message that captures the *why*.

## Core principle — atomic commits

**One commit = one logical change.** Never lump unrelated edits into a single commit just because they happen to be sitting in the working tree at the same time. If the diff covers two distinct concerns (e.g., a bug fix *and* a docs typo, or two unrelated features), produce **two separate commits** — each staging only the files that belong to that change, each with its own focused message.

A commit is atomic when:
- Every file in it serves the same purpose (the same feature, the same fix, the same refactor).
- Reverting the commit cleanly undoes exactly that change and nothing else.
- The subject line can describe the whole commit truthfully without using "and" to glue unrelated things together.

If you can't write the subject without "and", you almost certainly need to split.

## Step 1 — Read the actual change

Never write a commit message from imagination. Always inspect the diff first. Run these in **parallel**:

- `git status` — see which files are staged vs unstaged vs untracked.
- `git diff --staged` — the changes that will actually be committed.
- `git diff` — unstaged changes (so you can warn the user if they may have forgotten to stage something).
- `git log -n 10 --oneline` — learn the project's existing commit style (prefix conventions, casing, scope use, language).

If nothing is staged but the user clearly wants to commit, stage with `git add <specific files>` (never `git add -A` / `git add .` — risks pulling in secrets or junk). Confirm with the user if it isn't obvious which files to stage.

If both staged and unstaged changes exist, point that out before writing the message — the user may want to include the unstaged work too.

## Step 2 — Group files into atomic commits

Before writing any message, **partition the changed files into logical groups**. Each group becomes one commit. A group is files that share a single purpose: same feature, same fix, same refactor, same chore.

How to group:

- **By intent, not by folder.** Two files in different folders that implement the same feature belong together. Two files in the same folder that change for unrelated reasons do *not*.
- **Tests with their code.** A new feature and its tests belong in the same commit. A test-only fix to an unrelated test goes in its own commit.
- **Docs updates that describe a code change** ride with the code change. Docs changes unrelated to any code change in this batch get their own `docs:` commit.
- **Mechanical changes** (formatting, renames, lockfile bumps) that touch many files but serve one purpose are still atomic — keep them together, but separate from substantive changes in the same files.
- **Refactors stay separate from behavior changes.** If you refactored *and* fixed a bug, that's two commits: the refactor first (no behavior change), then the fix on top.

Present the grouping to the user before writing messages. Format:

```
Proposed commits:
  1. feat(auth): … — files: src/auth/oauth.ts, src/auth/oauth.test.ts
  2. docs: … — files: README.md
  3. chore: … — files: package.json, package-lock.json
```

If the user is happy with the grouping, proceed to write a message for each group. If only one logical group exists, say so and proceed with a single commit — don't manufacture splits where none belong.

When staging for each commit, **stage only that group's files** with `git add <file1> <file2> …`. Never use `git add -A` or `git add .`. Between commits, verify with `git status` that only the intended files are staged.

## Step 3 — Classify the change

Pick exactly one Conventional Commits type **per commit group**. If a single group honestly spans two types (e.g., a refactor *and* a fix), that's a signal you grouped wrong — go back to Step 2 and split it.

| Type       | Use for                                                              |
|------------|----------------------------------------------------------------------|
| `feat`     | A new user-facing capability or behavior                              |
| `fix`      | A bug fix — restores intended behavior                                |
| `refactor` | Internal restructuring with no behavior change                        |
| `perf`     | Performance improvement with no behavior change                       |
| `docs`     | Documentation only (README, comments, guides)                         |
| `test`     | Adding/updating tests only                                            |
| `chore`    | Tooling, deps, configs, housekeeping with no src behavior change      |
| `build`    | Build system, bundler, package manifest changes                       |
| `ci`       | CI/CD pipelines, GitHub Actions, workflows                            |
| `style`    | Formatting, whitespace, semicolons — no logic change                  |
| `revert`   | Reverts a previous commit (reference the SHA in the body)             |

**Match the project's existing convention.** If `git log` shows the project doesn't use Conventional Commits (e.g., it uses `[component] message` or plain prose), match *that* style instead. Consistency with the repo beats abstract correctness.

Verbs to choose for the subject line (imperative mood, like you're giving an order):

- `add`, `remove`, `rename`, `move` — for additions/removals
- `fix` — for bugs (the type prefix already says `fix:`, so the verb in the subject can be more specific: `fix: prevent null deref in cache lookup`)
- `update` — for *changing* an existing thing (not for adding new things — `add` is clearer)
- `introduce`, `extract`, `inline`, `simplify` — for refactors
- `support` — when enabling a new use case

Avoid: `updated`, `updating`, `updates` (not imperative); `misc changes`, `various fixes`, `improvements` (vague — say what you actually did).

## Step 4 — Write the subject line

Format: `<type>(<optional scope>): <subject>`

Rules:
- ≤ 72 characters total. Aim for ≤ 50 if you can.
- Lowercase after the colon (unless the project clearly uses Title Case in its log).
- No trailing period.
- Imperative mood: "add user export" not "added user export" or "adds user export".
- Scope is optional — use it when the project's history uses scopes (e.g., `feat(auth): …`). Skip it otherwise.
- Be specific. `fix: bug in checkout` is useless; `fix: prevent double-charge when retrying failed payments` is useful.

A good test: read the subject alone. Does it tell a reviewer what changed and roughly why it matters? If not, rewrite.

## Step 5 — Write the body (when needed)

Skip the body when the change is genuinely trivial (typo fix, dependency bump, obvious one-liner). Otherwise, write a body — even 2 short lines beats none.

The body answers questions the subject can't:

- **Why** was this change needed? (the bug it fixes, the use case it enables, the constraint it satisfies)
- **What was the alternative**, and why didn't you take it? (only when a reviewer might wonder)
- **What's the tradeoff** or known limitation? (if any)
- **What's the blast radius** — does this affect other systems, require a migration, change a public API?

What the body should **not** do:
- Re-narrate the diff line-by-line. The diff already shows *what*. The body is for *why*.
- Reference internal task IDs unless the project's commit log already does so (check `git log`).
- Include marketing language ("blazing fast", "robust", "seamless"). Just say what changed.

Body formatting:
- Wrap at 72 columns.
- Blank line between subject and body.
- Use bullet points (`-`) when listing several independent points; use prose for a single coherent explanation.
- Reference issues/PRs only if the project uses that convention (e.g., `Closes #123`, `Refs PROJ-456`).

## Step 6 — Verify against the diff

Before presenting each message, re-check it against the diff for that commit group:

1. Does every claim in the message correspond to something actually in this group's staged files? (No hallucinated changes.)
2. Are there changes in the staged files the message doesn't mention but should? (No undisclosed scope.)
3. Is the type prefix honest? (A `refactor:` that changes behavior is a `feat:` or `fix:`.)
4. Are all files in this group genuinely related, or is something here that belongs in a different commit? (Atomicity check.)
5. Would a reviewer reading only this message and the diff be surprised by anything?

If any check fails, rewrite — or re-group, if the issue is atomicity — don't ship a message that misrepresents the change.

## Step 7 — Present, don't commit

By default, **show the message(s) to the user** in fenced blocks they can copy, and stop there. When multiple atomic commits are proposed, present them in order with the staging command for each:

```
# Commit 1
git add src/auth/oauth.ts src/auth/oauth.test.ts
git commit -m "..."

# Commit 2
git add README.md
git commit -m "..."
```

Do not run `git commit` unless the user has explicitly asked you to commit (e.g., "commit it", "go ahead and commit", "make the commit").

When the user does ask you to commit, run each atomic commit sequentially: stage only that group's files, commit, then move to the next group. Verify with `git status` between commits that the staging area is clean before staging the next group. Follow the harness's git safety rules in the system prompt: pass the message via a heredoc, never `--no-verify`, never amend unless asked, and run `git status` after the final commit to confirm.

## Templates

### Minimal (trivial change)

```
fix: correct typo in onboarding email subject
```

### Standard (most commits)

```
feat(auth): support GitHub OAuth in addition to Google

Users on enterprise GitHub-only orgs were unable to sign up because
Google was the sole provider. Adding GitHub broadens reach without
adding a new auth model — both providers map to the same User record
via verified email.

The OAuth client secret is read from GH_OAUTH_SECRET; the deploy
runbook has been updated with the new env var.
```

### Bug fix with cause + effect

```
fix: prevent double-charge when payment retry races with webhook

The retry worker and the Stripe webhook both transitioned the order
to PAID without checking the existing state, so a slow webhook arriving
after a successful retry could trigger a second capture.

Guard the transition with a state check inside the same transaction
that updates the order. Adds a regression test that simulates the
race by delaying the webhook handler.
```

### Refactor

```
refactor: extract pricing rules into PricingEngine

The pricing logic was duplicated across CartService and CheckoutService
with subtle drift between the two copies. Pulling it into a single
PricingEngine removes the duplication and gives us one place to add
upcoming tax rules.

No behavior change; existing tests pass unchanged.
```

### Revert

```
revert: feat(search): enable fuzzy matching by default

This reverts commit 8a3f1c2.

Fuzzy matching caused a 4× regression in p95 search latency on the
catalog index. Reverting while we evaluate a smaller-radius config.
```

## Anti-patterns to refuse

If the user asks for any of these, push back briefly and offer the better alternative:

- **"Just write 'update'"** — too vague to be useful in `git log`. Ask what actually changed.
- **"Squash everything into one commit called 'wip'"** — fine for a personal branch tip, not for a commit going to main. Suggest a real message.
- **A message that hides a behavior change inside `chore:` or `refactor:`** — mis-typed commits break changelogs and bisects. Use the honest type.
- **A message claiming a fix when the diff is only a workaround** — say "work around" explicitly so the underlying bug stays visible.
- **"Just commit everything in one go"** when the working tree mixes unrelated changes — refuse the lump commit and propose an atomic split instead. A single non-atomic commit poisons `git bisect`, `git revert`, and code review.

## Quick checklist (use before sending)

- [ ] Inspected the actual diff (not guessing from filenames).
- [ ] Grouped changes into atomic commits — only related files together; unrelated changes split out.
- [ ] Each group's files stage independently (never `git add -A` / `git add .`).
- [ ] Type prefix matches the change honestly (one type per commit).
- [ ] Subject ≤72 chars, imperative, specific, no trailing period.
- [ ] Subject describes the whole commit truthfully without "and"-joining unrelated things.
- [ ] Body explains *why*, not *what*, when the change is non-trivial.
- [ ] Style matches the project's existing `git log`.
- [ ] No hallucinated changes; no undisclosed scope.
- [ ] Did not run `git commit` unless explicitly asked.
