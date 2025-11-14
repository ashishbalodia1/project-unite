/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-900': '#0b0f19',
        'neon-cyan': '#00ffff',
        'electric-purple': '#8a2be2',
      },
      boxShadow: {
        'neon-glow': '0 6px 30px rgba(0,255,255,0.08), 0 0 18px rgba(138,43,226,0.06)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(.2,.9,.26,1)',
      },
      backdropBlur: {
        'md-plus': '8px',
      }
    },
  },
  plugins: [],
};
