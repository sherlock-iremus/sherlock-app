import { nextui } from "@nextui-org/react"
import colors from "tailwindcss/colors"

/** @type {import('tailwindcss').Config} */
export default {
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
            "background_negative": "#000000",
            "button": colors.fuchsia['500'],
            "data_table_border": colors.stone['200'],
            "deeppink": "#FF1493",
            "focus": colors.amber['300'],
            "foreground": "#000000",
            "foreground_negative": "#FFFFFF",
            "link": "#14B8A6",
            "link_negative": "#00FFFF",
            "primary": colors.teal,
            "prefixed_uri_prefix_lightbg": colors.violet['700'],
            "prefixed_uri_local_name_lightbg": colors.violet['400'],
            "prefixed_uri_prefix_darkbg": colors.violet['500'],
            "prefixed_uri_local_name_darkbg": colors.violet['300'],
            "section_bg_gradient_from": colors.stone['950'],
            "section_bg_gradient_to": colors.stone['500'],
            "row_hover": colors.gray[100]
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