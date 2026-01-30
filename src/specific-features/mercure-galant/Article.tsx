import ResourceInProject from '@/components/resource/ResourceInProjet'
import { useGetProjectByResourceUriQuery, useGetResourceByBusinessId } from '@/hooks/sherlockSparql'
import { extractProjectIdData } from '@/utils/project'
import { useParams } from 'react-router-dom'

export default function () {
    const { article: resourceBusinessId } = useParams()
    const { data } = useGetResourceByBusinessId(resourceBusinessId || '')
    const resourceUri = data?.results.bindings[0]['resource'].value
    const { data: data_project } = useGetProjectByResourceUriQuery(resourceUri || '')
    const projectIdData = extractProjectIdData(data_project)

    return <ResourceInProject resourceUri={resourceUri || ''} projectIdData={projectIdData} customParts={[<div key="0"></div>]} />
}