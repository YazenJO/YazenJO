import type { Theme } from '../theme';
import { Arrow, Frame, Header, Mono } from './primitives';

export const TASKALYZE_HEIGHT = 710;

const flow = ['Post a task', 'Timed attempt', 'Scored result', 'Recruiter review', 'Offer'];

const myPart = [
  {
    title: 'Faster vector search calls',
    body: 'Refactored the Qdrant integration onto IHttpClientFactory: pooled connections instead of a client per request.',
  },
  {
    title: 'Shipped under the clock',
    body: 'Delivered a working full-stack platform in C# and ASP.NET Core within hackathon limits. It now runs in production.',
  },
];

export function Taskalyze({ t }: { t: Theme }) {
  return (
    <Frame t={t} height={TASKALYZE_HEIGHT}>
      <Header t={t} index="02" kicker="Competition" pills={[{ text: '1st place · MZN', solid: true }, { text: 'Live' }, { text: 'Team build' }]} />

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 34 }}>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1 }}>Taskalyze</div>
        <Mono t={t} size={16}>Hiring by proof of work</Mono>
      </div>

      <div style={{ display: 'flex', marginTop: 18, fontSize: 25, lineHeight: 1.45, color: t.muted, maxWidth: 1000 }}>
        CVs describe work. Taskalyze asks for it. Companies and universities publish a real task with a time limit, candidates deliver, and offers go to the people whose results hold up.
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', marginTop: 36 }}>
        {flow.map((step, i) => (
          <div key={step} style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: 6,
                padding: '14px 16px',
                borderRadius: 12,
                backgroundColor: t.surface,
                border: `1px solid ${i === flow.length - 1 ? t.accent : t.line}`,
              }}
            >
              <Mono t={t} size={14} color={t.faint}>{`0${i + 1}`}</Mono>
              <div style={{ display: 'flex', fontSize: 18, fontWeight: 500 }}>{step}</div>
            </div>
            {i < flow.length - 1 && <Arrow t={t} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', marginTop: 34, paddingTop: 24, borderTop: `1px solid ${t.line}` }}>
        <Mono t={t} size={14} color={t.accent} style={{ width: 150, paddingTop: 4 }}>
          My part
        </Mono>
        <div style={{ display: 'flex', flex: 1, gap: 40 }}>
          {myPart.map((p) => (
            <div key={p.title} style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
              <div style={{ display: 'flex', fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>{p.title}</div>
              <div style={{ display: 'flex', fontSize: 18, lineHeight: 1.5, color: t.muted }}>{p.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: 'auto', fontFamily: 'Mono', fontSize: 16, color: t.muted, letterSpacing: 0.5 }}>
        ASP.NET Core · EF Core · SQL Server · Qdrant · JWT · Cloudinary / Azure Blob
      </div>
    </Frame>
  );
}
