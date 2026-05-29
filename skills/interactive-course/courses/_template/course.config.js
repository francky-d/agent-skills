import intro from './content/00-intro.js';
import sample from './content/01-sample-chapter.js';
import closing from './content/99-where-to-go.js';

export default {
  slug: 'template',
  title: 'Template Course',
  lang: 'en',
  duration: '~10 minutes',
  theme: { accent: '#3b82f6', secondary: '#22d3ee' },
  chapters: [intro, sample, closing],
};
