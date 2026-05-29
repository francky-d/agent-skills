export default {
  id: 'sample',
  eyebrow: 'Block gallery',
  title: 'Every block, demonstrated',
  intro: 'Each block below is what authors write — and what the renderer produces. Read the source of this file alongside the rendered page to see the mapping.',
  blocks: [
    {
      type: 'analogy',
      icon: '🍱',
      text: 'A container is like a lunchbox: everything the meal needs is inside, sealed, and portable.',
    },
    {
      type: 'svg',
      label: 'Lunchbox metaphor',
      caption: 'A self-contained unit you can pick up and move.',
      svg: `
        <svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="30" width="240" height="80" rx="14"
                fill="none" stroke="currentColor" stroke-width="2.2"/>
          <line x1="160" y1="30" x2="160" y2="110" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>
          <text x="100" y="78" text-anchor="middle" font-family="DM Sans" font-size="13" fill="currentColor">app code</text>
          <text x="220" y="78" text-anchor="middle" font-family="DM Sans" font-size="13" fill="currentColor">runtime + libs</text>
        </svg>
      `,
    },
    {
      type: 'code',
      tabs: [
        {
          name: 'Dockerfile',
          lang: 'docker',
          code: `# A minimal Node.js image
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]`,
        },
        {
          name: 'docker-compose.yml',
          lang: 'yaml',
          code: `services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production`,
        },
      ],
    },
    {
      type: 'comparison-table',
      headers: ['VM', 'Container', 'Why it matters'],
      rows: [
        ['Boots a full OS', 'Shares the host kernel', 'Containers start in milliseconds'],
        ['Gigabytes', 'Megabytes', 'Faster pulls and deploys'],
        ['One per machine, usually', 'Dozens per machine', 'Higher density'],
      ],
    },
    {
      type: 'worked-example',
      title: 'Walk through a build',
      steps: [
        { text: 'Write a Dockerfile in your project root.', cue: 'You should now have a single text file.' },
        { text: 'Run docker build -t my-app .', cue: 'You see each instruction execute as a layer.' },
        { text: 'Run docker run -p 3000:3000 my-app', cue: 'Visit http://localhost:3000 — your app is live.' },
      ],
    },
    {
      type: 'side-by-side',
      left: {
        title: 'Without Docker',
        html: '<p>Install Node, install Postgres, configure ports, hope your teammate has the same versions.</p>',
      },
      right: {
        title: 'With Docker',
        html: '<p>One <code>docker compose up</code> spins up the whole stack with the exact versions everyone shares.</p>',
      },
    },
    {
      type: 'quote',
      text: 'It works on my machine — and now, thanks to containers, on yours too.',
      attribution: 'Every developer, eventually',
    },
    {
      type: 'quiz',
      title: 'Quick check',
      questions: [
        {
          q: 'What does a Docker container share with its host?',
          options: [
            'A full operating system',
            'The Linux kernel',
            'Nothing at all',
            'Its filesystem',
          ],
          correct: 1,
          explanation: 'Containers share the host kernel — that\'s what makes them lightweight compared to VMs.',
        },
        {
          q: 'Which file describes how to build a container image?',
          options: ['package.json', 'docker-compose.yml', 'Dockerfile', 'README.md'],
          correct: 2,
          explanation: 'The Dockerfile is a recipe: each line becomes a layer in the resulting image.',
        },
      ],
    },
    {
      type: 'takeaways',
      items: [
        'Containers package an app + its dependencies into a portable unit.',
        'They share the host kernel — that\'s why they\'re fast and small.',
        'A Dockerfile is the recipe; an image is the cooked dish; a container is the meal you serve.',
      ],
    },
  ],
};
