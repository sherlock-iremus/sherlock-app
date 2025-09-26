import Link from '@/components/Link'
import MarkdownFromUrl from '@/components/MarkdownFromUrl'
import { useGetProjectByCodeQuery, useGetProjectsAndCollections, useGetProjectsFilesQuery } from '@/hooks/sherlockSparql'
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@heroui/table'
import { FaIdCard } from 'react-icons/fa'
import { IoDocumentAttachOutline } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import { SHERLOCK_E55_PROJECT_OVERVIEW_FILE } from 'sherlock-rdf/lib/rdf-prefixes'
import { makeGroupedBindings, SparqlQueryResultObject_Variable } from 'sherlock-rdf/lib/sparql-result'
import { makeH2, projectLogo, projectName } from '../resource/markupHelpers'
import { extractProjectData } from './projectsDataHelpers'
import SherlockBar from '@/components/SherlockBar'

interface ProjectProps {
    searchEngine?: boolean
}

const Project: React.FC<ProjectProps> = ({ searchEngine }) => {
    const { projectCode } = useParams()

    // Project data
    const { data: data__projectIdentity, query: query__projectIdentity } = useGetProjectByCodeQuery(projectCode || '')
    const projectData = extractProjectData(data__projectIdentity)

    // Project files data
    const { data: data__projectFiles, query: query__projectFiles } = useGetProjectsFilesQuery(projectData.uuid || '')
    const projectFilesData = makeGroupedBindings(
        data__projectFiles?.results.bindings || [],
        'file',
        ['file_type', 'file_type_label']
    )

    // Project overview file URI
    const x = data__projectFiles?.results.bindings.filter(x => x.file_type.value === SHERLOCK_E55_PROJECT_OVERVIEW_FILE)
    let overviewFileUri = ''
    if (x && x?.length > 0) {
        overviewFileUri = x[0].file_uri.value
    }

    // TODO Antoine
    const { data: data__projectsAndCollections } = useGetProjectsAndCollections(projectCode)
    console.log(data__projectsAndCollections)

    // <>
    return <div>
        <div className='flex items-center gap-6 bg-background m-6 text-foreground light'>
            {projectLogo(projectData.logo || '')}
            {projectName(projectData.name || '')}
        </div>
        <SherlockBar />
        <div className='px-6'>
            {makeH2('Présentation', <FaIdCard />)}
            {overviewFileUri && <div
                className='[&>h2]:my-2 [&>p]:my-1 [&>ul>li]:ml-11 font-serif [&>h2]:font-bold text-justify [&>ul]:list-disc'
            >
                <MarkdownFromUrl url={overviewFileUri} />
            </div>}
            {makeH2('Fichiers', <IoDocumentAttachOutline />, query__projectFiles)}
            <div>
                <Table
                    aria-label='Project files'
                    hideHeader={false}
                    isCompact={true}
                    radius='none'
                    removeWrapper={false}
                >
                    <TableHeader>
                        <TableColumn>Nom</TableColumn>
                        <TableColumn>Type</TableColumn>
                        <TableColumn>Lien</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {(projectFilesData || []).map(_ => <TableRow className='font-serif'>
                            <TableCell>
                                {(_.p1_literal as SparqlQueryResultObject_Variable)?.value}
                            </TableCell>
                            <TableCell>
                                {(_.file_type_label as SparqlQueryResultObject_Variable[]).map(_ => _.value).join(', ')}
                            </TableCell>
                            <TableCell>
                                <Link href={(_.file_uri as SparqlQueryResultObject_Variable).value} target='_blank'>
                                    {(_.file_uri as SparqlQueryResultObject_Variable).value.split('/').slice(-1)}
                                </Link>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>

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