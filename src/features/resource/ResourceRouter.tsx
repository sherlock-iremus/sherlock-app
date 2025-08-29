import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useProjectQuery } from '@/hooks/sherlockSparql'

export default function () {
    const { resourceUUID } = useParams()
    const [searchParams] = useSearchParams()
    let resourceUri = searchParams.get('resource') || ''
    if (!resourceUri && resourceUUID) resourceUri = 'http://data-iremus.huma-num.fr/id/' + resourceUUID


    const { data: data_project } = useProjectQuery(resourceUri)

    return (
        <pre>
            {JSON.stringify(data_project)}
        </pre>
    )
}

{/* <Navigate to={`/?resource=http://data-iremus.huma-num.fr/id/${resourceUUID}`} /> */ }