import { makeH2 } from '@/components/layout/markupHelpers'
import { BindingsTable } from '@/components/resource/BindingTables'
import { FaIdCard } from 'react-icons/fa'
import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'

interface Props {
    resourceIdentityBindings: SparqlQueryResultObject | undefined
    resourceIdentityQuery: string
}

export default function ({ resourceIdentityBindings, resourceIdentityQuery }: Props) {
    return <>
        {makeH2('Identité de la ressource', <FaIdCard />, resourceIdentityQuery)}
        {resourceIdentityBindings?.results.bindings && <BindingsTable
            bindings={resourceIdentityBindings?.results.bindings}
            wrapper={true}
        />}
    </>
}