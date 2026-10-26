// Live data for the activity panel. Only real numbers from the GitHub API
// are ever rendered; if the fetch fails the panel says so instead.

export type Day = { date: string; count: number };
export type Activity = { total: number; weeks: Day[][] };

const QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

export async function fetchActivity(login: string): Promise<Activity | null> {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('activity: no GH_TOKEN/GITHUB_TOKEN set, skipping live data');
    return null;
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
    });
    const json = (await res.json()) as any;
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!res.ok || !cal) {
      console.warn('activity: GitHub API returned no calendar', res.status, JSON.stringify(json?.errors ?? ''));
      return null;
    }
    return {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w: any) =>
        w.contributionDays.map((d: any) => ({ date: d.date, count: d.contributionCount })),
      ),
    };
  } catch (err) {
    console.warn('activity: fetch failed', err);
    return null;
  }
}
