import { Navigate, useParams } from 'react-router-dom'
import { getResourceByUrlFragment } from 'sherlock-sparql-queries/lib/urlFragment'
import { sparqlApi } from '@/services/sparqlApi'

export default function Resource() {
  const urlFragment = '/' + useParams()['*']

  let { data } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(getResourceByUrlFragment(urlFragment))

  return data ? (
    <Navigate to={`/?resource=${data?.results.bindings[0].s.value}`} />
  ) : (
    '⏳'
  )
}
