import BasicTanStackTable from "@/components/common/BasicTanStackTable"
import { makeH2 } from "@/components/layout/markupHelpers"
import TableWrapper from "@/components/layout/TableWrapper"
import { ProjectIdData } from "@/utils/project"
import { ColumnDef } from "@tanstack/react-table"
import { PiNotebookDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { useLivraisonQuery } from './hooks_sparql'

interface Props {
    projectIdData: ProjectIdData
    resourceBusinessId: string
}

const columns: ColumnDef<SparqlQueryResultObject_Binding>[] = [
    {
        id: 'article_business_id',
        header: "Identifiant",
        accessorFn: (x: SparqlQueryResultObject_Binding) => x['article_business_id'].value,
    },
    {
        id: 'livraison_subtitle',
        header: "Titres de l'article",
        accessorFn: (x: SparqlQueryResultObject_Binding) => ({
            title_forge: x['title_forge']?.value,
            title_courant: x['title_courant']?.value,
            title_paratexte: x['title_paratexte']?.value,
        }),
        cell: ({ getValue }) => {
            const { title_forge, title_courant, title_paratexte } = getValue<{ title_forge: string; title_courant: string; title_paratexte: string }>()
            return <div className='flex flex-col'>
                {title_forge && <div>{title_forge} <span className='pl-1 font-mono text-text-secondary-foreground text-xs'>[titre forgé]</span></div>}
                {title_courant && <div>{title_courant} <span className='pl-1 font-mono text-text-secondary-foreground text-xs'>[titre courant]</span></div>}
                {title_paratexte && <div>{title_paratexte} <span className='pl-1 font-mono text-text-secondary-foreground text-xs'>[titre dans le paratexte]</span></div>}
            </div >
        }
    },
    {
        id: 'pagination',
        header: "Pagination",
        accessorFn: (x: SparqlQueryResultObject_Binding) => x['pagination']?.value,
    }
]

export default function ({ projectIdData, resourceBusinessId }: Props) {
    const navigate = useNavigate()
    const { data, query } = useLivraisonQuery(resourceBusinessId || '')

    return <>
        {makeH2(`Contenu de la livraison (${data?.results?.bindings.length} articles)`, <PiNotebookDuotone />, query)}
        {
            data?.results.bindings && <TableWrapper>
                <BasicTanStackTable
                    data={data.results.bindings}
                    columns={columns as ColumnDef<unknown, any>[]}
                    tableStyle='p-6 [&_th,&_td]:p-2 font-serif text-sm [&_th:nth-child(1)]:text-left [&_th:nth-child(2)]:text-left'
                    theadStyle='bg-table-head [&_th>span]:no-underline'
                    trStyle='hover:bg-table-row-hover [&>td:nth-child(1)]:text-text-secondary-foreground [&>td:nth-child(1)]:text-xs [&>td:nth-child(1)]:font-mono [&>td:nth-child(3)]:text-center [&>td:nth-child(3)]:text-nowrap'
                    trClick={row => navigate('/projects/' + projectIdData.code + '/articles/' + row.getValue('article_business_id'))}
                    thStyle={""}
                    tbodyStyle={""}
                    tdStyle={""}
                    showHeader={true}
                />
            </TableWrapper>
        }
    </>
}