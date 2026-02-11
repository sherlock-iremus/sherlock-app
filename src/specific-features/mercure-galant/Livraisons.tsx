import SherlockBar from '@/components/deco/SherlockBar'
import { makeH2 } from '@/components/layout/markupHelpers'
import ProjectHeader from '@/components/layout/ProjectHeader'
import { useGetProjectByCodeQuery } from '@/hooks/sherlockSparql'
import { useLivraisonsQuery } from '@/specific-features/mercure-galant/hooks_sparql'
import { extractProjectIdData, getProjecCodeFromLocation } from '@/utils/project'
import { PiBooksDuotone } from "react-icons/pi"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useLocation, useNavigate } from 'react-router-dom'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import TableWrapper from '@/components/layout/TableWrapper'

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

    const table = useReactTable({
        data: data?.results.bindings || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

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
                    <table className='p-6 [&_th,&_td]:p-3 font-serif text-sm [&_th]:text-left'>
                        <thead className='bg-table-head [&_th>span]:no-underline'>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}
                                    className='hover:bg-table-row-hover'
                                    onClick={() => navigate('/projects/' + projectCode + '/livraisons/' + row.getValue('livraison_business_id').value)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className={cell.column.id === 'livraison_n_articles' ? 'text-center' : ''}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableWrapper>
                {/* <Table
                    aria-label="Livraisons du Mercure Galant"
                    radius='none'
                    className='font-serif'
                    onRowAction={(key) => navigate('/projects/' + projectCode + '/livraisons/' + key)}
                >
                    <TableHeader>
                        <TableColumn>Date</TableColumn>
                        <TableColumn>Titre</TableColumn>
                        <TableColumn>Sous-titre</TableColumn>
                        <TableColumn>Nb d'articles</TableColumn>
                    </TableHeader>
                    <TableBody items={data?.results.bindings}>
                        {(item) => {
                            return <TableRow
                                className='hover:bg-gray-100'
                                key={item['livraison_business_id'].value}>
                                <TableCell className='align-top whitespace-nowrap'>{item['livraison_business_id'].value.slice(0, 7)}</TableCell>
                                <TableCell className='align-top'>{item['livraison_title'].value}</TableCell>
                                <TableCell className='align-top'>{item['livraison_subtitle']?.value}</TableCell>
                                <TableCell className='text-center align-top'>{item['n_articles'].value}</TableCell>
                            </TableRow>
                        }}
                    </TableBody>
                </Table> */}
            </>}
        </div>
    </>
}