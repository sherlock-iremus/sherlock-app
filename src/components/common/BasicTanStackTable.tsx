import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'

type RowFn = (row: Row<unknown>) => void

type BasicTanStackTableProps = {
    data: unknown[],
    columns: ColumnDef<unknown, any>[],
    tableStyle: string,
    theadStyle: string,
    tbodyStyle: string,
    trStyle: string,
    tdStyle: string,
    showHeader: boolean,
    trClick: RowFn
}

export default ({
    data = [],
    columns = [],
    tableStyle = '',
    theadStyle = '',
    tbodyStyle = '',
    trStyle = '',
    tdStyle = '',
    showHeader = true,
    trClick
}: BasicTanStackTableProps) => {
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

    return <table className={`w-full table-auto ${tableStyle}`}>
        {showHeader && <thead className={theadStyle}>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                )}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>}
        <tbody className={tbodyStyle}>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={trStyle} onClick={trClick ? () => trClick(row) : undefined}>
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={tdStyle}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table >
}