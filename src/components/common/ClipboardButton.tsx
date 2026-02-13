import { Button, Tooltip } from '@heroui/react'
import { PiClipboardThin } from "react-icons/pi";

interface Props {
    content: string
}

const ClipboardButton: React.FC<Props> = ({ content }) => <Tooltip
    className='text-xs'
    content="Copier l'URI dans le presse-papier"
    delay={500}
    color='primary'
>
    <Button
        className='border-1 text-lg cursor-default'
        color='primary'
        isIconOnly
        radius='full'
        size='sm'
        startContent={<PiClipboardThin />}
        variant='ghost'
        onClick={() => navigator.clipboard.writeText(content)}
    />
</Tooltip>

export default ClipboardButton