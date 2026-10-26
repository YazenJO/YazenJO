import type { Stats } from '../stats';
import type { Theme } from '../theme';
import { Frame, Mono } from './primitives';

export const ACTIVITY_HEIGHT = 470;

const CELL = 16;
const GAP = 4;
const STEP = CELL + GAP;

function level(count: number, max: number) {
  if (count === 0) return 0;
  return Math.min(4, Math.ceil((count / max) * 4));
}

const days = (n: number) => (n === 1 ? 'day' : 'days');

function Metric({ t, value, unit, label }: { t: Theme; value: string; unit?: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 600, letterSpacing: -2, lineHeight: 1 }}>{value}</div>
        {unit && <div style={{ display: 'flex', fontSize: 20, color: t.muted }}>{unit}</div>}
      </div>
      <div style={{ display: 'flex', fontSize: 18, color: t.muted }}>{label}</div>
    </div>
  );
}

// A month label goes over the first week that starts in that month,
// unless it would collide with the previous label.
function monthLabels(weeks: Stats['weeks']) {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels: { x: number; text: string }[] = [];
  let prev = '';
  weeks.forEach((week, wi) => {
    const month = week[0]?.date.slice(5, 7);
    if (!month || month === prev) return;
    prev = month;
    const x = wi * STEP;
    if (labels.length && x - labels[labels.length - 1].x < STEP * 3) return;
    labels.push({ x, text: names[Number(month) - 1] });
  });
  return labels;
}

export function ActivityPanel({ t, stats }: { t: Theme; stats: Stats }) {
  // Scale against the 95th percentile so one huge day doesn't flatten the rest.
  const counts = stats.days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  const max = counts.length ? counts[Math.floor(counts.length * 0.95)] || counts[counts.length - 1] : 1;
  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <Frame t={t} height={ACTIVITY_HEIGHT}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Mono t={t} color={t.text}>Shipping log · last 12 months</Mono>
        <Mono t={t} color={t.faint}>{`Updated ${stats.updated}`}</Mono>
      </div>

      <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
        <Metric t={t} value={fmt(stats.total)} label="contributions" />
        <Metric t={t} value={fmt(stats.activeDays)} unit={`/ ${stats.days.length}`} label="days with a contribution" />
        <Metric t={t} value={fmt(stats.currentStreak)} unit={days(stats.currentStreak)} label="current streak" />
        <Metric t={t} value={fmt(stats.longestStreak)} unit={days(stats.longestStreak)} label="longest streak" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
        <div style={{ display: 'flex', position: 'relative', height: 22 }}>
          {monthLabels(stats.weeks).map((m) => (
            <div key={m.x} style={{ display: 'flex', position: 'absolute', left: m.x, top: 0, fontFamily: 'Mono', fontSize: 14, color: t.faint }}>
              {m.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: GAP }}>
          {stats.weeks.map((week, wi) => (
            // The API's first week can start mid-week; pad it so weekdays line up.
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', justifyContent: wi === 0 ? 'flex-end' : 'flex-start', height: 7 * STEP - GAP, gap: GAP }}>
              {week.map((d) => (
                <div key={d.date} style={{ display: 'flex', width: CELL, height: CELL, borderRadius: 3, backgroundColor: t.heat[level(d.count, max)] }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 16 }}>
        <Mono t={t} size={13} color={t.faint} style={{ marginRight: 6 }}>less</Mono>
        {t.heat.map((c) => (
          <div key={c} style={{ display: 'flex', width: 12, height: 12, borderRadius: 3, backgroundColor: c }} />
        ))}
        <Mono t={t} size={13} color={t.faint} style={{ marginLeft: 6 }}>more</Mono>
      </div>
    </Frame>
  );
}
