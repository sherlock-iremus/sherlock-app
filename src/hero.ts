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
                    DEFAULT: '#14B8A6',
                    foreground: 'black',
                },
                data_table_border: c(colors.gray[200]),
                data_table_line: c(colors.gray[100]),
                data_table_parenthesis: c(colors.gray[400]),
                // link: c(colors.cyan[600]),
                link: '#14B8A6',
                link_hover: '#FF1493',
                // link_hover: c(colors.cyan[400]),
                uri_prefix: '#6D29D9',
                uri_column: '#6D29D9',
                uri_localpart: '#A68BFA',
            },
        },
        dark: {
            extend: 'dark',
            colors: {
                background: "#000000",
                foreground: "#FFFFFF",
                primary: {
                    DEFAULT: 'aqua',
                    foreground: 'aqua',
                },
                data_table_border: c(colors.gray[200]),
                data_table_line: c(colors.gray[100]),
                data_table_parenthesis: c(colors.gray[400]),
                // link: c(colors.violet[600]),
                link: '#14B8A6',
                link_hover: '#FF1493',
                // link_hover: c(colors.cyan[300]),
                uri_prefix: '#6D29D9',
                uri_column: '#6D29D9',
                uri_localpart: '#A68BFA',
            }
        }
    }
})