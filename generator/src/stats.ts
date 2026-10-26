// Pure derivations from the raw API data, kept separate so they can be tested.

import type { Day, RawStats } from './data';

export type Language = { name: string; share: number };
export type Month = { key: string; label: string; count: number };

export type Stats = RawStats & {
  days: Day[];
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  stars: number;
  languages: Language[];
  months: Month[];
  updated: string;
};

// Today's square is usually still empty when the job runs, so a streak
// only counts as broken once a full day passes without a contribution.
export function streaks(days: Day[]) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let current = 0;
  while (i >= 0 && days[i].count > 0) {
    current++;
    i--;
  }
  return { current, longest };
}

// Share of bytes across public, non-fork repositories. Languages under 2%
// fold into "Other" so the bar stays readable.
export function languages(repos: RawStats['repos'], top = 5): Language[] {
  const bytes = new Map<string, number>();
  for (const repo of repos) {
    if (repo.isFork) continue;
    for (const l of repo.languages) bytes.set(l.name, (bytes.get(l.name) ?? 0) + l.size);
  }
  const total = [...bytes.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  const sorted = [...bytes.entries()].map(([name, size]) => ({ name, share: size / total })).sort((a, b) => b.share - a.share);
  const shown = sorted.slice(0, top).filter((l) => l.share >= 0.02);
  const other = 1 - shown.reduce((a, l) => a + l.share, 0);
  return other > 0.005 ? [...shown, { name: 'Other', share: other }] : shown;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// The calendar spans ~53 weeks, so the oldest month is partial; keep the last 12.
export function months(days: Day[]): Month[] {
  const byMonth = new Map<string, number>();
  for (const d of days) {
    const key = d.date.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + d.count);
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, count]) => ({ key, label: MONTHS[Number(key.slice(5, 7)) - 1], count }));
}

export function summarize(raw: RawStats, now = new Date()): Stats {
  const days = raw.weeks.flat();
  const { current, longest } = streaks(days);
  return {
    ...raw,
    days,
    activeDays: days.filter((d) => d.count > 0).length,
    currentStreak: current,
    longestStreak: longest,
    stars: raw.repos.reduce((a, r) => a + r.stars, 0),
    languages: languages(raw.repos),
    months: months(days),
    updated: now.toISOString().slice(0, 10),
  };
}
