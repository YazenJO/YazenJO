import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ReactNode } from 'react';
import satori, { type Font } from 'satori';

import { ActivityPanel, ACTIVITY_HEIGHT } from './components/ActivityPanel';
import { Hero, HERO_HEIGHT } from './components/Hero';
import { Principles, PRINCIPLES_HEIGHT } from './components/Principles';
import { Raha, RAHA_HEIGHT } from './components/Raha';
import { Stack, STACK_HEIGHT } from './components/Stack';
import { Taskalyze, TASKALYZE_HEIGHT } from './components/Taskalyze';
import { fetchActivity } from './data';
import { loadFonts } from './fonts';
import { CURSOR_SENTINEL, themes, W, type Theme } from './theme';

const LOGIN = process.env.PROFILE_LOGIN || 'YazenJO';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '../../assets');

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

async function main() {
  const fonts: Font[] = await loadFonts();
  const activity = await fetchActivity(LOGIN);

  const panels: { name: string; height: number; render: (t: Theme) => ReactNode }[] = [
    { name: 'hero', height: HERO_HEIGHT, render: (t) => <Hero t={t} /> },
    { name: 'raha', height: RAHA_HEIGHT, render: (t) => <Raha t={t} /> },
    { name: 'taskalyze', height: TASKALYZE_HEIGHT, render: (t) => <Taskalyze t={t} /> },
    { name: 'stack', height: STACK_HEIGHT, render: (t) => <Stack t={t} /> },
    { name: 'principles', height: PRINCIPLES_HEIGHT, render: (t) => <Principles t={t} /> },
    { name: 'activity', height: ACTIVITY_HEIGHT, render: (t) => <ActivityPanel t={t} activity={activity} /> },
  ];

  // Without live data, keep whatever activity panel is already committed
  // rather than overwriting real numbers with the placeholder.
  const skip = new Set(activity || process.env.WRITE_PLACEHOLDERS ? [] : ['activity']);

  await mkdir(OUT, { recursive: true });
  for (const panel of panels) {
    if (skip.has(panel.name)) continue;
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
