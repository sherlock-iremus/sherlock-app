import { Button } from '@heroui/react';
import { tv } from 'tailwind-variants';

const x = tv({
    base: "",
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
});

export default function (props: any) {
    return <Button className={x()} {...props} />
};