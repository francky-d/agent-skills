/**
 * Per-course progress state, persisted in localStorage and broadcast to
 * subscribers. Three keys per course slug:
 *   course-progress-{slug}  → visited chapter IDs (auto, scroll spy)
 *   course-finished-{slug}  → finished chapter IDs (manual / next-button)
 *   course-last-{slug}      → most recently in-view chapter ID (resume)
 *
 * Quiz scores are NOT persisted.
 */

let courseSlug = '';
let total = 0;
let bar;
const listeners = new Set();

const visitedKey = () => `course-progress-${courseSlug}`;
const finishedKey = () => `course-finished-${courseSlug}`;
const lastKey = () => `course-last-${courseSlug}`;

export function initProgress(slug, chapters, fillEl) {
  courseSlug = slug;
  total = chapters.length;
  bar = fillEl;
  paint();

  if (chapters[0]) markVisited(chapters[0].id);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          markVisited(entry.target.id);
          setLastChapter(entry.target.id);
        }
      });
    },
    { threshold: [0.4] },
  );

  chapters.forEach((c) => {
    const el = document.getElementById(c.id);
    if (el) observer.observe(el);
  });
}

export function getStatus(id) {
  if (readSet(finishedKey()).has(id)) return 'finished';
  if (readSet(visitedKey()).has(id)) return 'in_progress';
  return 'not_started';
}

export function markFinished(id) {
  const f = readSet(finishedKey());
  if (f.has(id)) return;
  f.add(id);
  writeSet(finishedKey(), f);
  paint();
  notify();
}

export function toggleFinished(id) {
  const f = readSet(finishedKey());
  if (f.has(id)) f.delete(id);
  else f.add(id);
  writeSet(finishedKey(), f);
  paint();
  notify();
}

export function getLastChapter() {
  try {
    return localStorage.getItem(lastKey()) || null;
  } catch {
    return null;
  }
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function refresh() {
  paint();
  notify();
}

function setLastChapter(id) {
  try {
    if (localStorage.getItem(lastKey()) === id) return;
    localStorage.setItem(lastKey(), id);
  } catch {
    /* storage unavailable — ignore */
  }
}

function readSet(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  } catch {
    return new Set();
  }
}

function writeSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* storage unavailable — ignore */
  }
}

function markVisited(id) {
  const v = readSet(visitedKey());
  if (v.has(id)) return;
  v.add(id);
  writeSet(visitedKey(), v);
  paint();
  notify();
}

function paint() {
  if (!bar) return;
  const f = readSet(finishedKey());
  const pct = total > 0 ? Math.min(100, (f.size / total) * 100) : 0;
  bar.style.width = `${pct}%`;
}

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* listener errors must not break others */
    }
  });
}
