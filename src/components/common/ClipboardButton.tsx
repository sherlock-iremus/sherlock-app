import { Button, type ButtonProps } from '@heroui/react';
import { buttonVariants, tv, type VariantProps } from '@heroui/styles';
import { PiClipboardThin } from "react-icons/pi";

const clipboardButton = tv({
    extend: buttonVariants,
    base: 'border-link-foreground hover:bg-link-hover transition-all duration-400 ease-in-out',
})

type ClipboardButtonVariants = VariantProps<typeof clipboardButton>

interface ClipboardButtonProps extends ButtonProps, ClipboardButtonVariants {
    content: string
}

export default function ({ content }: ClipboardButtonProps) {
    return <Button
        className={clipboardButton()}
        isIconOnly
        size='sm'
        variant='outline'
        onClick={() => navigator.clipboard.writeText(content)}
    >
        {({ isHovered }) => <PiClipboardThin className={`w-5 h-5 text-link-foreground`} />}
    </Button>
}