export default {
  id: 'intro',
  eyebrow: 'Welcome',
  title: 'How this course works',
  intro: 'This template demonstrates every block type the renderer supports. Copy this folder, rename it, and replace the content — the shared layer handles the rest.',
  blocks: [
    {
      type: 'analogy',
      icon: '🧩',
      text: 'Think of this template like a furnished apartment. The walls, plumbing, and electricity are already in place — you just bring your furniture (the content) and arrange it.',
    },
    {
      type: 'explanation',
      html: `
        <p>Each chapter is a plain JavaScript object with an <code>id</code>, a <code>title</code>, and a list of <code>blocks</code>. A block is a typed piece of content (analogy, code, quiz, takeaways, …) that the renderer turns into accessible, themed HTML.</p>
        <p>To add a new block type, drop a file in <code>shared/js/renderers/</code> and register it in <code>renderers/index.js</code>. Every existing course gets the new block for free.</p>
      `,
    },
    {
      type: 'takeaways',
      items: [
        'Content is data — never raw HTML you have to maintain by hand.',
        'The shared layer fixes bugs and adds features for every course at once.',
        'A course folder is just <code>index.html</code> + <code>course.config.js</code> + chapter files.',
      ],
    },
  ],
};
