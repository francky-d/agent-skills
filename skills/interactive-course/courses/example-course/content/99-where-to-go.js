export default {
  id: 'where-to-go',
  eyebrow: 'Closing chapter',
  title: 'Where to go from here',
  intro: 'You now have the mental model and the daily-driver commands. That covers about 80% of what you\'ll actually do with Git. The remaining 20% — rebases, reflog, bisect, submodules — is best learned the day a real problem makes you reach for it. Here\'s a map of where to head next.',
  blocks: [
    {
      type: 'svg',
      label: 'Git learning roadmap',
      caption: 'What you covered, where you are, and where to go next.',
      svg: `
        <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="100" x2="480" y2="100" stroke="currentColor" stroke-width="2"/>
          <circle cx="90"  cy="100" r="14" fill="var(--success)"/>
          <circle cx="220" cy="100" r="14" fill="var(--success)"/>
          <circle cx="340" cy="100" r="14" fill="var(--accent)"/>
          <circle cx="460" cy="100" r="14" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>
          <text x="90"  y="140" text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">Snapshots</text>
          <text x="220" y="140" text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">Branches</text>
          <text x="340" y="140" text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">Collaboration</text>
          <text x="460" y="140" text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">Advanced</text>
          <text x="90"  y="75"  text-anchor="middle" font-family="DM Sans" font-size="10" fill="currentColor">✓ done</text>
          <text x="220" y="75"  text-anchor="middle" font-family="DM Sans" font-size="10" fill="currentColor">✓ done</text>
          <text x="340" y="75"  text-anchor="middle" font-family="DM Sans" font-size="10" fill="currentColor">you are here</text>
          <text x="460" y="75"  text-anchor="middle" font-family="DM Sans" font-size="10" fill="currentColor">next</text>
        </svg>
      `,
    },
    {
      type: 'advanced-topics',
      items: [
        {
          title: 'Interactive rebase (git rebase -i)',
          what: 'Reorder, squash, edit, or drop commits before opening a PR — like editing a draft before publishing.',
          why: 'Hugely useful for keeping PRs reviewable. Come back to this once you have one messy branch you wish you could tidy.',
        },
        {
          title: 'git stash',
          what: 'Temporarily set aside uncommitted changes so you can switch branches, then pop them back.',
          why: 'A small quality-of-life tool the day you need to drop everything for an urgent fix.',
        },
        {
          title: 'git bisect',
          what: 'Binary-search through history to find the commit that introduced a bug.',
          why: 'Magical the first time you use it on a regression you can\'t otherwise trace.',
        },
        {
          title: 'Reflog and recovery',
          what: 'Git\'s safety net: a log of every move HEAD has made, so you can recover "deleted" commits.',
          why: 'You\'ll panic less once you know almost nothing in Git is truly gone for 30 days.',
        },
        {
          title: '.gitignore and Git LFS',
          what: 'How to keep generated files, secrets, and giant binaries out of your history.',
          why: 'Important the moment your repo has anything bigger than source files.',
        },
        {
          title: 'Tags and releases',
          what: 'Permanent named pointers to specific commits — used to mark versions (v1.0.0).',
          why: 'You\'ll need this the first time you cut a real release.',
        },
      ],
    },
    {
      type: 'next-projects',
      items: [
        {
          title: 'Version-control a personal project',
          description: 'Take something you\'ve been working on locally, run git init, and start committing. Aim for clear, focused commit messages.',
          difficulty: 'easy',
          reinforces: ['init', 'add', 'commit', 'log'],
        },
        {
          title: 'Contribute to an open-source project',
          description: 'Fork a small project on GitHub, fix a tiny issue or improve docs, and open your first pull request.',
          difficulty: 'intermediate',
          reinforces: ['clone', 'branch', 'push', 'pull request workflow'],
        },
        {
          title: 'Recover a "lost" commit with reflog',
          description: 'Deliberately reset your branch to drop a commit, then use git reflog and git reset to bring it back.',
          difficulty: 'challenging',
          reinforces: ['reflog', 'reset', 'understanding HEAD'],
        },
      ],
    },
    {
      type: 'resources',
      groups: [
        {
          title: '📖 Official / Authoritative Sources',
          items: [
            { href: 'https://git-scm.com/doc', label: 'Official Git documentation', note: 'The reference — start with the tutorial' },
            { href: 'https://git-scm.com/book/en/v2', label: 'Pro Git (free book)', note: 'The canonical deep dive' },
          ],
        },
        {
          title: '🎥 Talks & Videos',
          items: [
            { href: 'https://missing.csail.mit.edu/2020/version-control/', label: 'MIT — The Missing Semester: Version Control', note: 'A fantastic 1-hour mental-model lecture' },
          ],
        },
        {
          title: '🛠 Tools',
          items: [
            { href: 'https://cli.github.com/', label: 'GitHub CLI (gh)', note: 'Manage PRs and issues from the terminal' },
            { href: 'https://www.git-tower.com/learn/git/ebook', label: 'Tower — Learn Git ebook', note: 'Friendly visual explanations' },
          ],
        },
        {
          title: '👥 Communities',
          items: [
            { href: 'https://stackoverflow.com/questions/tagged/git', label: 'Stack Overflow — [git] tag', note: 'Almost every weird error has an answer here' },
          ],
        },
      ],
    },
    {
      type: 'quiz',
      title: 'Final recap',
      questions: [
        {
          q: 'In Git, what is the relationship between a commit and a branch?',
          options: [
            'A branch is a copy of a commit',
            'A branch is a pointer to a single commit; the commit is the actual snapshot',
            'A commit lives inside exactly one branch',
            'They are the same thing',
          ],
          correct: 1,
          explanation: 'A branch is just a name pointing at a commit. Commits exist independently and can belong to many branches.',
        },
        {
          q: 'You staged file A, then edited file A again. You run git commit. What gets committed?',
          options: [
            'The latest version on disk',
            'The version you staged earlier — the new edits stay in the working tree',
            'Nothing — Git errors',
            'Both versions as two commits',
          ],
          correct: 1,
          explanation: 'Staging captures the file state at the time of git add. Later edits live in the working tree until you stage them too.',
        },
        {
          q: 'Which command brings the latest commits from origin/main into your local main branch?',
          options: ['git push', 'git pull', 'git fetch only', 'git commit'],
          correct: 1,
          explanation: 'git pull is fetch + merge into your current branch. git fetch alone just downloads but doesn\'t update branches.',
        },
        {
          q: 'A pull request is best described as…',
          options: [
            'A built-in Git command',
            'A platform feature (GitHub/GitLab/…) that wraps a merge in review, discussion, and CI',
            'Another name for git pull',
            'A way to revert commits',
          ],
          correct: 1,
          explanation: 'PRs are layered on top of Git by hosting platforms. They\'re not part of the Git tool itself.',
        },
        {
          q: 'Why is "never force-push to a shared branch" the rule?',
          options: [
            'It uses a lot of bandwidth',
            'It rewrites history teammates already pulled, breaking their clones',
            'Git won\'t let you',
            'It deletes the remote branch',
          ],
          correct: 1,
          explanation: 'Force-push replaces remote history with yours. Teammates\' clones are now out of sync in a way Git can\'t auto-reconcile.',
        },
        {
          q: 'What is the safest way to recover a commit you accidentally "lost" by resetting?',
          options: [
            'You can\'t — it\'s gone',
            'Use git reflog to find its hash, then git reset/cherry-pick to restore it',
            'Re-clone the repo',
            'Restore from a backup',
          ],
          correct: 1,
          explanation: 'reflog records every move HEAD makes. Commits stick around for ~30 days before being garbage-collected, so recovery is usually possible.',
        },
        {
          q: 'Which commit-message habit pays off the most over time?',
          options: [
            'Always 5 words exactly',
            'Imperative subject + a body explaining the why',
            'Include the date',
            'Mention which IDE you used',
          ],
          correct: 1,
          explanation: 'Future readers (including you) need the why more than the what — the diff already shows the what.',
        },
        {
          q: 'You\'re about to start a new feature. What\'s the idiomatic first move?',
          options: [
            'Edit files on main and commit when done',
            'Create a branch (git switch -c feature/...) and commit there',
            'Push an empty commit first',
            'Delete .git and start fresh',
          ],
          correct: 1,
          explanation: 'A branch per feature keeps main clean and makes review, CI, and rollback trivial.',
        },
      ],
    },
  ],
};
