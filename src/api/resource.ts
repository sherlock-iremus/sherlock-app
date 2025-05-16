import { countIncomingPredicates, countOutgoingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { identity, LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { getDotOneProperties } from 'sherlock-sparql-queries/lib/dotOne'
import { e13WithLiteralP141 } from 'sherlock-sparql-queries/lib/e13WithLiteralP141'
import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'

export const fetchIdentity = async (resourceUri: string): Promise<SparqlQueryResultObject> => {
    const res = await fetch('https://data-iremus.huma-num.fr/sparql/', {
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/json',
            'Content-Type': 'application/sparql-query',
            Accept: 'application/sparql-results+json',
        },
        body: identity(resourceUri, false),
    })
    if (!res.ok) throw new Error(`Failed to fetch identity for resource ${resourceUri}`)
    return res.json()
}