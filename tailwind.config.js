/**
 * Palette is sampled straight out of the brand mark (public/logo.png):
 * the swirl runs saffron #FFA000 → orange #EF7702 → vermilion #C02907 → maroon #AA0009.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: '#FFA000',
        amber: '#F78B01',
        orange: '#EF7702',
        ember: '#E1591A',
        vermilion: '#C02907',
        crimson: '#B10D08',
        maroon: '#AA0009',

        shell: '#FDF8F1',
        linen: '#F8F0E4',
        sand: '#EFE3D2',
        ink: '#241309',
        'ink-soft': '#6B564A',
        muted: '#9A8878',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        swirl: 'linear-gradient(135deg, #FFA000 0%, #EF7702 38%, #C02907 74%, #AA0009 100%)',
        'swirl-soft': 'linear-gradient(120deg, #FFA000 0%, #EF7702 45%, #C02907 100%)',
      },
      boxShadow: {
        frame: '0 30px 70px -30px rgba(36, 19, 9, 0.45)',
        lift: '0 40px 90px -40px rgba(170, 0, 9, 0.55)',
        inset: 'inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      screens: {
        xs: '480px',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -14px, 0) scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        drift: 'drift 9s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
}
