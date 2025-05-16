import { useQuery } from '@tanstack/react-query'
import { fetchIdentity } from '@/api/resource'
import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'

export const useResourceIdentity = (resourceUri: string) =>
    useQuery<SparqlQueryResultObject, Error>({
        queryKey: [resourceUri + '::identity'],
        queryFn: () => fetchIdentity(resourceUri)
    })
