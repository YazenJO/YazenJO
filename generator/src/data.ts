// Everything the stats panels show comes from one GitHub GraphQL query.
// Only real API numbers are rendered; if the fetch fails the panels are
// left as they are (see render.tsx).
//
// Privacy: repositories are queried with privacy: PUBLIC, so private repo
// names and languages are never requested. The contribution calendar only
// carries per-day counts, and includes private work only if "Private
// contributions" is switched on in the profile settings, the same numbers
// GitHub already shows on the public profile.

import { readFile } from 'node:fs/promises';

export type Day = { date: string; count: number };

export type RawStats = {
  login: string;
  followers: number;
  following: number;
  publicRepos: number;
  repos: { isFork: boolean; stars: number; languages: { name: string; size: number }[] }[];
  commits: number;
  pullRequests: number;
  reviews: number;
  issues: number;
  restricted: number;
  total: number;
  weeks: Day[][];
};

export const QUERY = `
query($login: String!) {
  user(login: $login) {
    login
    followers { totalCount }
    following { totalCount }
    repositories(first: 100, ownerAffiliations: [OWNER], privacy: PUBLIC, orderBy: { field: PUSHED_AT, direction: DESC }) {
      totalCount
      nodes {
        isFork
        stargazerCount
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name } }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

export function parse(user: any): RawStats {
  const cc = user.contributionsCollection;
  return {
    login: user.login,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    publicRepos: user.repositories.totalCount,
    repos: user.repositories.nodes.map((r: any) => ({
      isFork: r.isFork,
      stars: r.stargazerCount,
      languages: r.languages.edges.map((e: any) => ({ name: e.node.name, size: e.size })),
    })),
    commits: cc.totalCommitContributions,
    pullRequests: cc.totalPullRequestContributions,
    reviews: cc.totalPullRequestReviewContributions,
    issues: cc.totalIssueContributions,
    restricted: cc.restrictedContributionsCount,
    total: cc.contributionCalendar.totalContributions,
    weeks: cc.contributionCalendar.weeks.map((w: any) =>
      w.contributionDays.map((d: any) => ({ date: d.date, count: d.contributionCount })),
    ),
  };
}

export async function fetchStats(login: string): Promise<RawStats | null> {
  // Local design work only: render.tsx refuses to write a fixture into assets/.
  if (process.env.STATS_FIXTURE) {
    return JSON.parse(await readFile(process.env.STATS_FIXTURE, 'utf8')) as RawStats;
  }

  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('stats: no GH_TOKEN/GITHUB_TOKEN set, skipping live data');
    return null;
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
    });
    const json = (await res.json()) as any;
    if (!res.ok || !json?.data?.user) {
      console.warn('stats: GitHub API returned no user', res.status, JSON.stringify(json?.errors ?? ''));
      return null;
    }
    return parse(json.data.user);
  } catch (err) {
    console.warn('stats: fetch failed', err);
    return null;
  }
}
