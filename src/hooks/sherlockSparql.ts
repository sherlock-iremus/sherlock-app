import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'
import { useQuery } from '@tanstack/react-query'
import { identity, LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'

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

export const useIdentityQuery = (query: string, resourceUri: string) =>
    baseSherlockUseSparqlQuery(true, ['Identity', resourceUri], query)

export const useCountObjectsOfOutgoingPredicatesQuery = (query: string, resourceUri: string) =>
    baseSherlockUseSparqlQuery(true, ['CountObjectsOfOutgoingPredicates', resourceUri], query)

export const useObjectsOfLowFanOutgoingPredicatesQuery = (query: string, resourceUri: string, enabled: boolean) =>
    baseSherlockUseSparqlQuery(enabled, ['ObjectsOfLowFanOutgoingPredicates', resourceUri], query)

export const useDotOnePropertiesQuery = (query: string, resourceUri: string) =>
    baseSherlockUseSparqlQuery(true, ['DotOneProperties', resourceUri], query)

export const useE13WithLiteralP141Query = (query: string, resourceUri: string) =>
    baseSherlockUseSparqlQuery(true, ['E13WithLiteralP141', resourceUri], query)