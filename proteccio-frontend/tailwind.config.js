/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        display: ['"Sora"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        gray: {
          750: '#2d3748',
          850: '#1a202c',
        },
        // Proteccio design system
        proteccio: {
          bg: '#0B1221',
          panel: '#131B27',
          panel2: '#1A2432',
          line: '#26313F',
          text: '#F3F6F9',
          textDim: '#93A1AF',
          cyan: '#2ED573',
          cyanDim: 'rgba(46,213,115,0.14)',
          amber: '#F0A93F',
          amberDim: 'rgba(240,169,63,0.14)',
          red: '#F1555C',
          redDim: 'rgba(241,85,92,0.14)',
          violet: '#17A863',
          admin: '#4C7EFF',
          adminDim: 'rgba(76,126,255,0.14)',
          adminLine: 'rgba(76,126,255,0.35)',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
