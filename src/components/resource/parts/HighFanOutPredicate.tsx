import YasguiButton from "@/components/common/YasguiButton"
import TableWrapper from "@/components/layout/TableWrapper"
import { useListLinkedResources } from "@/hooks/sherlockSparql"
import { ProjectIdData } from "@/utils/project"
import { Button, Input } from "@heroui/react"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { displayClassOrProperty } from "../BindingTables"

const MIN_N_LINES = 10

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
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(MIN_N_LINES);

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
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase()
      return Object.values(row.original).some(value => String(value.value).toLowerCase().includes(search))
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    state: {
      globalFilter,
      pagination: { pageIndex, pageSize },
    }
  })

  ////////////////////////////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////////////////////////////

  return <div className='mt-3 first:mt-0'>
    <div className='inline-block bg-table-head px-3 py-2 border border-text-text-secondary-foreground border-b-0 text-sm'>
      <div className='flex items-center gap-2'>
        {displayClassOrProperty(predicateUri)}
      </div>
    </div>
    <TableWrapper>
      <div className="">
        <div className="flex justify-between gap-3">
          <Input
            className="rounded-none w-full"
            placeholder="Chercher…"
            type="email"
            onChange={(e) => setGlobalFilter(e.target.value)}
            value={globalFilter ?? ""}
          />
          <YasguiButton sparqlQuery={query} />
        </div>
        <div className="flex items-center my-3">
          <Button
            className='rounded-none'
            variant="outline"
            onClick={() => table.firstPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            className="disabled:opacity-50 rounded-none"
            variant="outline"
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            className="disabled:opacity-50 rounded-none"
            variant="outline"
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            className='rounded-none'
            variant="outline"
            onClick={() => table.lastPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
          <span className="ml-2 text-text-secondary-foreground text-sm">
            page{" "}{table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
          </span>
          <div className="flex-1" />
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0); // reset à la première page
            }}
            className="p-1 border rounded-none text-text-secondary-foreground text-sm"
          >
            {[MIN_N_LINES, MIN_N_LINES * 2, MIN_N_LINES * 5].map((size) => (
              <option key={size} value={size}>
                {size} lignes
              </option>
            ))}
          </select>
        </div>
        <table className='[&_th,&_td]:p-2 w-full font-serif text-sm'>
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
