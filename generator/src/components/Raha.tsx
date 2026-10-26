import type { Theme } from '../theme';
import { Frame, Header, Mono } from './primitives';

export const RAHA_HEIGHT = 770;

// The layers of RAHA's Clean Architecture backend plus the client that sits on top.
const layers = [
  { name: 'Client', detail: 'React · TypeScript · Tailwind' },
  { name: 'API', detail: 'ASP.NET Core · 14 controllers' },
  { name: 'Application', detail: 'Use cases · FluentValidation' },
  { name: 'Domain', detail: 'Entities · events · policies', core: true },
  { name: 'Infrastructure', detail: 'EF Core · SQL Server · Azure' },
];

const stats = [
  { value: '160+', label: 'REST endpoints' },
  { value: '3', label: 'roles: guest · host · admin' },
  { value: 'AR / EN', label: 'bilingual, full RTL' },
  { value: 'Azure', label: 'App Service · SQL · Key Vault' },
];

const decisions = [
  'Result<T> instead of exceptions',
  'Domain events for side effects',
  'Optimistic concurrency',
  'Refresh-token rotation + reuse detection',
  'Tiered rate limiting',
];

export function Raha({ t }: { t: Theme }) {
  return (
    <Frame t={t} height={RAHA_HEIGHT}>
      <Header t={t} index="01" kicker="Flagship" pills={[{ text: 'Solo build', solid: true }, { text: 'Private repo' }]} />

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 34 }}>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>RAHA</div>
        <Mono t={t} size={16}>Farm & chalet booking · Jordan</Mono>
      </div>

      <div style={{ display: 'flex', marginTop: 18, fontSize: 25, lineHeight: 1.45, color: t.muted, maxWidth: 1000 }}>
        A two-sided booking marketplace. Guests search, book and review stays; hosts run listings, calendars, pricing and earnings; admins approve and moderate. Designed, built and deployed by me.
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 34 }}>
        {layers.map((l) => (
          <div
            key={l.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: 8,
              padding: '16px 18px',
              borderRadius: 12,
              border: `1px solid ${l.core ? t.accent : t.line}`,
              backgroundColor: t.surface,
            }}
          >
            <Mono t={t} size={14} color={l.core ? t.accent : t.faint}>
              {l.name}
            </Mono>
            <div style={{ display: 'flex', fontSize: 18, color: t.text, lineHeight: 1.35 }}>{l.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', marginTop: 34, borderTop: `1px solid ${t.line}`, paddingTop: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 6 }}>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 600, letterSpacing: -1.5 }}>{s.value}</div>
            <div style={{ display: 'flex', fontSize: 18, color: t.muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto' }}>
        {decisions.map((d) => (
          <div key={d} style={{ display: 'flex', padding: '8px 14px', borderRadius: 8, border: `1px solid ${t.line}`, fontFamily: 'Mono', fontSize: 15, color: t.muted }}>
            {d}
          </div>
        ))}
      </div>
    </Frame>
  );
}
