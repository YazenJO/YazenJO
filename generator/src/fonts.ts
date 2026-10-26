import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import type { Font } from 'satori';

const require = createRequire(import.meta.url);

// Satori reads TTF/OTF/WOFF, not WOFF2.
const file = (pkg: string, name: string) => readFile(require.resolve(`@fontsource/${pkg}/files/${name}`));

export async function loadFonts(): Promise<Font[]> {
  const [i400, i500, i600, i700, m400, m500, serif] = await Promise.all([
    file('inter', 'inter-latin-400-normal.woff'),
    file('inter', 'inter-latin-500-normal.woff'),
    file('inter', 'inter-latin-600-normal.woff'),
    file('inter', 'inter-latin-700-normal.woff'),
    file('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'),
    file('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'),
    file('instrument-serif', 'instrument-serif-latin-400-italic.woff'),
  ]);

  return [
    { name: 'Inter', data: i400, weight: 400, style: 'normal' },
    { name: 'Inter', data: i500, weight: 500, style: 'normal' },
    { name: 'Inter', data: i600, weight: 600, style: 'normal' },
    { name: 'Inter', data: i700, weight: 700, style: 'normal' },
    { name: 'Mono', data: m400, weight: 400, style: 'normal' },
    { name: 'Mono', data: m500, weight: 500, style: 'normal' },
    { name: 'Serif', data: serif, weight: 400, style: 'italic' },
  ];
}
