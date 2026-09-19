/** @type {import('tailwindcss').Config} */

// Colors are CSS custom properties (space-separated RGB triplets) defined in
// index.css, one block per palette. The whole site re-themes by flipping a
// single data-theme attribute on <html>.
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: v('--c-canvas'),
        surface: v('--c-surface'),
        surfaceAlt: v('--c-surface-alt'),
        line: v('--c-line'),
        ink: v('--c-ink'),
        inkSoft: v('--c-ink-soft'),
        inkMute: v('--c-ink-mute'),
        accent: v('--c-accent'),
        accentSoft: v('--c-accent-soft'),
        accentInk: v('--c-accent-ink'),
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { prose: '68ch' },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.12)',
        lift: '0 2px 4px rgb(0 0 0 / 0.06), 0 16px 40px -16px rgb(0 0 0 / 0.18)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // Long, offset cycles so the three gradients never sync up.
        drift1: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%':      { transform: 'translate3d(6vw,4vh,0) scale(1.12)' },
          '66%':      { transform: 'translate3d(2vw,9vh,0) scale(0.95)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '40%':      { transform: 'translate3d(-7vw,6vh,0) scale(1.15)' },
          '75%':      { transform: 'translate3d(-3vw,-5vh,0) scale(0.92)' },
        },
        drift3: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%':      { transform: 'translate3d(5vw,-8vh,0) scale(1.1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both',
        drift1: 'drift1 34s ease-in-out infinite',
        drift2: 'drift2 42s ease-in-out infinite',
        drift3: 'drift3 28s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
