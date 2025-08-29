import { useProjectQuery } from '@/hooks/sherlockSparql'
import { useParams, useSearchParams } from 'react-router-dom'
import ProjectHeader from './ProjectHeader'
import Resource from './Resource'
import SherlockBar from '@/components/SherlockBar'

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
            <SherlockBar />
            <Resource resourceUri={resourceUri} />
        </>
    )
}

{/* <Navigate to={`/?resource=http://data-iremus.huma-num.fr/id/${resourceUUID}`} /> */ }