import { sparqlApi } from '@/services/sparqlApi'
import { f } from 'sherlock-sparql-queries/lib/projectDataFields'
import PredicateSectionTitle from '../resource/PredicateSectionTitle'

export default function () {
    const allDataSparqlQuery = f("aam", "c583a908-30da-4d05-b0b1-dec8d3401a1e")
    const { data: allDataSparqlQueryResults } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(allDataSparqlQuery)
    // console.log(allDataSparqlQueryResults)
    return <div>
        <PredicateSectionTitle direction={null} icon={null} link={null} title='Données' prefixedUri={null} sparqlQuery={allDataSparqlQuery} n={null} />
    </div>
}