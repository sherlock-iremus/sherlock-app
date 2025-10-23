import { extendVariants, Link } from '@heroui/react';

export default extendVariants(Link, {
    variants: {
        color: {
            x: 'text-link hover:text-link_hover'
        },
        cursor: {
            x: 'cursor-default'
        },

        font: {
            x: 'font-mono'
        },
        tracking: {
            x: 'tracking-tighter'
        },
        'transition-colors': {
            x: 'transition-colors'
        }
    },
    defaultVariants: {
        color: 'x',
        cursor: 'x',
        font: 'x',
        tracking: 'x',
        'transition-colors': 'x'
    }
})