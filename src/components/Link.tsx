import { extendVariants, Link } from '@heroui/react';

export default extendVariants(Link, {
    defaultVariants: {
        class: 'text-link font-mono cursor-default hover:text-link_hover transition-colors tracking-tighter'
    }
})