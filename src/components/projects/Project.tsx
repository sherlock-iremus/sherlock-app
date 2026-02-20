import { Link } from '@heroui/react'
import { linkStyles } from '@/styles/variants/link';
import SherlockBar from '@/components/deco/SherlockBar'
import { makeH2 } from '@/components/layout/markupHelpers'
import MarkdownFromUrl from '@/components/text/MarkdownFromUrl'
import { useGetProjectByCodeQuery, useGetProjectsAndCollections, useGetProjectsFilesQuery } from '@/hooks/sherlockSparql'
import { extractProjectIdData } from '@/utils/project'
import { FaIdCard } from 'react-icons/fa'
import { IoDocumentAttachOutline } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import { SHERLOCK_E55_PROJECT_OVERVIEW_FILE } from 'sherlock-rdf/lib/rdf-prefixes'
import { makeGroupedBindings, SparqlQueryResultObject_Binding, SparqlQueryResultObject_Variable } from 'sherlock-rdf/lib/sparql-result'
import ProjectHeader from '../layout/ProjectHeader'
import BasicTanStackTable from '../common/BasicTanStackTable'
import { createColumnHelper } from '@tanstack/react-table'
import TableWrapper from '../layout/TableWrapper'
import { PiGraphDuotone } from 'react-icons/pi';
import CollectionSearchEngine from '../collection-search-engine/CollectionSearchEngine';

interface ProjectProps {
    searchEngine?: boolean
}

const Project: React.FC<ProjectProps> = ({ searchEngine }) => {
    // Parameter
    const { projectCode } = useParams()

    // Hooks
    const { data: data__projectIdentity } = useGetProjectByCodeQuery(projectCode || '')
    const projectData = extractProjectIdData(data__projectIdentity)
    const { data: data__projectFiles, query: query__projectFiles } = useGetProjectsFilesQuery(projectData.uuid || '')
    const { data: data__projectsAndCollections } = useGetProjectsAndCollections(projectCode)

    // Project files data
    const projectFilesData = makeGroupedBindings(
        data__projectFiles?.results.bindings || [],
        'file',
        ['file_type', 'file_type_label']
    )

    // Project overview file URI
    const x = data__projectFiles?.results.bindings.filter(x => x.file_type.value === SHERLOCK_E55_PROJECT_OVERVIEW_FILE)
    let overviewFileUri = ''
    if (x && x?.length > 0) overviewFileUri = x[0].file_uri.value

    const projectGraphUri = (() => {
        try {
            return data__projectsAndCollections?.results.bindings[0].graph_uri.value
        } catch { return '' }
    })()

    const collections = (() => {
        try {
            return data__projectsAndCollections?.results.bindings.map(row => ({
                collectionName: row.collection_name.value,
                collectionUri: row.collection.value
            }))
        } catch { return null }
    })()

    // Project files table
    const projectFilesColumnHelper = createColumnHelper<SparqlQueryResultObject_Binding>()
    const projectFilesColumns = [
        projectFilesColumnHelper.accessor('p1_literal.value', {
            header: 'Nom',
            cell: x => <span className='font-serif'>{x.getValue()}</span>
        }),
        projectFilesColumnHelper.accessor('file_uri.value', {
            header: 'Lien',
            cell: x => <Link
                className={linkStyles({ textSize: 'sm', letterSpacing: 'normal', fontWeight: 'normal' })}
                href={x.getValue()}
                target='_blank'
            >
                {x.getValue().split('/').slice(-1)}
            </Link>
        }),
    ]


    // <>
    return <div>
        {projectData.code && <ProjectHeader
            code={projectData.code}
            emoticon={projectData.emoticon}
            logo={projectData.logo}
            name={projectData.name}
            uuid={projectData.uuid}
        />}
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
                <TableWrapper>
                    <BasicTanStackTable
                        data={data__projectFiles?.results.bindings || []}
                        columns={projectFilesColumns}
                        tableStyle='[&_td]:p-1 text-sm [&_th]:px-1 [&_th]:py-2'
                        theadStyle='bg-table-head [&_th>span]:no-underline'
                        thStyle='text-left font-medium lowercase'
                    />
                </TableWrapper>
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