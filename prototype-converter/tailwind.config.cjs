/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,vue,json}',
    './**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        'source-code': ['SourceCode','ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss')
  ],
}
