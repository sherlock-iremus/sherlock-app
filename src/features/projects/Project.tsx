import { useParams } from 'react-router-dom'
import { useGetProjectByCodeQuery } from '@/hooks/sherlockSparql'
import { extractProjectData } from './projectsDataHelpers'
import { makeH2, projectName } from '../resource/markupHelpers'
import { FaIdCard } from 'react-icons/fa'

interface ProjectProps {
    searchEngine?: boolean
}

const Project: React.FC<ProjectProps> = ({ searchEngine }) => {
    const { projectCode } = useParams()

    const { data: data__projectIdentity, query: query__projectIdentity } = useGetProjectByCodeQuery(projectCode || '')
    const projectData = extractProjectData(data__projectIdentity)

    return <div className='p-6'>
        {projectName(projectData.name || '')}
        {makeH2('Identité', <FaIdCard />, query__projectIdentity)}
    </div>

    // const q = f(projectCode)
    // const { data } = useGetProjectsAndCollections(q, projectCode)

    // if (!projectCode || !data || !data.results.bindings.length) {
    //     return <div>Project not found</div>
    // }

    // const projectGraphUri = data.results.bindings[0].graph_uri.value
    // const collections = data.results.bindings.map(row => ({
    //     collectionName: row.collection_name.value,
    //     collectionUri: row.collection.value,
    // }))

    // return <div>
    //     {searchEngine && <CollectionSearchEngine projectCode={projectCode} collections={collections} projectGraphUri={projectGraphUri} />}
    // </div>
}

export default Project