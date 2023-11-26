/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,vue,json}',
    './**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        'martian': ['MartianMono','ui-sans-serif', 'system-ui'],
      },
      colors: {
        'black-blue': '#08090C',
        'darker-blue': '#12141C',
        'dark-blue': '#171923',
        'papaya': '#FDF0D5',
        'ttt-murrey': '#87255B',
        'ttt-violet': '#B370B0',
        'ttt-lilac': '#BBA0CA',
        'ttt-thistle': '#D1C8E1',
        'ttt-perlwinkle': '#C3C3E6',
        'ttt-gray': '#95A3B3',
      },
      maxWidth: {
        '8xl': '1536px',
        '9xl': '1792px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss')
  ],
}