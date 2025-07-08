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

    if (!projectCode || !data || !data.results.bindings.length) {
        return <div>Project not found</div>;
    }

    const projectGraphUri = data.results.bindings[0].graph_uri.value;
    const collections = data.results.bindings.map(row => ({
        collectionName: row.collection_name.value,
        collectionUri: row.collection.value,
    }));

    return <div>
        {searchEngine && <CollectionSearchEngine projectCode={projectCode} collections={collections} projectGraphUri={projectGraphUri} />}
    </div>
}

export default Project;