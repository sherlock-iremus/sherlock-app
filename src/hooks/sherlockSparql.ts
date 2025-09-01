import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'
import { useQuery } from '@tanstack/react-query'

//TODO: Put queries imports here
import { identity } from 'sherlock-sparql-queries/lib/identity'
import { getProject } from 'sherlock-sparql-queries/lib/project'
import { getDotOneProperties } from 'sherlock-sparql-queries/lib/dotOne'
import { e13WithLiteralP141 } from 'sherlock-sparql-queries/lib/e13WithLiteralP141'

const baseSherlockUseSparqlQuery = (somethingTruthyToEnable: any, queryKey: Array<string>, body: string) => {
    return useQuery({
        enabled: !!somethingTruthyToEnable,
        queryKey,
        queryFn: (): Promise<SparqlQueryResultObject> => {
            console.log(['🪐', ...queryKey].toString().replaceAll(',', '✨'))
            return fetch('https://data-iremus.huma-num.fr/sparql/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/sparql-query',
                    Accept: 'application/sparql-results+json',
                },
                body,
            }).then((res) =>
                res.json(),
            )
        }
    })
}

export const useProjectQuery = (resourceURI: string) => {
    const query = getProject(resourceURI)
    const x = baseSherlockUseSparqlQuery(true, ['project', resourceURI], query)
    return { query, ...x }
}

export const useResourceIdentityQuery = (resourceUri: string) => {
    const query = identity(resourceUri)
    const x = baseSherlockUseSparqlQuery(true, ['identity', resourceUri], query)
    return { query, ...x }
}

export const useCountObjectsOfOutgoingPredicatesQuery = (query: string, resourceUri: string) =>
    baseSherlockUseSparqlQuery(true, ['count-objects-of-outgoing-predicates', resourceUri], query)

export const useObjectsOfLowFanOutgoingPredicatesQuery = (query: string, resourceUri: string, enabled: boolean) =>
    baseSherlockUseSparqlQuery(enabled, ['objects-of-low-fan-outgoing-predicates', resourceUri], query)

export const useDotOnePropertiesQuery = (resourceUri: string) => {
    const query = getDotOneProperties(resourceUri)
    const x = baseSherlockUseSparqlQuery(true, ['dot-one-properties', resourceUri], query)
    return { query, ...x }
}

export const useE13WithLiteralP141Query = (resourceUri: string) => {
    const query = e13WithLiteralP141(resourceUri)
    const x = baseSherlockUseSparqlQuery(true, ['e13-with-literal-p141', resourceUri], query)
    return { query, ...x }
}

export const useGetResourceByUrlFragmentQuery = (query: string, businessId: string) =>
    baseSherlockUseSparqlQuery(true, ['resource-by-url-fragment', businessId], query)

export const useGetAllProjectDataQuery = (query: string, projectGraphUri: string, search: string, enabled: boolean) =>
    baseSherlockUseSparqlQuery(enabled, ['all-project-data', projectGraphUri, search], query)

export const useGetProjectsAndCollections = (query: string, projectCode: string | undefined) =>
    baseSherlockUseSparqlQuery(true, ['projects-and-collections', projectCode ? projectCode : "all"], query)

export const useMGLivraisonsQuery = (query: string) =>
    baseSherlockUseSparqlQuery(true, ['mg-livraisons'], query)

export const useMGLivraisonQuery = (query: string, livraisonBusinessId: string) =>
    baseSherlockUseSparqlQuery(true, ['mg-livraison', livraisonBusinessId], query)

export const useSparqlQuery = (query: string, key: Array<string>) =>
    baseSherlockUseSparqlQuery(true, key, query)