const { nextui } = require("@nextui-org/react")
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [
    nextui({
      // DOC https://tailwindcss.com/docs/customizing-colors
      // DOC https://nextui.org/docs/customization/create-theme
      themes: {
        "sherlock-light": {
          colors: {
            "background": "#FFFFFF",
            "background-negative": "#000000",
            "button": colors.fuchsia['500'],
            "button-border": colors.fuchsia['500'],
            "button-border-hover": colors.fuchsia['500'],
            "button-inside": colors.fuchsia['500'],
            "button-inside-hover": colors.fuchsia['500'],
            "data-table-border": colors.stone['200'],
            "linked-resource-padding": colors.stone['200'],
            "deeppink": "#FF1493",
            "focus": colors.amber['300'],
            "foreground": "#000000",
            "foreground-negative": "#FFFFFF",
            "link": "#14B8A6",
            "link-negative": "#00FFFF",
            "primary": colors.teal,
            "prefixed_uri_prefix": colors.violet['700'],
            "prefixed_uri_local_name": colors.violet['400'],
          }
        }
      }
    })
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': 'Fira Code',
        'serif': 'Alegreya',
        'mono': 'Fira Code',
        'section': 'Jost'
      }
    }
  }
}