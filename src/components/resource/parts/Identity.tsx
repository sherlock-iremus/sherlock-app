import { makeH2 } from '@/components/layout/markupHelpers'
import { BindingsTable } from '@/components/resource/BindingTables'
import { FaIdCard } from 'react-icons/fa'
import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'

interface Props {
    resourceIdentityBindings: SparqlQueryResultObject | undefined
    resourceIdentityQuery: string
}

const X: React.FC<Props> = ({ resourceIdentityBindings, resourceIdentityQuery }) => {
    return <>
        {makeH2('Identité de la ressource', <FaIdCard />, resourceIdentityQuery)}
        <BindingsTable bindings={resourceIdentityBindings?.results.bindings || []} />
    </>
}

export default X