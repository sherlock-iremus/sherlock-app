import { Link, type LinkProps } from '@heroui/react';
import { linkVariants, tv, type VariantProps } from '@heroui/styles';

const sherlockLinkVariants = tv({
    extend: linkVariants,
    base: 'text-red-500',
})

type SherlockLinkVariants = VariantProps<typeof sherlockLinkVariants>

interface SherlockLinkProps extends LinkProps, SherlockLinkVariants { }

export default function ({ ...props }: SherlockLinkProps) {
    return <Link {...props} className={sherlockLinkVariants()} />
}