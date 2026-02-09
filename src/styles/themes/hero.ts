import { heroui, ThemeColors } from '@heroui/react'
import colors from 'tailwindcss/colors'
import { parse, formatHex } from 'culori'

interface MyThemeColors extends ThemeColors {
    data_table_border: string,
    data_table_line: string,
    data_table_parenthesis: string,
    external_uri: string;
    lang: string,
    link: string,
    link_hover: string,
    row_hover: string,
    texte_annexe: string,
    uri_prefix: string,
    uri_column: string,
    uri_localpart: string,
}

function c(x: string) {
    return formatHex(parse(x))
}

const lightThemeColors: Partial<MyThemeColors> = {
    background: "#FFFFFF",
    foreground: "#000000",
    primary: {
        DEFAULT: '#14B8A6',
        foreground: 'black',
    },
    secondary: {
        DEFAULT: '#14B8A6',
        foreground: 'black',
    },
    row_hover: c(colors.gray[100]),
    external_uri: c(colors.pink[600]),
    texte_annexe: c(colors.gray[400]),
    data_table_border: c(colors.gray[200]),
    data_table_line: c(colors.gray[100]),
    data_table_parenthesis: c(colors.gray[400]),
    lang: c(colors.gray[400]),
    uri_prefix: '#6D29D9',
    uri_column: '#6D29D9',
    uri_localpart: '#A68BFA',
}

const darkThemeColors: Partial<MyThemeColors> = {
    background: "#000000",
    foreground: "#FFFFFF",
    primary: {
        DEFAULT: 'aqua',
        foreground: 'black',
    },
    secondary: {
        DEFAULT: '#14B8A6',
        foreground: '#14B8A6',
    },
    row_hover: c(colors.gray[100]),
    external_uri: c(colors.pink[600]),
    texte_annexe: c(colors.gray[400]),
    data_table_border: c(colors.gray[200]),
    data_table_line: c(colors.gray[100]),
    data_table_parenthesis: c(colors.gray[400]),
    // link: c(colors.violet[600]),
    lang: c(colors.gray[400]),
    link: '#14B8A6',
    link_hover: '#FF1493',
    uri_prefix: '#6D29D9',
    uri_column: '#6D29D9',
    uri_localpart: '#A68BFA',
}

/** @type {import('tailwindcss').Config} */
export default heroui({
    prefix: "heroui",
    defaultTheme: "light",
    themes: {
        light: {
            extend: 'light',
            colors: lightThemeColors,
        },
        dark: {
            extend: 'dark',
            colors: darkThemeColors
        }
    }
})