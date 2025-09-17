import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@heroui/table'
import React, { JSX } from 'react'
import { PrefixedUri, makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding, SparqlQueryResultObject_Variable } from 'sherlock-rdf/lib/sparql-result'
import { tv } from 'tailwind-variants'
import { getReadablePredicate, makeClickablePrefixedUri, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { LRLPIndexedBindings } from '@/utils/bindings_helpers'
import Link from '@/components/Link'

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// STYLES
//
////////////////////////////////////////////////////////////////////////////////////////////////////

const p = tv({
    base: 'font-mono'
})

const hrp = tv({
    base: 'font-sans font-light lowercase'
})

const uriData = tv({
    base: 'font-mono'
})

const literal = tv({
    base: 'font-serif text-stone-700 font-medium text-base'
})

const type = tv({
    base: 'text-texte_annexe'
})

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// TYPES
//
////////////////////////////////////////////////////////////////////////////////////////////////////

interface BindingsTableProps {
    bindings: SparqlQueryResultObject_Binding[],
    humanReadablePropertiesColumn: boolean,
    slots?: object,
    removeWrapper?: boolean,
}

interface LinkedResourcesBindingsTableProps {
    bindings: LRLPIndexedBindings
}

type RowData = {
    key: string,
    hrp?: JSX.Element,
    p?: JSX.Element
    v?: JSX.Element
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// HELPERS
//
////////////////////////////////////////////////////////////////////////////////////////////////////

function makeColumns(humanReadablePropertiesColumn: boolean) {
    const columns: any[] = [
        { key: 'p', label: 'P' },
        { key: 'v', label: 'V' },
    ]
    if (humanReadablePropertiesColumn) {
        columns.unshift({ key: 'hrp', label: 'HRP' })
    }
    columns.push()
    return columns
}

function makeLabel(v: SparqlQueryResultObject_Variable) {
    if (v.value.startsWith('http://') || v.value.startsWith('https://')) {
        return <Link href={v.value} target='_blank'>{v.value}</Link>
    }

    return (
        <span className={`${literal()}`}>
            {v.value}
            {v['xml:lang'] && <span className='text-texte_annexe'>{' @' + v['xml:lang']}</span>}
        </span>
    )
}

function transformBindingsToHeroTableData(bindings: SparqlQueryResultObject_Binding[]): any[] {
    const tableData: RowData[] = []

    for (let i = 0; i < bindings.length; i++) {
        const binding: SparqlQueryResultObject_Binding = bindings[i]
        const rowData: RowData = { key: i.toString() }

        if (binding['property'] && binding['value']) {
            rowData.hrp = <span className={hrp()} />
            rowData.p = <span className={hrp()}>{binding['property'].value}</span>
            rowData.v = <span className={literal()}>{binding['value'].value}</span>
        }
        else if (binding['p']) {
            const predicate = binding['p'] ? makePrefixedUri(binding['p'].value) : new PrefixedUri('', '')
            rowData.hrp = <span className={hrp()}>{getReadablePredicate(predicate)}</span>
            rowData.p = <span className={p()}>{makeNonClickablePrefixedUri(predicate)}</span>

            let mainPart = null
            if (binding['label']) {
                mainPart = makeLabel(binding['label'])
            }
            else {
                mainPart = <span className={uriData()}>{makeNonClickablePrefixedUri(makePrefixedUri(binding['r'].value))}</span>
            }
            rowData['v'] = <>
                {mainPart}
                {/* <span>{binding['r_type']?.value}</span> */}
                {/* <span>{binding['r_type_type']?.value}</span> */}
                {binding['r_type_type_label'] && <span className={type()}> ({binding['r_type_type_label']?.value})</span>}
            </>
        }

        tableData.push(rowData)
    }

    return tableData
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// COMPONENTS
//
////////////////////////////////////////////////////////////////////////////////////////////////////

export const BindingsTable: React.FC<BindingsTableProps> = ({ bindings, humanReadablePropertiesColumn, slots = {}, removeWrapper = false }) => {
    const columns = makeColumns(humanReadablePropertiesColumn)
    const rows = transformBindingsToHeroTableData(bindings)

    return <Table
        aria-label='bindings table'
        classNames={slots}
        hideHeader={true}
        isCompact={true}
        radius='none'
        removeWrapper={removeWrapper}
    >
        <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
            {(item: any) => (
                <TableRow key={item.key} className='border-b border-b-data_table_line last:border-none'>
                    {(columnKey) => <TableCell className='py-0.5 align-top'>{getKeyValue(item, columnKey)}</TableCell>}
                </TableRow>
            )}
        </TableBody>
    </Table>
}

export const LinkedResourcesBindingsTable: React.FC<LinkedResourcesBindingsTableProps> = ({ bindings }) => {
    return <Table
        aria-label='linked resource bindings table'
        hideHeader={true}
        isCompact={true}
        radius='none'
    >
        <TableHeader>
            <TableColumn>lr</TableColumn>
            <TableColumn>lp</TableColumn>
        </TableHeader>
        <TableBody>
            {Object.entries(bindings).map(([linkingPredicate, linkingPredicateData]) => Object.entries(linkingPredicateData).map(([linkedResource, bindings]) => <>
                <TableRow className='mt-10'>
                    <TableCell className={p()}>{makeNonClickablePrefixedUri(makePrefixedUri(linkingPredicate))}</TableCell>
                    <TableCell className={uriData()}>{makeClickablePrefixedUri(linkedResource, makePrefixedUri(linkedResource))}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>
                        <BindingsTable
                            bindings={bindings}
                            humanReadablePropertiesColumn={true}
                            slots={{ wrapper: 'py-1 px-3', td: 'p-0' }}
                            removeWrapper={false}
                        />
                    </TableCell>
                </TableRow>
            </>
            ))}
        </TableBody>
    </Table>
}

