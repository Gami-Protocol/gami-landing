import type { Config } from 'tailwindcss';

/** ARCADE Cyber-Brutalist tokens, exposed to Tailwind through the CSS variables in src/styles/tokens.css. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gami: {
          bg: 'var(--bg)',
          black: 'var(--bg-black)',
          band: 'var(--bg-band)',
          fg: 'var(--fg)',
          secondary: 'var(--fg-secondary)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          faint: 'var(--fg-faint)',
          purple: 'var(--primary)',
          'purple-deep': 'var(--primary-deep)',
          accent: 'var(--accent)',
          pink: 'var(--secondary)',
          highlight: 'var(--highlight)',
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--danger)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Avenir Next"', '"Segoe UI"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        brutal: 'var(--shadow)',
        'brutal-purple': 'var(--shadow-purple)',
        'brutal-white': 'var(--shadow-white)',
        'brutal-sm': 'var(--shadow-sm)',
        glow: '0 0 20px var(--glow)',
      },
      borderWidth: { neo: '3px', band: '4px' },
      borderRadius: { none: '0px' },
    },
  },
  plugins: [],
} satisfies Config;
