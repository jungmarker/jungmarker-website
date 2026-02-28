/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutrals — architectural warm palette
        'warm-white': '#faf7f2',
        'stone':      '#f0ece4',
        'concrete':   '#e4dfd6',
        'ash':        '#716b62',
        'charcoal':   '#1c1917',

        // Brand
        'gold':       '#c9a84c',
        'md-red':     '#b31942',   // Maryland flag red — primary CTA
        'navy':       '#0f1b2d',   // deep sections
        'brick':      '#7a2e1a',   // Baltimore rowhouse brick

        // Legacy aliases (used in data/listings sections)
        'cream':      '#faf7f2',
        'slate':      '#8494a7',
        'marble':     '#e8e4dc',
      },
      fontFamily: {
        grotesk: ['"Outfit"', 'system-ui', 'sans-serif'],
        sans:    ['"Outfit"', 'system-ui', 'sans-serif'],
        body:    ['"Inter"',  'system-ui', 'sans-serif'],
        serif:   ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'display': '-.02em',
        'wide':    '.12em',
        'widest':  '.22em',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
