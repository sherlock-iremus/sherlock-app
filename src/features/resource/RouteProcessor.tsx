import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getResourceByUrlFragment } from 'sherlock-sparql-queries/lib/urlFragment'
import { sparqlApi } from '../../services/sparqlApi'

export default function Resource () {
  const urlFragment = '/' + useParams()['*']

  const getResourceSparqlQuery = useMemo(
    () => getResourceByUrlFragment(urlFragment),
    [urlFragment]
  )
  let { data } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(
    getResourceSparqlQuery
  )

  return data ? (
    <Navigate to={`/?resource=${data?.results.bindings[0].s.value}`} />
  ) : (
    '⏳'
  )
}
