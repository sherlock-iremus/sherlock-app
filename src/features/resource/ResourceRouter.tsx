import { Navigate, useParams, useSearchParams } from 'react-router-dom'

export default function () {
    const { resourceUUID } = useParams()
    const [searchParams] = useSearchParams()
    let resourceUri = searchParams.get('resource')
    if (!resourceUri && resourceUUID) resourceUri = 'http://data-iremus.huma-num.fr/id/' + resourceUUID

    return (
        <pre>
            {resourceUri}
        </pre>
    )
}

{/* <Navigate to={`/?resource=http://data-iremus.huma-num.fr/id/${resourceUUID}`} /> */ }