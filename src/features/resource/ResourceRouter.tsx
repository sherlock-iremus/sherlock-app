import { Navigate, useParams, useSearchParams } from 'react-router-dom'

export default function () {
    const { resourceUUID } = useParams()
    const [searchParams] = useSearchParams()
    const resourceUri = searchParams.get('resource') || 'http://data-iremus.huma-num.fr/id/' + resourceUUID

    return (
        <pre>
            {resourceUri}
        </pre>
    )
}