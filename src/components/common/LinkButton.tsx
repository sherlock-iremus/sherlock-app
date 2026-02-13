import { Button, Link, Tooltip } from '@heroui/react'
import { ReactElement } from 'react'

interface Props {
    content: string
    icon: ReactElement
    href: string
}

const LinkButton: React.FC<Props> = ({ content, icon, href }) => <Tooltip
    className='text-xs'
    content={content}
    delay={500}
    color='secondary'
>
    <Button
        as={Link}
        className='border-1 text-lg cursor-default'
        color='primary'
        href={href}
        isExternal
        isIconOnly
        radius='full'
        size='sm'
        startContent={icon}
        variant='ghost'
    />
</Tooltip>

export default LinkButton