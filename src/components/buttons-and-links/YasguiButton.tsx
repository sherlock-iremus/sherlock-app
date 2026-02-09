import { Button } from '@heroui/react'
import { PiBracketsCurlyDuotone } from "react-icons/pi";
import { makeYasguiUri } from 'sherlock-sparql-queries/lib/yasgui'

interface Props {
    query: string
}

const YasguiButton: React.FC<Props> = ({ query }) => <Button
    className='p-1 border rounded-full cursor-default'
    isIconOnly
    onClick={() => window.open(makeYasguiUri(query), '_blank')}
    variant='ghost'
>
    <PiBracketsCurlyDuotone />
</Button>

export default YasguiButton