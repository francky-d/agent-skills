export default {
  id: 'where-to-go',
  eyebrow: 'Closing chapter',
  title: 'Where to go from here',
  intro: 'You\'ve seen every block type the renderer supports. The next step is to copy this folder, swap in your real content, and register the new course in index.html.',
  blocks: [
    {
      type: 'svg',
      label: 'Learning roadmap',
      caption: 'Where you started → where you are → where you can go.',
      svg: `
        <svg viewBox="0 0 480 160" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="80" x2="440" y2="80" stroke="currentColor" stroke-width="2"/>
          <circle cx="80"  cy="80" r="14" fill="var(--success)"/>
          <circle cx="240" cy="80" r="14" fill="var(--accent)"/>
          <circle cx="400" cy="80" r="14" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>
          <text x="80"  y="120" text-anchor="middle" font-family="DM Sans" font-size="12" fill="currentColor">Started</text>
          <text x="240" y="120" text-anchor="middle" font-family="DM Sans" font-size="12" fill="currentColor">You are here</text>
          <text x="400" y="120" text-anchor="middle" font-family="DM Sans" font-size="12" fill="currentColor">Next</text>
          <text x="80"  y="55"  text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">Beginner</text>
          <text x="240" y="55"  text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">Comfortable</text>
          <text x="400" y="55"  text-anchor="middle" font-family="DM Sans" font-size="11" fill="currentColor">Advanced</text>
        </svg>
      `,
    },
    {
      type: 'advanced-topics',
      items: [
        {
          title: 'Multi-stage builds',
          what: 'Use multiple FROM lines to compile in one stage and copy the result into a smaller runtime image.',
          why: 'Smaller images, faster deploys, smaller attack surface — worth it once your image cracks 200 MB.',
        },
        {
          title: 'Volumes & bind mounts',
          what: 'Persist data outside the container or share files with your host.',
          why: 'Essential for databases and for hot-reload during development.',
        },
        {
          title: 'Networks',
          what: 'Define isolated networks so a group of containers can talk to each other but not to the outside world.',
          why: 'Standard practice for any non-trivial multi-service stack.',
        },
        {
          title: 'Image registries',
          what: 'Push images to Docker Hub, GHCR, or a private registry; pull them anywhere.',
          why: 'Required for any deployment that isn\'t "build on the same machine you run on."',
        },
      ],
    },
    {
      type: 'next-projects',
      items: [
        {
          title: 'Containerise an app you already wrote',
          description: 'Take a small project from your portfolio and make it run in a single docker run command.',
          difficulty: 'easy',
          reinforces: ['Dockerfile basics', 'image vs container'],
        },
        {
          title: 'Spin up a 3-service stack with Compose',
          description: 'Web app + Postgres + Redis. One docker compose up, full stack alive.',
          difficulty: 'intermediate',
          reinforces: ['compose', 'volumes', 'networks'],
        },
        {
          title: 'Cut your image size in half',
          description: 'Apply multi-stage builds and the alpine variants. Measure before/after with docker image ls.',
          difficulty: 'challenging',
          reinforces: ['multi-stage', 'layer caching'],
        },
      ],
    },
    {
      type: 'resources',
      groups: [
        {
          title: '📖 Official',
          items: [
            { href: 'https://docs.docker.com/get-started/', label: 'Docker — Get started', note: 'The canonical entrypoint' },
            { href: 'https://docs.docker.com/compose/', label: 'Compose docs' },
          ],
        },
        {
          title: '🎥 Talks & Videos',
          items: [
            { href: 'https://www.youtube.com/results?search_query=docker+deep+dive', label: 'Docker Deep Dive talks', note: 'Search YouTube for the right level' },
          ],
        },
      ],
    },
    {
      type: 'quiz',
      title: 'Final recap',
      questions: [
        {
          q: 'Why are containers faster to start than VMs?',
          options: [
            'They use less memory',
            'They share the host kernel and skip booting an OS',
            'They run on a faster network',
            'They\'re written in Go',
          ],
          correct: 1,
          explanation: 'A VM boots a full OS; a container reuses the host\'s kernel and just starts your process.',
        },
        {
          q: 'Which command would you run to bring up a multi-service app defined in docker-compose.yml?',
          options: ['docker run -d', 'docker compose up', 'docker build .', 'docker stack deploy'],
          correct: 1,
        },
        {
          q: 'What\'s the relationship between an image and a container?',
          options: [
            'They\'re the same thing',
            'A container is a frozen image',
            'An image is a snapshot; a container is a running instance of one',
            'A container is bigger than its image',
          ],
          correct: 2,
        },
      ],
    },
  ],
};
