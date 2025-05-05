import { sparqlApi } from '@/services/sparqlApi'
import { f } from 'sherlock-sparql-queries/lib/projectDataFields'

export default function () {
    const allDataSparqlQuery = f("c583a908-30da-4d05-b0b1-dec8d3401a1e", "aam")
    const { data: allDataSparqlQueryResults } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(allDataSparqlQuery)
    console.log(allDataSparqlQueryResults)
    return <div>
        Coucou
    </div>
}