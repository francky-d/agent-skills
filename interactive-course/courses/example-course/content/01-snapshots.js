export default {
  id: 'snapshots',
  eyebrow: 'Foundations',
  title: 'Snapshots: commits, the staging area, and the working tree',
  intro: 'Before you can branch or share, you need to understand what a commit actually is and how files travel from your editor into Git\'s history.',
  blocks: [
    {
      type: 'analogy',
      icon: '📸',
      text: 'Imagine you\'re building a photo album of your project. The working tree is the scene in front of the camera, the staging area is the photo you\'re about to print, and the commit is the page you glue into the album. Once it\'s in the album, you can always flip back to it.',
    },
    {
      type: 'explanation',
      html: `
        <p>Git tracks files through three "places":</p>
        <ul>
          <li><strong>Working tree</strong> — the files on disk you edit with your editor.</li>
          <li><strong>Staging area</strong> (sometimes called the <em>index</em>) — a holding zone where you assemble exactly what will go into the next commit.</li>
          <li><strong>Repository</strong> — the history of commits stored in the hidden <code>.git/</code> folder at the root of your project.</li>
        </ul>
        <p>You move work between them with <code>git add</code> (working tree → staging) and <code>git commit</code> (staging → repository).</p>
      `,
    },
    {
      type: 'svg',
      label: 'Working tree, staging area, and repository',
      caption: 'Edit → stage → commit. Each commit is a complete snapshot.',
      svg: `
        <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
          <rect x="20"  y="60" width="130" height="80" rx="12" fill="none" stroke="var(--accent)" stroke-width="2"/>
          <rect x="195" y="60" width="130" height="80" rx="12" fill="none" stroke="var(--secondary)" stroke-width="2"/>
          <rect x="370" y="60" width="130" height="80" rx="12" fill="none" stroke="var(--success)" stroke-width="2"/>
          <text x="85"  y="105" text-anchor="middle" font-family="DM Sans" font-size="14" fill="currentColor">Working tree</text>
          <text x="260" y="105" text-anchor="middle" font-family="DM Sans" font-size="14" fill="currentColor">Staging area</text>
          <text x="435" y="105" text-anchor="middle" font-family="DM Sans" font-size="14" fill="currentColor">Repository</text>
          <text x="85"  y="170" text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">files on disk</text>
          <text x="260" y="170" text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">next commit draft</text>
          <text x="435" y="170" text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">.git/ history</text>
          <path d="M150 100 L195 100" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrow)"/>
          <path d="M325 100 L370 100" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrow)"/>
          <text x="172" y="90"  text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="currentColor">git add</text>
          <text x="347" y="90"  text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="currentColor">git commit</text>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="currentColor"/>
            </marker>
          </defs>
        </svg>
      `,
    },
    {
      type: 'code',
      tabs: [
        {
          name: 'First commit',
          lang: 'bash',
          code: `# Turn a folder into a Git project
git init

# See what Git thinks about your files
git status

# Stage the files you want in the next snapshot
git add README.md app.js

# Take the snapshot, with a message describing it
git commit -m "Initial commit: README and entry point"`,
        },
        {
          name: 'Edit and commit again',
          lang: 'bash',
          code: `# After editing app.js
git status            # shows app.js as modified
git diff              # shows the exact lines that changed
git add app.js
git commit -m "Add port configuration via env var"

# See the history
git log --oneline`,
        },
      ],
    },
    {
      type: 'comparison-table',
      headers: ['State', 'Where it lives', 'How you got here'],
      rows: [
        ['Untracked', 'On disk, ignored by Git', 'You created a new file'],
        ['Modified', 'On disk, Git noticed a change', 'You edited a tracked file'],
        ['Staged', 'In the staging area', 'You ran git add on it'],
        ['Committed', 'In the repository history', 'You ran git commit'],
      ],
    },
    {
      type: 'side-by-side',
      left: {
        title: 'Without staging',
        html: '<p>You\'d have to commit every change at once — even half-finished edits that don\'t belong together. History becomes a junk drawer.</p>',
      },
      right: {
        title: 'With staging',
        html: '<p>You pick exactly which edits go into each commit. History reads like a series of focused, reviewable steps.</p>',
      },
    },
    {
      type: 'quiz',
      title: 'Quick check',
      questions: [
        {
          q: 'What does git add actually do?',
          options: [
            'Saves changes to the project history',
            'Moves changes from the working tree into the staging area',
            'Uploads changes to GitHub',
            'Creates a new file',
          ],
          correct: 1,
          explanation: 'git add stages changes — it queues them up for the next commit. The commit itself is what writes to history.',
        },
        {
          q: 'A commit is best described as…',
          options: [
            'A diff against the previous version',
            'A complete snapshot of the project at a moment in time, with a message',
            'A backup of your hard drive',
            'A request to upload to a server',
          ],
          correct: 1,
          explanation: 'Internally Git is efficient about storage, but conceptually each commit is a full snapshot — that\'s why you can check out any commit and get a complete working tree.',
        },
        {
          q: 'You ran git add on a file, then edited it again before committing. What gets committed?',
          options: [
            'The latest version on disk',
            'The version you staged (the later edits are not in the commit)',
            'Nothing — Git refuses to commit',
            'Both versions',
          ],
          correct: 1,
          explanation: 'The staging area is a snapshot of the moment you ran git add. Later edits live in the working tree until you stage them too.',
        },
      ],
    },
    {
      type: 'takeaways',
      items: [
        'Files travel from working tree → staging area → repository.',
        'git add stages; git commit records. They are two distinct steps on purpose.',
        'Each commit is a self-contained snapshot you can always return to.',
      ],
    },
  ],
};
