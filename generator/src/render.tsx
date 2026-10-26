import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ReactNode } from 'react';
import satori, { type Font } from 'satori';

import { ActivityPanel, ACTIVITY_HEIGHT } from './components/ActivityPanel';
import { Footprint, FOOTPRINT_HEIGHT } from './components/Footprint';
import { Hero, HERO_HEIGHT } from './components/Hero';
import { Principles, PRINCIPLES_HEIGHT } from './components/Principles';
import { Raha, RAHA_HEIGHT } from './components/Raha';
import { Frame, Mono } from './components/primitives';
import { Stack, STACK_HEIGHT } from './components/Stack';
import { Taskalyze, TASKALYZE_HEIGHT } from './components/Taskalyze';
import { fetchStats } from './data';
import { loadFonts } from './fonts';
import { summarize, type Stats } from './stats';
import { CURSOR_SENTINEL, themes, W, type Theme } from './theme';

const LOGIN = process.env.PROFILE_LOGIN || 'YazenJO';
const ASSETS = join(dirname(fileURLToPath(import.meta.url)), '../../assets');
const OUT = process.env.OUT_DIR || ASSETS;

// Satori has no class names or animations, so the blinking cursor is drawn
// with a sentinel color and turned into a CSS animation here. GitHub shows
// SVGs through <img>, where CSS animations run but scripts never do.
function animateCursor(svg: string, t: Theme) {
  if (!svg.includes(`fill="${CURSOR_SENTINEL}"`)) return svg;
  const style =
    '<style>@keyframes blink{50%{opacity:0}}.cursor{animation:blink 1.1s steps(1) infinite}' +
    '@media (prefers-reduced-motion:reduce){.cursor{animation:none}}</style>';
  return svg
    .replace(`fill="${CURSOR_SENTINEL}"`, `fill="${t.accent}" class="cursor"`)
    .replace(/<svg([^>]*)>/, `<svg$1>${style}`);
}

// Shown only when a stats panel is rendered without data on purpose.
function Pending({ t, title, height }: { t: Theme; title: string; height: number }) {
  return (
    <Frame t={t} height={height}>
      <Mono t={t} color={t.text}>{title}</Mono>
      <div style={{ display: 'flex', margin: 'auto 0', fontSize: 22, color: t.muted }}>Live data renders on the next scheduled build.</div>
    </Frame>
  );
}

type Panel = { name: string; height: number; render: (t: Theme) => ReactNode };

function statsPanels(stats: Stats | null): Panel[] {
  const panel = (name: string, title: string, height: number, body: (t: Theme, s: Stats) => ReactNode): Panel => ({
    name,
    height,
    render: (t) => (stats ? body(t, stats) : <Pending t={t} title={title} height={height} />),
  });
  return [
    panel('activity', 'Shipping log · last 12 months', ACTIVITY_HEIGHT, (t, s) => <ActivityPanel t={t} stats={s} />),
    panel('footprint', 'Languages · rhythm · reach', FOOTPRINT_HEIGHT, (t, s) => <Footprint t={t} stats={s} />),
  ];
}

async function main() {
  if (process.env.STATS_FIXTURE && OUT === ASSETS) {
    throw new Error('STATS_FIXTURE is for local previews; set OUT_DIR so fixture numbers never land in assets/');
  }

  const fonts: Font[] = await loadFonts();
  const raw = await fetchStats(LOGIN);
  const stats = raw ? summarize(raw) : null;

  const panels: Panel[] = [
    { name: 'hero', height: HERO_HEIGHT, render: (t) => <Hero t={t} /> },
    { name: 'raha', height: RAHA_HEIGHT, render: (t) => <Raha t={t} /> },
    { name: 'taskalyze', height: TASKALYZE_HEIGHT, render: (t) => <Taskalyze t={t} /> },
    { name: 'stack', height: STACK_HEIGHT, render: (t) => <Stack t={t} /> },
    { name: 'principles', height: PRINCIPLES_HEIGHT, render: (t) => <Principles t={t} /> },
    // Without live data, keep the stats panels already committed rather
    // than overwriting real numbers with a placeholder.
    ...(stats || process.env.WRITE_PLACEHOLDERS ? statsPanels(stats) : []),
  ];

  await mkdir(OUT, { recursive: true });
  for (const panel of panels) {
    for (const t of themes) {
      const svg = await satori(panel.render(t), { width: W, height: panel.height, fonts });
      const file = join(OUT, `${panel.name}-${t.name}.svg`);
      await writeFile(file, animateCursor(svg, t));
      console.log(`wrote ${file}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
