import { tv } from "tailwind-variants";

export type textSizes = 'xs' | 'sm' | 'base' | undefined

export const linkStyles = tv({
    base: "no-underline text-xs transition-colors text-link-foreground hover:text-link-hover-foreground",
    variants: {
        fontWeight: {
            light: 'font-light',
            normal: 'font-normal',
            medium: 'font-medium',
        },
        letterSpacing: {
            normal: 'tracking-normal',
            tight: 'tracking-tight',
            tighter: 'tracking-tighter',
        },
        textSize: {
            xs: "text-xs",
            sm: "text-sm",
            base: "text-base",
        },
    }
});