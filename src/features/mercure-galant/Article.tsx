import { useParams, Navigate } from 'react-router-dom'
import { getResourceByUrlFragment } from 'sherlock-sparql-queries/lib/urlFragment'
import Spinner from '@/components/Brent'
import { useGetResourceByUrlFragmentQuery } from '@/hooks/sherlockSparql'

export default function () {
    const { article } = useParams()
    const businessId = '/mercure-galant/' + article
    const q = getResourceByUrlFragment(businessId)
    let { data } = useGetResourceByUrlFragmentQuery(q, businessId)
    return data
        ? <Navigate to={`/?resource=${data?.results.bindings[0].s.value}`} />
        : <Spinner />
}