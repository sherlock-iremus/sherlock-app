import SherlockBar from '@/components/deco/SherlockBar'
import { makeH2 } from '@/components/layout/markupHelpers'
import ProjectHeader from '@/components/layout/ProjectHeader'
import { useGetProjectByCodeQuery } from '@/hooks/sherlockSparql'
import { useLivraisonsQuery } from '@/specific-features/mercure-galant/hooks_sparql'
import { extractProjectIdData, getProjecCodeFromLocation } from '@/utils/project'
import { PiBooksDuotone } from "react-icons/pi"
import { createColumnHelper } from '@tanstack/react-table'
import { useLocation, useNavigate } from 'react-router-dom'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import TableWrapper from '@/components/layout/TableWrapper'
import BasicTanStackTable from '@/components/common/BasicTanStackTable'

const columnHelper = createColumnHelper<SparqlQueryResultObject_Binding>()
const columns = [
    columnHelper.accessor('livraison_business_id', {
        cell: _ => _.getValue().value,
        header: _ => "Date",
    }),
    columnHelper.accessor('livraison_title', {
        cell: _ => _.getValue().value,
        header: _ => "Titre",
    }),
    columnHelper.accessor('livraison_subtitle', {
        cell: _ => _.getValue()?.value,
        header: _ => "Sous-titre",
    }),
    columnHelper.accessor('livraison_n_articles', {
        cell: _ => _.getValue().value,
        header: _ => "Nb d'articles",
    })
]

export default function () {
    const navigate = useNavigate()
    const projectCode = getProjecCodeFromLocation(useLocation())
    const { data: data_project } = useGetProjectByCodeQuery(projectCode)
    const projectData = extractProjectIdData(data_project)
    const { data, isSuccess, query } = useLivraisonsQuery()

    return <>
        <>
            {projectData.code && <ProjectHeader
                code={projectData.code}
                emoticon={projectData.emoticon}
                logo={projectData.logo}
                name={projectData.name}
                uuid={projectData.uuid}
            />}
            <SherlockBar />
        </>
        <div className='p-6'>
            {isSuccess && <>
                {makeH2(`Liste des ${data?.results?.bindings.length} livraisons`, <PiBooksDuotone />, query)}
                <TableWrapper>
                    <BasicTanStackTable
                        data={data?.results.bindings}
                        columns={columns}
                        tableStyle='p-6 [&_th,&_td]:p-2 font-serif text-sm [&_th]:text-left'
                        tbodyStyle='[&>tr>td:nth-child(4)]:text-center'
                        theadStyle='bg-table-head [&_th>span]:no-underline'
                        trStyle='hover:bg-table-row-hover'
                        trClick={row => navigate('/projects/' + projectCode + '/livraisons/' + (row.getValue('livraison_business_id') as SparqlQueryResultObject_Binding).value)}
                    />
                </TableWrapper>
            </>}
        </div>
    </>
}