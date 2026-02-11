import { Button, type ButtonProps } from '@heroui/react';
import { buttonVariants, tv, type VariantProps } from '@heroui/styles';
import { PiBracketsCurlyDuotone } from "react-icons/pi";
import { makeYasguiUri } from 'sherlock-sparql-queries/lib/yasgui'

const yasguiButton = tv({
    extend: buttonVariants,
    base: 'border-link-foreground hover:bg-link-hover transition-all duration-400 ease-in-out',
})

type YasguiButtonVariants = VariantProps<typeof yasguiButton>

interface YasguiButtonProps extends ButtonProps, YasguiButtonVariants {
    sparqlQuery: string
}

export default function ({ sparqlQuery }: YasguiButtonProps) {
    return <Button
        className={yasguiButton()}
        isIconOnly
        size='sm'
        variant='outline'
        onClick={() => window.open(makeYasguiUri(sparqlQuery), '_blank')}
    >
        {({ isHovered }) => <PiBracketsCurlyDuotone className={`w-5 h-5 text-black`} />}
    </Button>
}