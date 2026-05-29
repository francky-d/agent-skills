import { setInline } from './inline.js';

/**
 * Block shape:
 *   { type: 'comparison-table', headers: ['A', 'B', 'Why'], rows: [['x', 'y', 'z'], ...] }
 */
export default function renderComparisonTable(block) {
  const table = document.createElement('table');
  table.className = 'comparison-table';

  if (block.headers) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    block.headers.forEach((h) => {
      const th = document.createElement('th');
      setInline(th, h);
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
  }

  const tbody = document.createElement('tbody');
  (block.rows || []).forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      setInline(td, cell);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}
