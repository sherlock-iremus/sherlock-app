import YasguiButton from "@/components/common/YasguiButton"
import TableWrapper from "@/components/layout/TableWrapper"
import { useListLinkedResources } from "@/hooks/sherlockSparql"
import { ProjectIdData } from "@/utils/project"
import { Input } from "@heroui/react"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { displayClassOrProperty } from "../BindingTables"

export default function HighFanOutPredicate({ n, predicateUri, resourceUri, projectIdData }: {
  n: number
  predicateUri: string
  resourceUri: string
  projectIdData: ProjectIdData
}) {
  const navigate = useNavigate()

  ////////////////////////////////////////////////////////////////////////////////
  // SETUP
  ////////////////////////////////////////////////////////////////////////////////

  const { data, query } = useListLinkedResources(resourceUri, predicateUri)

  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<SparqlQueryResultObject_Binding>[] = [
    {
      header: () => 'Identifiant',
      id: 'business_id',
      accessorKey: 'business_id.value',
      enableGlobalFilter: true,
    },
    {
      header: () => 'Label',
      id: 'label',
      accessorKey: 'label.value',
      enableGlobalFilter: true,
    },
  ]

  const table = useReactTable({
    columns,
    data: data?.results.bindings || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase()
      return Object.values(row.original).some(value => String(value.value).toLowerCase().includes(search))
    },
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    }
  })

  ////////////////////////////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////////////////////////////

  return <div className='mt-3 first:mt-0'>
    <div className='inline-block bg-table-head px-3 py-2 border border-text-text-secondary-foreground border-b-0'>
      <div className='flex items-center gap-2'>
        {displayClassOrProperty(predicateUri)}
      </div>
    </div>
    <TableWrapper>
      <div className="">
        <div className="flex justify-between gap-3">
          <Input
            className="rounded-none w-full"
            label="Email"
            placeholder="Chercher…"
            type="email"
            variant="bordered"
            onChange={(e) => setGlobalFilter(e.target.value)}
            value={globalFilter ?? ""}
          />
          <YasguiButton sparqlQuery={query} />
        </div>
        <table className='mt-3 [&_th,&_td]:p-2 font-serif text-sm'>
          <thead className="bg-table-head [&_th:nth-child(2)]:text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
              <tr
                key={row.id}
                className="hover:bg-table-row-hover [&>td:nth-child(1)]:font-mono [&>td:nth-child(1)]:text-text-secondary-foreground [&>td:nth-child(1)]:text-xs"
                onClick={() => {
                  navigate('/projects/' + projectIdData.code + '/articles/' + row.getValue('business_id'))
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrapper>
  </div>
}
