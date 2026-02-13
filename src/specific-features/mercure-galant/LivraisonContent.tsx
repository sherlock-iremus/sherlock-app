import { makeH2 } from "@/components/layout/markupHelpers"
import { ProjectIdData } from "@/utils/project"
import { PiNotebookDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useLivraisonQuery } from './hooks_sparql'
import BasicTanStackTable from "@/components/common/BasicTanStackTable"
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { createColumnHelper } from "@tanstack/react-table"
import TableWrapper from "@/components/layout/TableWrapper"

interface Props {
    projectIdData: ProjectIdData
    resourceBusinessId: string
}

const columnHelper = createColumnHelper<SparqlQueryResultObject_Binding>()
const columns = [
    columnHelper.accessor('article_business_id', {
        cell: _ => _.getValue()?.value,
        header: _ => "Identifiant",
    }),
    columnHelper.accessor('livraison_subtitle', {
        cell: _ => <div className='flex flex-col'>
            {'title_forge' in _.row.original && <div>{_.row.original['title_forge'].value} <span className='pl-1 font-mono text-text-secondary-foreground text-xs'>[titre forgé]</span></div>}
            {'title_courant' in _.row.original && <div>{_.row.original['title_courant'].value} <span className='pl-1 font-mono text-text-secondary-foreground text-xs'>[titre courant]</span></div>}
            {'title_paratexte' in _.row.original && <div>{_.row.original['title_paratexte'].value} <span className='pl-1 font-mono text-text-secondary-foreground text-xs'>[titre dans le paratexte]</span></div>}
        </div>
        ,
        header: _ => "Titre de l'article",
    }),
    columnHelper.accessor('pagination', {
        cell: _ => _.getValue()?.value,
        header: _ => "Pagination",
    })
]

export default function ({ projectIdData, resourceBusinessId }: Props) {
    const navigate = useNavigate()
    const { data, query } = useLivraisonQuery(resourceBusinessId || '')

    //TODO
    // onRowAction={(key) => {
    //     
    // }}

    return <>
        {makeH2(`Contenu de la livraison (${data?.results?.bindings.length} articles)`, <PiNotebookDuotone />, query)}
        {
            data?.results.bindings && <TableWrapper>
                <BasicTanStackTable
                    data={data.results.bindings}
                    columns={columns}
                    tableStyle='p-6 [&_th,&_td]:p-3 font-serif text-sm [&_th:nth-child(1)]:text-left [&_th:nth-child(2)]:text-left'
                    theadStyle='bg-table-head [&_th>span]:no-underline'
                    trStyle='hover:bg-table-row-hover [&>td:nth-child(1)]:text-text-secondary-foreground [&>td:nth-child(1)]:text-xs [&>td:nth-child(1)]:font-mono [&>td:nth-child(3)]:text-center [&>td:nth-child(3)]:text-nowrap'
                    trClick={row => navigate('/projects/' + projectIdData.code + '/articles/' + (row.getValue('article_business_id') as SparqlQueryResultObject_Binding).value)}
                />
            </TableWrapper>
        }
    </>
}