import { useProjectQuery } from '@/hooks/sherlockSparql'
import { useParams, useSearchParams } from 'react-router-dom'
import ProjectHeader from './ProjectHeader'
import Resource from './Resource'
import SherlockBar from '@/components/SherlockBar'
import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'

interface ProjectData {
    code?: string,
    logo?: string,
    name?: string,
    uuid?: string,
}

function extract_project_data(data_project?: SparqlQueryResultObject): ProjectData {
    const x: ProjectData = {
        code: '',
        logo: '',
        name: '',
        uuid: ''
    }
    if (data_project?.results.bindings.length === 0) return x
    x.code = data_project?.results.bindings[0]['project_code']['value']
    x.logo = data_project?.results.bindings[0]['project_logo']['value']
    x.name = data_project?.results.bindings[0]['project_name']['value']
    x.uuid = data_project?.results.bindings[0]['project_uuid']['value']
    return x
}

export default function () {
    const { resourceUUID } = useParams()
    const [searchParams] = useSearchParams()
    let resourceUri = searchParams.get('resource') || ''
    if (!resourceUri && resourceUUID) resourceUri = 'http://data-iremus.huma-num.fr/id/' + resourceUUID

    const { data: data_project } = useProjectQuery(resourceUri)

    const x = extract_project_data(data_project)

    return (
        <>
            {x.code && <>
                <ProjectHeader
                    code={x.code}
                    logo={x.logo}
                    name={x.name}
                    uuid={x.uuid}
                />
                <SherlockBar />
            </>
            }
            <Resource resourceUri={resourceUri} />
        </>
    )
}

{/* <Navigate to={`/?resource=http://data-iremus.huma-num.fr/id/${resourceUUID}`} /> */ }