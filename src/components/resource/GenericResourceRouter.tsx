import { useGetProjectByResourceUriQuery } from '@/hooks/sherlockSparql'
import { extractProjectIdData } from '@/utils/project'
import { useParams, useSearchParams } from 'react-router-dom'
import ResourceInProject from './ResourceInProjet'

export default function () {
    const { resourceUUID } = useParams()
    const [searchParams] = useSearchParams()
    let resourceUri = searchParams.get('resource') || ''
    if (!resourceUri && resourceUUID) resourceUri = 'http://data-iremus.huma-num.fr/id/' + resourceUUID

    const { data: data_project } = useGetProjectByResourceUriQuery(resourceUri)
    const projectIdData = extractProjectIdData(data_project)

    return <ResourceInProject projectIdData={projectIdData} resourceUri={resourceUri} customParts={[<></>]} />
}