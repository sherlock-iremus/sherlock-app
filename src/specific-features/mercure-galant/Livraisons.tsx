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

const columnHelper = createColumnHelper<SparqlQueryResultObject_Binding>()

const columns = [
    columnHelper.accessor('livraison_business_id', {
        cell: _ => _.getValue().value,
        header: _ => <span className='underline'>Date</span>,
    }),
    columnHelper.accessor('livraison_title', {
        cell: _ => _.getValue().value,
        header: _ => <span className='underline'>Titre</span>,
    }),
    columnHelper.accessor('livraison_subtitle', {
        cell: _ => _.getValue()?.value,
        header: _ => <span className='underline'>Sous-titre</span>,
    }),
    columnHelper.accessor('livraison_n_articles', {
        cell: _ => _.getValue().value,
        header: _ => <span className='underline'>Nb d'articles</span>,
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
        <div className='bg-background p-6 text-foreground light'>
            {isSuccess && <>
                {makeH2(`Liste des ${data?.results?.bindings.length} livraisons`, <PiBooksDuotone />, query)}
                <table>
                    <thead>
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
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
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