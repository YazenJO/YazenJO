// Every panel is rendered twice: once per GitHub color scheme.
// The README picks the right one with <picture> + prefers-color-scheme.

export type Theme = {
  name: 'dark' | 'light';
  bg: string;
  surface: string;
  line: string;
  grid: string;
  text: string;
  muted: string;
  faint: string;
  accent: string;
  accentInk: string; // text drawn on top of the accent color
  heat: [string, string, string, string, string];
  bar: string; // neutral bars in charts; the accent marks the highlight
  ramp: string[]; // language segments, strongest first; the last one is "Other"
};

export const dark: Theme = {
  name: 'dark',
  bg: '#0B0B0C',
  surface: '#121214',
  line: '#26262B',
  grid: 'rgba(255,255,255,0.035)',
  text: '#EDEDEF',
  muted: '#9A9AA3',
  faint: '#74747E',
  accent: '#C5F82A',
  accentInk: '#0B0B0C',
  heat: ['#18181B', '#2E3B0E', '#506B12', '#86B51C', '#C5F82A'],
  bar: '#3A3A42',
  ramp: ['#C5F82A', '#EDEDEF', '#9A9AA3', '#74747E', '#55555E', '#33333A'],
};

export const light: Theme = {
  name: 'light',
  bg: '#FAFAF7',
  surface: '#F2F2EE',
  line: '#E2E2DC',
  grid: 'rgba(0,0,0,0.035)',
  text: '#0B0B0C',
  muted: '#5E5E66',
  faint: '#83838B',
  accent: '#4D7C0F',
  accentInk: '#FAFAF7',
  heat: ['#EDEDE8', '#D3E8A6', '#A8CF5A', '#6FA01F', '#4D7C0F'],
  bar: '#D4D4CE',
  ramp: ['#4D7C0F', '#0B0B0C', '#5E5E66', '#83838B', '#ADADB3', '#D4D4CE'],
};

export const themes = [dark, light];

export const W = 1200; // render width; GitHub scales the SVG down to the column

// Sentinel fill for elements that get a CSS animation after rendering.
// Satori can't emit classes, so render.tsx swaps this color for a class.
export const CURSOR_SENTINEL = '#010203';
