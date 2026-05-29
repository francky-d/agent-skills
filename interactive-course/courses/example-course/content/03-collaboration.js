export default {
  id: 'collaboration',
  eyebrow: 'Idioms & Best Practices',
  title: 'Remotes, pull requests, and the habits of a good collaborator',
  intro: 'Git on its own is already useful. Git on a team — through a remote like GitHub — is where it becomes essential. This chapter covers the small set of habits that separate a smooth collaborator from someone who breaks main once a month.',
  blocks: [
    {
      type: 'analogy',
      icon: '🌐',
      text: 'Think of a remote as a shared printing press. Everyone has their own draft notebook (their local repo), and the press has the official published edition. You push your pages to be published, and you pull the latest published pages to stay in sync.',
    },
    {
      type: 'explanation',
      html: `
        <p>A <strong>remote</strong> is just a Git repository hosted elsewhere — typically on GitHub, GitLab, Bitbucket, or a self-hosted server. By convention the main remote is called <code>origin</code>.</p>
        <p>Three commands move work between you and the remote:</p>
        <ul>
          <li><code>git fetch</code> — download the latest commits from the remote without changing your branches.</li>
          <li><code>git pull</code> — fetch + merge into your current branch (the everyday "get the latest" command).</li>
          <li><code>git push</code> — upload your local commits to the remote.</li>
        </ul>
        <p>A <strong>pull request</strong> (or <em>merge request</em>) is a feature of the hosting platform, not Git itself: it\'s a request to merge a branch, with review, discussion, and CI checks attached.</p>
      `,
    },
    {
      type: 'code',
      tabs: [
        {
          name: 'Clone and contribute',
          lang: 'bash',
          code: `# Get a copy of a remote repo
git clone https://github.com/acme/cool-app.git
cd cool-app

# Create a branch for your work
git switch -c feature/dark-mode

# Make commits, then push the branch to the remote
git push -u origin feature/dark-mode

# Open a Pull Request in the web UI, get review, merge`,
        },
        {
          name: 'Stay in sync',
          lang: 'bash',
          code: `# Get the latest from the remote
git switch main
git pull

# Update your feature branch with main\'s latest
git switch feature/dark-mode
git merge main         # or: git rebase main (rewrites history; see below)

# Push your updated branch
git push`,
        },
      ],
    },
    {
      type: 'comparison-table',
      headers: ['Don\'t', 'Do', 'Why'],
      rows: [
        ['Commit straight to main', 'Branch, PR, review', 'Keeps main always shippable; spreads knowledge'],
        ['One giant commit at the end', 'Small, focused commits', 'Easier review, bisect, and rollback'],
        ['"fix" / "stuff" / "wip" messages', 'Imperative sentences explaining the why', 'Future you will read these in git log'],
        ['git push --force on shared branches', 'force-push only your own feature branches, never main', 'Rewriting shared history breaks teammates\' clones'],
        ['git add . without looking', 'git status / git diff first, then stage deliberately', 'Avoids committing secrets, debug logs, or unrelated edits'],
      ],
    },
    {
      type: 'side-by-side',
      left: {
        title: 'Merge',
        html: '<p>Brings two branches together by creating a new "merge commit" with two parents. History shows the branching shape. Safe on shared branches.</p>',
      },
      right: {
        title: 'Rebase',
        html: '<p>Replays your commits on top of the target branch as if they\'d been there all along. History stays linear. Never rebase a branch others are working on.</p>',
      },
    },
    {
      type: 'quote',
      text: 'Commit early, commit often — and write commit messages your future self will thank you for.',
      attribution: 'Distilled from a decade of code reviews',
    },
    {
      type: 'quiz',
      title: 'Quick check',
      questions: [
        {
          q: 'What is the difference between git fetch and git pull?',
          options: [
            'fetch downloads commits without modifying your branches; pull does fetch + merge',
            'fetch is for files, pull is for branches',
            'They\'re aliases for the same command',
            'pull is read-only, fetch writes to disk',
          ],
          correct: 0,
          explanation: 'fetch is safe — it never changes your working tree. pull is fetch + automatic merge into the current branch.',
        },
        {
          q: 'Which of these is a genuinely dangerous habit?',
          options: [
            'Creating short-lived branches',
            'Writing detailed commit messages',
            'Running git push --force on a shared branch',
            'Running git status often',
          ],
          correct: 2,
          explanation: 'Force-pushing rewrites history. On a shared branch that breaks every teammate who pulled the previous version.',
        },
        {
          q: 'A pull request is…',
          options: [
            'A Git command',
            'A feature of platforms like GitHub/GitLab that wraps a merge in review and CI',
            'Another name for git pull',
            'A way to revert commits',
          ],
          correct: 1,
          explanation: 'PRs are not part of Git itself — they\'re the platform layer on top, where review, discussion, and CI run before the merge.',
        },
      ],
    },
    {
      type: 'takeaways',
      items: [
        'A remote is a shared copy of the repo; origin is the conventional name for the main one.',
        'Pull requests are where review, CI, and discussion happen before changes land on main.',
        'Small commits, clear messages, and respecting shared history are the habits that compound.',
      ],
    },
  ],
};
