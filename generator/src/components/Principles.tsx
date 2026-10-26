import type { Theme } from '../theme';
import { Frame, Mono } from './primitives';

export const PRINCIPLES_HEIGHT = 340;

const items = [
  { title: 'Own the outcome.', body: 'Not the ticket, not the layer. If it ships with my name on it, all of it is mine.' },
  { title: 'Architecture is a product decision.', body: 'The boundaries I draw today decide what we can ship next month.' },
  { title: 'Deployed or it didn’t happen.', body: 'Done means running in production, not working on my machine.' },
];

export function Principles({ t }: { t: Theme }) {
  return (
    <Frame t={t} height={PRINCIPLES_HEIGHT}>
      <Mono t={t} color={t.text}>How I operate</Mono>
      <div style={{ display: 'flex', gap: 40, marginTop: 'auto' }}>
        {items.map((it, i) => (
          <div key={it.title} style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 14, paddingTop: 22, borderTop: `1px solid ${t.line}` }}>
            <Mono t={t} size={14} color={t.accent}>{`0${i + 1}`}</Mono>
            <div style={{ display: 'flex', fontSize: 27, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.2 }}>{it.title}</div>
            <div style={{ display: 'flex', fontSize: 19, lineHeight: 1.5, color: t.muted }}>{it.body}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
