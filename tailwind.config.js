/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0A1020',  // deepest - page background
          800: '#0E1628',  // hero gradient anchor
          700: '#141D34',  // card background
          600: '#1B2642',  // card hover / surface elevated
          500: '#2A3657',  // subtle borders
        },
        em: {
          400: '#34D399',  // soft emerald
          500: '#10B981',  // primary accent
          600: '#059669',  // hover
          glow: '#6EE7B7', // neon highlight
        },
        fog: {
          100: '#F4F7FB',  // brightest text
          200: '#D8DFEC',  // body text
          300: '#9FAFC6',  // muted
          400: '#6B7A93',  // very muted
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        emGlow: '0 0 0 1px rgba(16,185,129,0.35), 0 0 24px -4px rgba(16,185,129,0.35)',
        emGlowStrong: '0 0 0 1px rgba(16,185,129,0.6), 0 0 40px -4px rgba(16,185,129,0.5)',
        card: '0 10px 30px -12px rgba(0,0,0,0.6)',
      },
      animation: {
        pulseDot: 'pulseDot 2.2s ease-in-out infinite',
        pulseSlow: 'pulseSlow 3.5s ease-in-out infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        gradientShift: 'gradientShift 12s ease infinite',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.55), 0 0 18px 2px rgba(16,185,129,0.55)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(16,185,129,0), 0 0 28px 6px rgba(16,185,129,0.35)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.55' },
          '50%':      { opacity: '1' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
      backgroundImage: {
        'grid-faint':
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
        'radial-emerald':
          'radial-gradient(60% 60% at 50% 30%, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0) 70%)',
      },
    },
  },
  plugins: [],
};
