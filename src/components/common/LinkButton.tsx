import { Button, type ButtonProps } from '@heroui/react';
import { buttonVariants, tv, type VariantProps } from '@heroui/styles';

const linkButton = tv({
    extend: buttonVariants,
    base: 'border-link-foreground hover:bg-link-hover transition-all duration-400 ease-in-out',
})


type LinkButtonVariants = VariantProps<typeof linkButton>

interface LinkButtonProps extends ButtonProps, LinkButtonVariants {
    link: string,
    Icon: React.ComponentType<{ className: string }>
}

export default function ({ link, Icon }: LinkButtonProps) {
    return <Button
        className={linkButton()}
        isIconOnly
        size='sm'
        variant='outline'
        onClick={() => window.open(link, '_blank')}
    >
        <Icon className='w-5 h-5 text-link-foreground' />
    </Button>
}