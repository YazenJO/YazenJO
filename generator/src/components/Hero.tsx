import { CURSOR_SENTINEL, type Theme } from '../theme';
import { Frame, Mono } from './primitives';

export const HERO_HEIGHT = 500;

function Fact({ t, label, value, cursor = false }: { t: Theme; label: string; value: string; cursor?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, paddingTop: 22, borderTop: `1px solid ${t.line}` }}>
      <Mono t={t} size={14} color={t.faint}>
        {label}
      </Mono>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 500, color: t.text }}>
        {value}
        {cursor && <div style={{ display: 'flex', width: 11, height: 24, marginLeft: 8, backgroundColor: CURSOR_SENTINEL }} />}
      </div>
    </div>
  );
}

export function Hero({ t }: { t: Theme }) {
  return (
    <Frame t={t} height={HERO_HEIGHT} grid>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Mono t={t} color={t.text}>Yazen AbuSharkh</Mono>
        <Mono t={t}>Full-stack engineer · @YazenJO</Mono>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 54 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 96, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>
          I build the
          <span style={{ fontFamily: 'Serif', fontStyle: 'italic', fontWeight: 400, color: t.accent, letterSpacing: -2, margin: '0 22px 0 24px', fontSize: 108 }}>
            whole
          </span>
          thing.
        </div>
        <div style={{ display: 'flex', marginTop: 26, fontSize: 26, lineHeight: 1.45, color: t.muted, maxWidth: 900 }}>
          Domain model, API, interface, deployment. I take a product from an empty repository to production, and I own every layer on the way.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 40, marginTop: 'auto' }}>
        <Fact t={t} label="Stack" value=".NET · React · SQL Server" />
        <Fact t={t} label="Mode" value="Product systems, end to end" />
        <Fact t={t} label="Now" value="Shipping RAHA" cursor />
      </div>
    </Frame>
  );
}
