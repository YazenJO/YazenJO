import type { Activity } from '../data';
import type { Theme } from '../theme';
import { Frame, Mono } from './primitives';

export const ACTIVITY_HEIGHT = 300;

const CELL = 15;
const GAP = 4;

function level(count: number, max: number) {
  if (count === 0) return 0;
  return Math.min(4, Math.ceil((count / max) * 4));
}

export function ActivityPanel({ t, activity }: { t: Theme; activity: Activity | null }) {
  if (!activity) {
    return (
      <Frame t={t} height={ACTIVITY_HEIGHT}>
        <Mono t={t} color={t.text}>Shipping log · last 12 months</Mono>
        <div style={{ display: 'flex', margin: 'auto 0', fontSize: 22, color: t.muted }}>
          Live data renders on the next scheduled build.
        </div>
      </Frame>
    );
  }

  // Scale against the 95th percentile so one huge day doesn't flatten the rest.
  const counts = activity.weeks.flat().map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  const max = counts.length ? counts[Math.floor(counts.length * 0.95)] || counts[counts.length - 1] : 1;

  return (
    <Frame t={t} height={ACTIVITY_HEIGHT}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Mono t={t} color={t.text}>Shipping log · last 12 months</Mono>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, letterSpacing: -1 }}>{activity.total.toLocaleString('en-US')}</div>
          <Mono t={t} size={13}>contributions</Mono>
        </div>
      </div>

      <div style={{ display: 'flex', gap: GAP, marginTop: 'auto' }}>
        {activity.weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
            {week.map((d) => (
              <div key={d.date} style={{ display: 'flex', width: CELL, height: CELL, borderRadius: 3, backgroundColor: t.heat[level(d.count, max)] }} />
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 16 }}>
        <Mono t={t} size={12} color={t.faint} style={{ marginRight: 6 }}>less</Mono>
        {t.heat.map((c) => (
          <div key={c} style={{ display: 'flex', width: 12, height: 12, borderRadius: 3, backgroundColor: c }} />
        ))}
        <Mono t={t} size={12} color={t.faint} style={{ marginLeft: 6 }}>more</Mono>
      </div>
    </Frame>
  );
}
