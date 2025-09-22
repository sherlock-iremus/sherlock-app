import { Link } from '@heroui/react'
import { Tooltip } from '@heroui/tooltip'
import { Button } from '@heroui/react'
import { TbHexagonLetterY } from 'react-icons/tb'
import { makeYasguiUri } from 'sherlock-sparql-queries/lib/yasgui'

interface Props {
    query: string
}

const YasguiButton: React.FC<Props> = ({ query }) => <Tooltip className='text-xs' content='Ouvrir la requête SPARQL dans Yasgui' delay={500} color='secondary'>
    <Button
        as={Link}
        // className='flex bg-black hover:bg-teal-950 border-1 hover:border-cyan-300 border-teal-900 rounded-full w-8 h-8 text-teal-500 hover:text-teal-300 transition-all'
        className='border-1 text-lg'
        color='primary'
        href={makeYasguiUri(query)}
        isExternal
        isIconOnly
        radius='full'
        size='sm'
        startContent={<TbHexagonLetterY />}
        variant='ghost'
    />
</Tooltip>

export default YasguiButton