import { Link } from '@heroui/link'
import Button from './Button'
import { ReactNode } from 'react'
import { makeYasguiUri } from 'sherlock-sparql-queries/lib/yasgui'

interface Props {
    children: ReactNode,
    query: string
}

const YasguiButton: React.FC<Props> = ({ query, children }) => <Button
    as={Link}
    color="primary"
    href={makeYasguiUri(query)}
    size='sm'
    target='_blank'
    variant="ghost"
>
    {children}
</Button>

export default YasguiButton