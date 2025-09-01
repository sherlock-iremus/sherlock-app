import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
export default heroui({
    prefix: "heroui",
    defaultTheme: "light",
    themes: {
        light: {
            // extend: 'light',
            colors: {
                background: "#FFFFFF",
                foreground: "#000000",
                primary: {
                    // DEFAULT: '#14B8A6',
                    DEFAULT: 'aqua',
                    foreground: 'black',
                },
                sloubi: 'aqua'
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
                sloubi: 'aqua'
            }
        }
    }
})