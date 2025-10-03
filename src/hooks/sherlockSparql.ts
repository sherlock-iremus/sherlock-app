import { useQuery } from '@tanstack/react-query'
import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'

import { countOutgoingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { getDotOneProperties } from 'sherlock-sparql-queries/lib/dotOne'
import { e13WithLiteralP141 } from 'sherlock-sparql-queries/lib/e13WithLiteralP141'
import { identity, LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { identityIncomingLight, identityLight } from 'sherlock-sparql-queries/lib/identityLight'
import { getProjectByCode, getProjectByResourceUri, getProjectFiles } from 'sherlock-sparql-queries/lib/project'
// import { countIncomingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { projectAndCollections } from 'sherlock-sparql-queries/lib/projectsAndCollections'

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

////////////////////////////////////////////////////////////////////////////////////////////////////
// PROJECTS
////////////////////////////////////////////////////////////////////////////////////////////////////

export const useGetProjectByResourceUriQuery = (resourceURI: string) => {
    const query = getProjectByResourceUri(resourceURI)
    const x = baseSherlockUseSparqlQuery(true, ['project', 'resource', resourceURI], query)
    return { query, ...x }
}

export const useGetProjectByCodeQuery = (code: string) => {
    const query = getProjectByCode(code)
    const x = baseSherlockUseSparqlQuery(true, ['project', code], query)
    return { query, ...x }
}

export const useGetProjectsFilesQuery = (projectUuid: string) => {
    const query = getProjectFiles(projectUuid)
    const x = baseSherlockUseSparqlQuery(true, ['project', 'files', projectUuid], query)
    return { query, ...x }
}

export const useGetAllProjectDataQuery = (query: string, projectGraphUri: string, search: string, enabled: boolean) =>
    baseSherlockUseSparqlQuery(enabled, ['all-project-data', projectGraphUri, search], query)

export const useGetProjectsAndCollections = (projectCode: string | undefined) => {
    const query = projectAndCollections(projectCode)
    const x = baseSherlockUseSparqlQuery(true, ['projects-and-collections', projectCode ? projectCode : "all"], query)
    return { query, ...x }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// RESOURCES
////////////////////////////////////////////////////////////////////////////////////////////////////

export const useResourceIdentityQuery = (resourceUri: string) => {
    const query = identity(resourceUri)
    const x = baseSherlockUseSparqlQuery(true, ['identity', resourceUri], query)
    return { query, ...x }
}

export const useCountObjectsOfOutgoingPredicatesQuery = (resourceUri: string) => {
    const query = countOutgoingPredicates(resourceUri)
    const x = baseSherlockUseSparqlQuery(true, ['count-objects-of-outgoing-predicates', resourceUri], query)
    return { query, ...x }
}

export const useObjectsOfLowFanOutgoingPredicatesQuery = (resourceUri: string, lowFanOutPredicates: string[], enabled: boolean) => {
    const query = identity(resourceUri, true, lowFanOutPredicates, LinkedResourcesDirectionEnum.OUTGOING)
    const x = baseSherlockUseSparqlQuery(enabled, ['objects-of-low-fan-outgoing-predicates', resourceUri], query)
    return { query, ...x }
}

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

export const useResourceIdentityLightQuery = (resourceUri: string, predicateUri: string, direction: LinkedResourcesDirectionEnum) => {
    let query: string = ''
    if (direction === LinkedResourcesDirectionEnum.INCOMING) query = identityIncomingLight(resourceUri, predicateUri)
    if (direction === LinkedResourcesDirectionEnum.OUTGOING) query = identityLight(resourceUri, predicateUri)
    const x = baseSherlockUseSparqlQuery(true, ['identity-light', resourceUri, predicateUri], query)
    return { query, ...x }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// CUSTOM
////////////////////////////////////////////////////////////////////////////////////////////////////

export const useMGLivraisonsQuery = (query: string) =>
    baseSherlockUseSparqlQuery(true, ['mg-livraisons'], query)

export const useMGLivraisonQuery = (query: string, livraisonBusinessId: string) =>
    baseSherlockUseSparqlQuery(true, ['mg-livraison', livraisonBusinessId], query)

////////////////////////////////////////////////////////////////////////////////////////////////////
// BASE
////////////////////////////////////////////////////////////////////////////////////////////////////

export const useSparqlQuery = (query: string, key: Array<string>) =>
    baseSherlockUseSparqlQuery(true, key, query)