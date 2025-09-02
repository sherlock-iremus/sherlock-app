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
            link: {
                default: {
                    color: "text-red-600",
                    hover: {
                        color: "text-red-800", // hover color
                    },
                },
            },
            // extend: 'light',
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
                uri_prefix: c(colors.purple[300]),
                uri_column: c(colors.purple[400]),
                uri_localpart: c(colors.purple[500]),
            }
        },
        dark: {
            // extend: 'dark',
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
                uri_prefix: 'orange',
                uri_column: 'red',
                uri_localpart: 'green',
            }
        }
    }
})