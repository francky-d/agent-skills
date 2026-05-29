export default {
  id: 'branching',
  eyebrow: 'Core Mechanics',
  title: 'Branches: parallel timelines without the chaos',
  intro: 'Branches are what make Git feel magical. They\'re cheap, fast, and the single best habit you can pick up: never work directly on main.',
  blocks: [
    {
      type: 'analogy',
      icon: '🌿',
      text: 'Think of a branch like a sticky note that says "the latest commit on this line of work." When you switch branches, you pick up that sticky note and look at the commit it points to. Creating a branch costs nothing — it\'s just a new sticky note pointing at the same commit.',
    },
    {
      type: 'explanation',
      html: `
        <p>A <strong>branch</strong> in Git is literally a pointer to a single commit. The branch called <code>main</code> points at the most recent commit on your main line of work. Create a branch called <code>feature/login</code> and you get a second pointer at the same commit. As you commit on <code>feature/login</code>, that pointer moves forward; <code>main</code> stays where it was.</p>
        <p>When the feature is done, you <strong>merge</strong> the branch back into <code>main</code>. Git replays the commits (or creates a single "merge commit" that ties the two lines together) and your work is integrated.</p>
      `,
    },
    {
      type: 'svg',
      label: 'A branch diverging from main and merging back',
      caption: 'main keeps moving; a feature branch forks off, gets two commits, and merges back.',
      svg: `
        <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="100" x2="480" y2="100" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="80"  cy="100" r="10" fill="var(--accent)"/>
          <circle cx="180" cy="100" r="10" fill="var(--accent)"/>
          <circle cx="400" cy="100" r="10" fill="var(--accent)"/>
          <circle cx="460" cy="100" r="10" fill="var(--accent)"/>
          <path d="M180 100 Q240 60 280 60" fill="none" stroke="var(--secondary)" stroke-width="1.5"/>
          <path d="M340 60 Q380 60 400 100" fill="none" stroke="var(--secondary)" stroke-width="1.5"/>
          <circle cx="280" cy="60" r="9" fill="var(--secondary)"/>
          <circle cx="340" cy="60" r="9" fill="var(--secondary)"/>
          <text x="80"  y="135" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="currentColor">A</text>
          <text x="180" y="135" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="currentColor">B</text>
          <text x="400" y="135" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="currentColor">E (merge)</text>
          <text x="460" y="135" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="currentColor">F</text>
          <text x="280" y="45"  text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="currentColor">C</text>
          <text x="340" y="45"  text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="currentColor">D</text>
          <text x="40"  y="105" text-anchor="end" font-family="DM Sans" font-size="11" fill="currentColor">main →</text>
          <text x="310" y="30"  text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">feature/login</text>
        </svg>
      `,
    },
    {
      type: 'code',
      tabs: [
        {
          name: 'Branch & switch',
          lang: 'bash',
          code: `# Create a new branch and switch to it in one go
git switch -c feature/login

# Make commits — they only affect this branch
git add auth.js
git commit -m "Add login form"

# Switch back to main without losing your work
git switch main

# See all branches; the current one has a *
git branch`,
        },
        {
          name: 'Merge it back',
          lang: 'bash',
          code: `# From main, pull in everything from feature/login
git switch main
git merge feature/login

# Delete the branch once it\'s merged
git branch -d feature/login

# If a merge causes conflicts, Git pauses and asks you to resolve them
# After fixing the files:
git add conflicted-file.js
git commit                  # finishes the merge`,
        },
      ],
    },
    {
      type: 'worked-example',
      title: 'Daily workflow on a feature branch',
      steps: [
        { text: 'git switch -c feature/profile-page', cue: 'You\'re now on a fresh branch starting from main.' },
        { text: 'Edit files, run your app, commit small steps.', cue: 'git log --oneline shows your new commits stacking up.' },
        { text: 'git switch main && git pull (more on pull next chapter)', cue: 'main is now up to date with any work your teammates pushed.' },
        { text: 'git switch feature/profile-page && git merge main', cue: 'You bring main\'s latest into your branch — easier to fix conflicts now than later.' },
        { text: 'Open a pull request, get review, merge into main.', cue: 'Your work is integrated. Delete the branch.' },
      ],
    },
    {
      type: 'quiz',
      title: 'Quick check',
      questions: [
        {
          q: 'What is a Git branch, technically?',
          options: [
            'A copy of all your files',
            'A pointer to a single commit',
            'A folder inside .git/',
            'A backup of main',
          ],
          correct: 1,
          explanation: 'A branch is just a movable pointer to a commit. That\'s why creating one is effectively free.',
        },
        {
          q: 'Why is "never work directly on main" considered a best practice?',
          options: [
            'main is protected by Git itself',
            'It keeps main always shippable and makes review/rollback easy',
            'Git can\'t commit to main',
            'It saves disk space',
          ],
          correct: 1,
          explanation: 'Branching for every change keeps main clean, lets others review your work, and makes rolling back trivial.',
        },
        {
          q: 'You\'re on feature/login with uncommitted changes and try to switch to main. What happens?',
          options: [
            'Git silently discards your changes',
            'Git refuses if the changes would be overwritten, or carries them along if not',
            'Git automatically commits them for you',
            'Git switches but deletes the branch',
          ],
          correct: 1,
          explanation: 'Git protects unstaged work. If a switch would lose changes, it errors and asks you to commit or stash first.',
        },
      ],
    },
    {
      type: 'takeaways',
      items: [
        'A branch is a pointer to a commit — cheap, fast, and disposable.',
        'Use a branch for every feature, bugfix, or experiment.',
        'Merge brings two branches back together; conflicts are normal and resolvable.',
      ],
    },
  ],
};
