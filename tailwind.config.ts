import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './context/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        'paper-dim': 'rgb(var(--color-paper-dim) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        saffron: 'rgb(var(--color-saffron) / <alpha-value>)',
        teal: 'rgb(var(--color-teal) / <alpha-value>)',
        brick: 'rgb(var(--color-brick) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: [
          'var(--font-body)',
          'var(--font-tamil)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      maxWidth: {
        wire: '72rem',
        read: '42rem',
      },
    },
  },
  plugins: [],
};

export default config;
