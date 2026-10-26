import assert from 'node:assert/strict';
import { test } from 'node:test';
import { languages, months, streaks } from './stats';

const days = (counts: number[], start = '2026-01-01') =>
  counts.map((count, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    return { date: d.toISOString().slice(0, 10), count };
  });

test('streaks: an empty today does not break the current streak', () => {
  assert.deepEqual(streaks(days([1, 0, 2, 3, 4, 0])), { current: 3, longest: 3 });
});

test('streaks: a full empty day does', () => {
  assert.deepEqual(streaks(days([5, 5, 5, 5, 0, 0])), { current: 0, longest: 4 });
});

test('streaks: contributing today extends the streak', () => {
  assert.deepEqual(streaks(days([0, 1, 1])), { current: 2, longest: 2 });
});

test('streaks: no data', () => {
  assert.deepEqual(streaks([]), { current: 0, longest: 0 });
});

test('languages: forks are ignored, small ones fold into Other', () => {
  const result = languages([
    { isFork: false, stars: 0, languages: [{ name: 'C#', size: 700 }, { name: 'CSS', size: 10 }] },
    { isFork: false, stars: 0, languages: [{ name: 'TypeScript', size: 290 }] },
    { isFork: true, stars: 0, languages: [{ name: 'Python', size: 10_000 }] },
  ]);
  assert.deepEqual(result.map((l) => l.name), ['C#', 'TypeScript', 'Other']);
  assert.ok(Math.abs(result.reduce((a, l) => a + l.share, 0) - 1) < 1e-9);
});

test('languages: no code at all', () => {
  assert.deepEqual(languages([]), []);
});

test('months: keeps the last 12 months in order', () => {
  const m = months(days(Array(400).fill(1), '2025-09-20'));
  assert.equal(m.length, 12);
  assert.equal(m[0].key < m[11].key, true);
  assert.equal(m[11].label, 'Oct');
});
