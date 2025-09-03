import { heroui } from '@heroui/react'
import colors from 'tailwindcss/colors'
import { parse, formatHex } from 'culori'

function c(x: string) {
    return formatHex(parse(x))
}

/** @type {import('tailwindcss').Config} */
export default heroui({
    prefix: "heroui",
    defaultTheme: "light",
    themes: {
        light: {
            extend: 'light',
            colors: {
                background: "#FFFFFF",
                foreground: "#000000",
                primary: {
                    // DEFAULT: '#14B8A6',
                    DEFAULT: 'aqua',
                    foreground: 'black',
                },
                data_table_border: c(colors.gray[300]),
                data_table_parenthesis: c(colors.gray[400]),
                link: c(colors.cyan[600]),
                link_hover: c(colors.cyan[400]),
                uri_prefix: c(colors.pink[700]),
                uri_column: c(colors.pink[400]),
                uri_localpart: c(colors.pink[600]),
            },
        },
        dark: {
            extend: 'dark',
            colors: {
                background: "#000000",
                foreground: "#FFFFFF",
                primary: {
                    // DEFAULT: '#14B8A6',
                    DEFAULT: 'aqua',
                    foreground: 'aqua',
                },
                data_table_border: c(colors.gray[300]),
                data_table_parenthesis: c(colors.gray[400]),
                link: c(colors.violet[600]),
                link_hover: c(colors.cyan[300]),
                uri_prefix: c(colors.pink[700]),
                uri_column: c(colors.pink[400]),
                uri_localpart: c(colors.pink[600]),
            }
        }
    }
})