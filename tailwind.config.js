import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1e3a5f', 50: '#eef3f9', 100: '#d6e1ee', 700: '#1e3a5f', 800: '#172e4b', 900: '#10223a' },
        gold: { DEFAULT: '#b8892b', 50: '#fbf6ea', 100: '#f4e7c4', 500: '#b8892b', 700: '#8a6519' },
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [typography],
};
