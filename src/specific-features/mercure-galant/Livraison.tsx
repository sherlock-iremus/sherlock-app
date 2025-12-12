import ResourceInProject from '@/components/resource/ResourceInProjet'
import { useGetProjectByCodeQuery, useGetResourceByBusinessId } from '@/hooks/sherlockSparql'
import { extractProjectIdData, getProjecCodeFromLocation } from '@/utils/project'
import { useLocation, useParams } from 'react-router-dom'
import LivraisonContent from './LivraisonContent'

export default function () {
    const projectCode = getProjecCodeFromLocation(useLocation())
    const { data: data_project } = useGetProjectByCodeQuery(projectCode)
    const projectIdData = extractProjectIdData(data_project)
    const { livraison } = useParams()
    const { data: resourceUriData } = useGetResourceByBusinessId(livraison || '')
    const resourceUri = resourceUriData?.results.bindings[0]['resource'].value

    const livraisonContent = <LivraisonContent projectIdData={projectIdData} resourceBusinessId={livraison || ''} />

    return <ResourceInProject resourceUri={resourceUri || ''} projectIdData={projectIdData} customParts={[livraisonContent]} />
}