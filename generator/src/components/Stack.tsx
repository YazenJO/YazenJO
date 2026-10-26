import type { Theme } from '../theme';
import { Frame, Mono } from './primitives';

export const STACK_HEIGHT = 560;

// Grouped by the layer it serves, not alphabetised into a badge wall.
const rows = [
  { layer: 'Interface', tools: 'React · TypeScript · Tailwind CSS · Vite', note: 'bilingual, RTL-ready' },
  { layer: 'API', tools: 'ASP.NET Core · REST · JWT · FluentValidation', note: 'contracts first' },
  { layer: 'Domain', tools: 'Clean Architecture · DDD · domain events', note: 'where the rules live' },
  { layer: 'Data', tools: 'Entity Framework Core · SQL Server · T-SQL', note: 'schema is design' },
  { layer: 'Ship', tools: 'Azure · GitHub Actions · Docker', note: 'done = deployed' },
  { layer: 'Roots', tools: 'C · C++', note: '42 Common Core' },
];

export function Stack({ t }: { t: Theme }) {
  return (
    <Frame t={t} height={STACK_HEIGHT}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Mono t={t} color={t.text}>The stack, by layer</Mono>
        <Mono t={t}>Screen to metal</Mono>
      </div>

      <div style={{ display: 'flex', marginTop: 30, flex: 1 }}>
        <div style={{ display: 'flex', width: 3, borderRadius: 2, backgroundColor: t.accent, marginRight: 32 }} />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {rows.map((r, i) => (
            <div
              key={r.layer}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                borderTop: i === 0 ? 'none' : `1px solid ${t.line}`,
              }}
            >
              <Mono t={t} size={15} color={t.accent} style={{ width: 150 }}>
                {r.layer}
              </Mono>
              <div style={{ display: 'flex', flex: 1, fontSize: 24, fontWeight: 500 }}>{r.tools}</div>
              <div style={{ display: 'flex', fontFamily: 'Serif', fontStyle: 'italic', fontSize: 24, color: t.muted }}>{r.note}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
