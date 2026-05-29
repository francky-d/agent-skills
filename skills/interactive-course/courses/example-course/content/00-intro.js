export default {
  id: 'intro',
  eyebrow: 'Welcome',
  title: 'Why Git matters',
  intro: 'Git is the version control system that runs under almost every modern software project. This crash course gives you the mental model and the five or six commands you actually use every day — enough to work confidently on your own projects and to read along on a team.',
  blocks: [
    {
      type: 'analogy',
      icon: '📓',
      text: 'Think of Git like a magical notebook. Every time you save a page, the notebook keeps a perfect copy of every previous page too — and lets you flip back, fork off a new chapter, or merge two chapters together without losing anything.',
    },
    {
      type: 'explanation',
      html: `
        <p>Git is a <strong>distributed version control system</strong>: a tool that tracks every change to a project, lets multiple people work on it in parallel, and makes it safe to experiment because nothing is ever truly lost.</p>
        <p>You'll meet three core ideas in this course:</p>
        <ul>
          <li><strong>Snapshots</strong> — Git records the state of your project as a series of point-in-time photos called <em>commits</em>.</li>
          <li><strong>Branches</strong> — lightweight parallel timelines that let you try an idea without disturbing the main line.</li>
          <li><strong>Remotes</strong> — copies of the project on another machine (typically GitHub, GitLab, or a colleague's laptop) that you push changes to and pull changes from.</li>
        </ul>
        <p>That's the whole job description. Everything else is variations on those three.</p>
      `,
    },
    {
      type: 'takeaways',
      items: [
        'Git is a snapshot machine — every commit is a complete photo of your project at that moment.',
        'Branches make experimentation cheap and reversible.',
        'Remotes are how Git becomes a team sport.',
      ],
    },
  ],
};
