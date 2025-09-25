import { useParams } from 'react-router-dom'
import CollectionSearchEngine from '../resource/CollectionSearchEngine'
import { f } from 'sherlock-sparql-queries/lib/projectsAndCollections'
import { useGetProjectByCodeQuery, useGetProjectsAndCollections } from '@/hooks/sherlockSparql'
import { projectName } from '../resource/ProjectHeader'
import { extractProjectData } from './projectsDataHelpers'

interface ProjectProps {
    searchEngine?: boolean
}

const Project: React.FC<ProjectProps> = ({ searchEngine }) => {
    const { projectCode } = useParams()

    const { data: dataProjectIdentity, query: queryProjectIdentity } = useGetProjectByCodeQuery(projectCode || '')
    const projectData = extractProjectData(dataProjectIdentity)

    return <div className='p-6'>
        {projectName(projectData.name || '')}
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