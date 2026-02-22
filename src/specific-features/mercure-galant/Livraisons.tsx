import BasicTanStackTable from '@/components/common/BasicTanStackTable'
import SherlockBar from '@/components/deco/SherlockBar'
import { makeH2 } from '@/components/layout/markupHelpers'
import ProjectHeader from '@/components/layout/ProjectHeader'
import TableWrapper from '@/components/layout/TableWrapper'
import { useGetProjectByCodeQuery } from '@/hooks/sherlockSparql'
import { useLivraisonsQuery } from '@/specific-features/mercure-galant/hooks_sparql'
import { extractProjectIdData, getProjecCodeFromLocation } from '@/utils/project'
import { ColumnDef } from '@tanstack/react-table'
import { PiBooksDuotone } from "react-icons/pi"
import { useLocation, useNavigate } from 'react-router-dom'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'

const columns: ColumnDef<SparqlQueryResultObject_Binding>[] = [
    {
        id: 'livraison_business_id',
        header: "Date",
        accessorFn: (x: SparqlQueryResultObject_Binding) => x['livraison_business_id'].value,
    },
    {
        id: 'livraison_title',
        header: "Titre",
        accessorFn: (x: SparqlQueryResultObject_Binding) => x['livraison_title'].value,
    },
    {
        id: 'livraison_subtitle',
        header: "Sous-titre",
        accessorFn: (x: SparqlQueryResultObject_Binding) => x['livraison_subtitle']?.value,
    },
    {
        id: 'livraison_n_articles',
        header: "Nb d'articles",
        accessorFn: (x: SparqlQueryResultObject_Binding) => x['livraison_n_articles'].value,
    }
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
                        columns={columns as ColumnDef<unknown, any>[]}
                        tableStyle='p-6 [&_th,&_td]:p-2 font-serif text-sm [&_th]:text-left'
                        tbodyStyle='[&>tr>td:nth-child(4)]:text-center'
                        theadStyle='bg-table-head [&_th>span]:no-underline'
                        trStyle='hover:bg-table-row-hover [&>td:nth-child(1)]:font-mono [&>td:nth-child(1)]:text-xs [&>td:nth-child(1)]:text-text-secondary-foreground'
                        trClick={row => {
                            navigate('/projects/' + projectCode + '/livraisons/' + row.getValue('livraison_business_id'))
                        }}
                        thStyle={""}
                        tdStyle={""}
                        showHeader={true}
                    />
                </TableWrapper>
            </>}
        </div>
    </>
}