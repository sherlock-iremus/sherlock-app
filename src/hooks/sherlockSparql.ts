import { useQuery } from '@tanstack/react-query'
import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'
import { LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/common'
import { countOutgoingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { getDotOneProperties } from 'sherlock-sparql-queries/lib/dotOne'
import { e13WithLiteralP141 } from 'sherlock-sparql-queries/lib/e13WithLiteralP141'
import { identity } from 'sherlock-sparql-queries/lib/identity'
import { identityIncomingLight, identityLight } from 'sherlock-sparql-queries/lib/identityLight'
import { listLinkedResources } from 'sherlock-sparql-queries/lib/listLinkedResources'
import { getProjectByCode, getProjectByResourceUri, getProjectFiles } from 'sherlock-sparql-queries/lib/project'
import { projectAndCollections } from 'sherlock-sparql-queries/lib/projectsAndCollections'
import { getResourceByBusinessId } from 'sherlock-sparql-queries/lib/getResourceByBusinessId'

export const baseSherlockUseSparqlQuery = (somethingTruthyToEnable: any, queryKey: Array<string>, body: string) => {
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

export const useGetProjectByCodeQuery = (projectCode: string) => {
    const query = getProjectByCode(projectCode)
    const x = baseSherlockUseSparqlQuery(true, ['project', projectCode], query)
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

export const useGetResourceByBusinessId = (resourceBusinessId: string) => {
    const query = getResourceByBusinessId(resourceBusinessId)
    const x = baseSherlockUseSparqlQuery(true, ['resource-by-business-id', resourceBusinessId], query)
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

export const useListLinkedResources = (r: string, p: string) => {
    const query = listLinkedResources(r, p)
    const x = baseSherlockUseSparqlQuery(true, ['linked-resources', r, p], query)
    return { query, ...x }
}

export const useResourceIdentityLightQuery = (resourceUri: string, predicateUri: string, direction: LinkedResourcesDirectionEnum) => {
    let query: string = ''
    if (direction === LinkedResourcesDirectionEnum.INCOMING) query = identityIncomingLight(resourceUri, predicateUri)
    if (direction === LinkedResourcesDirectionEnum.OUTGOING) query = identityLight(resourceUri, predicateUri)
    const x = baseSherlockUseSparqlQuery(true, ['identity-light', resourceUri, predicateUri], query)
    return { query, ...x }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// BASE
////////////////////////////////////////////////////////////////////////////////////////////////////

export const useSparqlQuery = (query: string, key: Array<string>) =>
    baseSherlockUseSparqlQuery(true, key, query)