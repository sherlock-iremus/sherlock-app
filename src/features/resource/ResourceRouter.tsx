import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useProjectQuery } from '@/hooks/sherlockSparql'
import ProjectHeader from './ProjectHeader'

export default function () {
    const { resourceUUID } = useParams()
    const [searchParams] = useSearchParams()
    let resourceUri = searchParams.get('resource') || ''
    if (!resourceUri && resourceUUID) resourceUri = 'http://data-iremus.huma-num.fr/id/' + resourceUUID


    const { data: data_project } = useProjectQuery(resourceUri)

    return (
        <>
            <ProjectHeader
                code={data_project?.results.bindings[0]['project_code']['value']}
                logo={data_project?.results.bindings[0]['project_logo']['value']}
                name={data_project?.results.bindings[0]['project_name']['value']}
                uuid={data_project?.results.bindings[0]['project_uuid']['value']}
            />
        </>
    )
}

{/* <Navigate to={`/?resource=http://data-iremus.huma-num.fr/id/${resourceUUID}`} /> */ }