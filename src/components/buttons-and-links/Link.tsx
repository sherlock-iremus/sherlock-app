import { Link as HeroLink, type LinkProps } from '@heroui/react';
import { linkVariants, tv, type VariantProps } from '@heroui/styles';

const customLinkVariants = tv({
    extend: linkVariants,
    base: 'text-link hover:text-link_hover no-underline',
});

type CustomLinkVariants = VariantProps<typeof customLinkVariants>;

interface CustomLinkProps extends Omit<LinkProps, 'className'>, CustomLinkVariants { className?: string }

export default function ({ className, ...props }: CustomLinkProps) {
    return <HeroLink
        className={customLinkVariants({ className }).base()}
        {...props}
    />
}

// const x = tv({
//     base: "",
//     variants: {
//         color: {
//             x: 'text-link hover:text-link_hover'
//         },
//         cursor: {
//             x: 'cursor-default'
//         },

//         font: {
//             x: 'font-mono'
//         },
//         tracking: {
//             x: 'tracking-tighter'
//         },
//         'transition-colors': {
//             x: 'transition-colors'
//         }
//     },
//     defaultVariants: {
//         color: 'x',
//         cursor: 'x',
//         font: 'x',
//         tracking: 'x',
//         'transition-colors': 'x'
//     }
// });

// export default function (props: any) {
//     return <Link className={x()} {...props} />
// };