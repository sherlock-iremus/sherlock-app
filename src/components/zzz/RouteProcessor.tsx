import { useSparqlQuery } from '@/hooks/sherlockSparql'
import { Navigate, useParams } from 'react-router-dom'
import { getResourceByUrlFragment } from 'sherlock-sparql-queries/lib/urlFragment'

export default function Resource() {
  const urlFragment = '/' + useParams()['*']

  let { data } = useSparqlQuery(getResourceByUrlFragment(urlFragment), ['resource-by-url-fragment', urlFragment])

  return data ? (
    <Navigate to={`/?resource=${data?.results.bindings[0].s.value}`} />
  ) : (
    '⏳'
  )
}
