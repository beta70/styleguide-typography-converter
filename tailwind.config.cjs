/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,vue,json}',
    './**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        'source-code': ['SourceCode','ui-sans-serif', 'system-ui'],
        'noto': ['NotoSans','ui-sans-serif', 'system-ui']
      },
      colors: {
        'black-blue': '#08090C',
        'darker-blue': '#12141C',
        'dark-blue': '#171923',
        'papaya': '#FDF0D5',
        'pink': '#D81E5B',
        'blue': '#197278',
        'purple': '#8E7DBE',
        'light-blue': '#89DDFF',
        'light-violet': '#8E8DBE',
        'light-lime': '#96F550',
        'light-green': '#C3E88D',
        'light-red': '#F07178',
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