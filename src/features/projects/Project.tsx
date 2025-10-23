import Link from '@/components/Link'
import MarkdownFromUrl from '@/components/MarkdownFromUrl'
import { useGetProjectByCodeQuery, useGetProjectsAndCollections, useGetProjectsFilesQuery } from '@/hooks/sherlockSparql'
import { PiGraphDuotone } from 'react-icons/pi'
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
import CollectionSearchEngine from '../resource/CollectionSearchEngine'

interface ProjectProps {
    searchEngine?: boolean
}

const Project: React.FC<ProjectProps> = ({ searchEngine }) => {
    const { projectCode } = useParams()

    // Project data
    const { data: data__projectIdentity } = useGetProjectByCodeQuery(projectCode || '')
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
    const projectGraphUri = (() => {
        try {
            return data__projectsAndCollections?.results.bindings[0].graph_uri.value
        } catch { return '' }
    })()

    const collections = (() => {
        try {
            data__projectsAndCollections?.results.bindings.map(row => ({
                collectionName: row.collection_name.value,
                collectionUri: row.collection.value
            }))
        } catch { return null }
    })()

    // <>
    return <div>
        <div className='flex items-center gap-6 bg-background m-6 text-foreground light'>
            {projectLogo(projectData.logo || '')}
            {projectName(projectData.name || '')}
        </div>
        <SherlockBar />
        <div className='px-6 pb-6'>

            {makeH2('Présentation', <FaIdCard />)}
            {overviewFileUri && <div
                className='[&>h2]:my-2 [&>p]:my-1 [&>ul>li]:ml-11 font-serif [&>h2]:font-bold text-justify [&>ul]:list-disc'
            >
                <MarkdownFromUrl url={overviewFileUri} />
            </div>}

            {projectFilesData.length > 0 && <>
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
                            <TableColumn>Lien</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {(projectFilesData || []).map(_ => <TableRow>
                                <TableCell className='font-serif'>
                                    {(_.p1_literal as SparqlQueryResultObject_Variable)?.value}
                                </TableCell>
                                <TableCell>
                                    <Link className='text-sm' href={(_.file_uri as SparqlQueryResultObject_Variable).value} target='_blank'>
                                        {(_.file_uri as SparqlQueryResultObject_Variable).value.split('/').slice(-1)}
                                    </Link>
                                </TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </div>
            </>
            }

            {makeH2('Données', <PiGraphDuotone />)}
            {searchEngine && projectCode && collections && projectGraphUri && <CollectionSearchEngine
                projectCode={projectCode}
                collections={collections}
                projectGraphUri={projectGraphUri}
            />}
        </div>
    </div>
}

export default Project