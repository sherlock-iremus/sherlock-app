import ResourceInProject from '@/components/resource/ResourceInProjet'
import { useGetProjectByResourceUriQuery, useGetResourceByBusinessId } from '@/hooks/sherlockSparql'
import { extractProjectData } from '@/utils/project'
import { useParams } from 'react-router-dom'

export default function () {
    const { article: resourceBusinessId } = useParams()
    const { data } = useGetResourceByBusinessId(resourceBusinessId || '')
    const resourceUri = data?.results.bindings[0]['resource'].value
    const { data: data_project } = useGetProjectByResourceUriQuery(resourceUri || '')
    const projectIdData = extractProjectData(data_project)

    return <ResourceInProject resourceUri={resourceUri || ''} projectIdData={projectIdData} />
}