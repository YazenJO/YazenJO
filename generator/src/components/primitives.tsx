import type { CSSProperties, ReactNode } from 'react';
import type { Theme } from '../theme';

// Satori lays everything out with flexbox: any element with more than one
// child must be display:flex, so these helpers make that the default.

export function Frame({ t, height, children, grid = false }: { t: Theme; height: number; children: ReactNode; grid?: boolean }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: t.bg,
        backgroundImage: grid
          ? `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`
          : undefined,
        backgroundSize: grid ? '40px 40px' : undefined,
        border: `1px solid ${t.line}`,
        borderRadius: 20,
        padding: '44px 56px',
        fontFamily: 'Inter',
        color: t.text,
      }}
    >
      {children}
    </div>
  );
}

export function Mono({ t, children, color, size = 16, style }: { t: Theme; children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', fontFamily: 'Mono', fontSize: size, letterSpacing: 1.5, textTransform: 'uppercase', color: color ?? t.muted, ...style }}>
      {children}
    </div>
  );
}

export function Pill({ t, children, solid = false }: { t: Theme; children: ReactNode; solid?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '7px 14px',
        borderRadius: 999,
        border: `1px solid ${solid ? t.accent : t.line}`,
        backgroundColor: solid ? t.accent : 'transparent',
        color: solid ? t.accentInk : t.muted,
        fontFamily: 'Mono',
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}

export function Header({ t, index, kicker, pills }: { t: Theme; index: string; kicker: string; pills: { text: string; solid?: boolean }[] }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Mono t={t} color={t.accent}>{index}</Mono>
        <div style={{ display: 'flex', width: 28, height: 1, backgroundColor: t.line }} />
        <Mono t={t}>{kicker}</Mono>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {pills.map((p) => (
          <Pill key={p.text} t={t} solid={p.solid}>
            {p.text}
          </Pill>
        ))}
      </div>
    </div>
  );
}

// The font subsets have no arrow glyphs, so arrows are drawn as SVG.
export function Arrow({ t }: { t: Theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
      <svg width="20" height="12" viewBox="0 0 20 12">
        <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke={t.faint} strokeWidth="1.5" />
      </svg>
    </div>
  );
}
