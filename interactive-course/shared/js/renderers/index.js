import explanation from './explanation.js';
import analogy from './analogy.js';
import svg from './svg.js';
import codeBlock from './code-block.js';
import comparisonTable from './comparison-table.js';
import quiz from './quiz.js';
import takeaways from './takeaways.js';
import workedExample from './worked-example.js';
import sideBySide from './side-by-side.js';
import quote from './quote.js';
import resources from './resources.js';
import advancedTopics from './advanced-topics.js';
import nextProjects from './next-projects.js';
import prerequisites from './prerequisites.js';

const registry = {
  explanation,
  analogy,
  svg,
  diagram: svg,
  code: codeBlock,
  'code-block': codeBlock,
  'comparison-table': comparisonTable,
  table: comparisonTable,
  quiz,
  takeaways,
  'worked-example': workedExample,
  example: workedExample,
  'side-by-side': sideBySide,
  quote,
  resources,
  'advanced-topics': advancedTopics,
  'next-projects': nextProjects,
  prerequisites,
  'pre-requis': prerequisites,
};

export function renderBlock(block) {
  const renderer = registry[block.type];
  if (!renderer) {
    const err = document.createElement('div');
    err.style.color = 'red';
    err.textContent = `Unknown block type: ${block.type}`;
    return err;
  }
  return renderer(block);
}

export function registerRenderer(type, fn) {
  registry[type] = fn;
}
