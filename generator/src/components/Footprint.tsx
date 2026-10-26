import type { Stats } from '../stats';
import type { Theme } from '../theme';
import { Frame, Mono } from './primitives';

export const FOOTPRINT_HEIGHT = 520;

const CHART_HEIGHT = 170;

function Languages({ t, stats }: { t: Theme; stats: Stats }) {
  const color = (name: string, i: number) => (name === 'Other' ? t.ramp[t.ramp.length - 1] : t.ramp[i]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Mono t={t} color={t.text}>Languages</Mono>
        <Mono t={t} size={13} color={t.faint}>public repos · by bytes</Mono>
      </div>

      {stats.languages.length === 0 ? (
        <div style={{ display: 'flex', marginTop: 28, fontSize: 20, color: t.muted }}>No public code yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', height: 12, marginTop: 26, borderRadius: 6, overflow: 'hidden', gap: 3 }}>
            {stats.languages.map((l, i) => (
              <div key={l.name} style={{ display: 'flex', width: `${l.share * 100}%`, backgroundColor: color(l.name, i) }} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
            {stats.languages.map((l, i) => (
              <div key={l.name} style={{ display: 'flex', alignItems: 'center', height: 36, borderTop: i === 0 ? 'none' : `1px solid ${t.line}` }}>
                <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 2, marginRight: 14, backgroundColor: color(l.name, i) }} />
                <div style={{ display: 'flex', flex: 1, fontSize: 20, fontWeight: i === 0 ? 600 : 400, color: l.name === 'Other' ? t.muted : t.text }}>{l.name}</div>
                <div style={{ display: 'flex', fontFamily: 'Mono', fontSize: 17, color: t.muted }}>{`${(l.share * 100).toFixed(1)}%`}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Rhythm({ t, stats }: { t: Theme; stats: Stats }) {
  const max = Math.max(1, ...stats.months.map((m) => m.count));
  const peak = stats.months.reduce((a, m) => (m.count > a.count ? m : a), stats.months[0] ?? { key: '', label: '', count: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Mono t={t} color={t.text}>Monthly rhythm</Mono>
        <Mono t={t} size={13} color={t.faint}>{peak.count > 0 ? `peak · ${peak.label} · ${peak.count.toLocaleString('en-US')}` : 'no activity yet'}</Mono>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: CHART_HEIGHT, marginTop: 30, borderBottom: `1px solid ${t.line}` }}>
        {stats.months.map((m) => (
          <div
            key={m.key}
            style={{
              display: 'flex',
              flex: 1,
              height: Math.max(3, Math.round((m.count / max) * (CHART_HEIGHT - 6))),
              borderRadius: '4px 4px 0 0',
              backgroundColor: m.key === peak.key && peak.count > 0 ? t.accent : t.bar,
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {stats.months.map((m) => (
          <div key={m.key} style={{ display: 'flex', flex: 1, justifyContent: 'center', fontFamily: 'Mono', fontSize: 13, color: t.faint }}>
            {m.label.slice(0, 1)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Count({ t, value, label }: { t: Theme; value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 6 }}>
      <div style={{ display: 'flex', fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>{value}</div>
      <div style={{ display: 'flex', fontSize: 17, color: t.muted }}>{label}</div>
    </div>
  );
}

export function Footprint({ t, stats }: { t: Theme; stats: Stats }) {
  const fmt = (n: number) => n.toLocaleString('en-US');
  // With the default workflow token, private work only shows up as an
  // anonymous total, so the commit and PR counts are public-only.
  const scope = stats.restricted > 0 ? 'public ' : '';

  return (
    <Frame t={t} height={FOOTPRINT_HEIGHT}>
      <div style={{ display: 'flex', gap: 64 }}>
        <Languages t={t} stats={stats} />
        <Rhythm t={t} stats={stats} />
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 'auto', paddingTop: 26, borderTop: `1px solid ${t.line}` }}>
        <Count t={t} value={fmt(stats.commits)} label={`${scope}commits, 12 mo`} />
        <Count t={t} value={fmt(stats.pullRequests)} label={`${scope}PRs, 12 mo`} />
        <Count t={t} value={fmt(stats.publicRepos)} label="public repos" />
        <Count t={t} value={fmt(stats.stars)} label="stars earned" />
        <Count t={t} value={`${fmt(stats.followers)} / ${fmt(stats.following)}`} label="followers / following" />
      </div>
    </Frame>
  );
}
