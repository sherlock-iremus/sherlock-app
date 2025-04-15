import { useParams, Navigate } from 'react-router-dom'
import { getResourceByUrlFragment } from 'sherlock-sparql-queries/lib/urlFragment'
import { sparqlApi } from '@/services/sparqlApi'
import Spinner from '@/components/Brent'

export default function () {
    const { article } = useParams()
    let { data } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(getResourceByUrlFragment('/mercure-galant/' + article))
    return data
        ? <Navigate to={`/?resource=${data?.results.bindings[0].s.value}`} />
        : <Spinner />
}