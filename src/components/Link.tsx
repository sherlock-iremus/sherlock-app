import { extendVariants, Link } from '@heroui/react';

export default extendVariants(Link, {
    defaultVariants: {
        class: 'text-link cursor-default hover:text-link_hover transition-colors'
    }
})