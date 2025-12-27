/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'music-box': {
          bg: 'var(--color-bg)',
          'bg-dark': 'var(--color-bg-dark)',
          panel: 'var(--color-panel)',
          'panel-border': 'var(--color-panel-border)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          text: 'var(--color-text)',
          'text-muted': 'var(--color-text-muted)',
          comb: 'var(--color-comb)',
          'comb-glow': 'var(--color-comb-glow)',
          pin: 'var(--color-pin)',
          record: 'var(--color-record)',
        }
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
