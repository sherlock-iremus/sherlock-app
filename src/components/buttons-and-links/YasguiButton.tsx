import { Link } from '@heroui/react'
import { Tooltip } from '@heroui/tooltip'
import { Button } from '@heroui/react'
import { PiBracketsCurlyDuotone } from "react-icons/pi";
import { makeYasguiUri } from 'sherlock-sparql-queries/lib/yasgui'

interface Props {
    query: string
}

const YasguiButton: React.FC<Props> = ({ query }) => <Tooltip
    className='text-xs'
    content='Ouvrir la requête SPARQL dans Yasgui'
    delay={500}
    color='secondary'
>
    <Button
        as={Link}
        className='border-1 text-lg cursor-default'
        color='primary'
        href={makeYasguiUri(query)}
        isExternal
        isIconOnly
        radius='full'
        size='sm'
        startContent={<PiBracketsCurlyDuotone />}
        variant='ghost'
    />
</Tooltip>

export default YasguiButton