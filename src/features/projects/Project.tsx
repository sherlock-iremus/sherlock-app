import { useLocation } from 'react-router-dom';
import CollectionSearchEngine from '../resource/CollectionSearchEngine'
import { f } from 'sherlock-sparql-queries/lib/projectsAndCollections'
import { useGetProjectsAndCollections } from '@/hooks/sherlockSparql';

interface ProjectProps {
  searchEngine?: boolean;
  
}

const Project: React.FC<ProjectProps> = ({ searchEngine }) => {
    const location = useLocation();
    const projectCode = location.pathname.split('/').pop();
    
    const q = f(projectCode)
    const { data } = useGetProjectsAndCollections(q, projectCode)
    
    console.log(data)
    if (!projectCode || !data || !data.results.bindings.length) {
        return <div>Project not found</div>;
    }
    
    return <div>
        {searchEngine && <CollectionSearchEngine collectionShortName={projectCode} collectionName={data.results.bindings[0].collection_name.value} collectionUri={data.results.bindings[0].collection.value} />}
    </div>
}

export default Project;