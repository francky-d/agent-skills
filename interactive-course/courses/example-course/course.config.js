import intro from './content/00-intro.js';
import snapshots from './content/01-snapshots.js';
import branching from './content/02-branching.js';
import collaboration from './content/03-collaboration.js';
import closing from './content/99-where-to-go.js';

export default {
  slug: 'example-course',
  title: 'Git Basics — Crash Course',
  lang: 'en',
  duration: '~45 minutes',
  theme: { accent: '#f97316', secondary: '#22d3ee' },
  chapters: [intro, snapshots, branching, collaboration, closing],
};
