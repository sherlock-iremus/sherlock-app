import { extendVariants, Button } from '@heroui/react';

export default extendVariants(Button, {
    variants: {
        border: {
            thin: 'border',
        },
        cursorstyle: {
            default: 'cursor-default'
        }
    },
    defaultVariants: {
        cursorstyle: 'default',
        radius: 'none',
        border: 'thin',
        variant: 'ghost',
        className: 'cursor-default'
    }
})