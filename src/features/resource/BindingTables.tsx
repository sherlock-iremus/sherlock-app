import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@heroui/table'
import clsx from 'clsx'
import React, { JSX } from 'react'
import { PrefixedUri, makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { tv } from 'tailwind-variants'
import { getReadablePredicate, makeClickablePrefixedUri, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { LRLPIndexedBindings } from '@/utils/bindings_helpers'

////////////////////////////////////////////////////////////////////////////////////////////////////
// STYLES
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

/*
header.textSection margin-bottom: 2em;
header.textSection>h2 @apply font-serif font-bold text-2xl;
.section-font @apply font-['Albertus'] font-[350] font-bold uppercase;
.section-font-predicate @apply font-mono lowercase;
.linked_entity_icon @apply text-stone-400;
.lang @apply text-stone-400;
.icon @apply text-pink-500;
*/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TYPES
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
// HELPERS
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

            if (binding['label']) {
                rowData['v'] = <span className={`${literal()}`}>{binding['label'].value}</span>
            }
            else {
                rowData['v'] = <span className={uriData()}>{makeNonClickablePrefixedUri(makePrefixedUri(binding['r'].value))}</span>
            }
        }

        tableData.push(rowData)
    }

    return tableData
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENTS
////////////////////////////////////////////////////////////////////////////////////////////////////

export const BindingsTable: React.FC<BindingsTableProps> = ({ bindings, humanReadablePropertiesColumn, slots = {}, removeWrapper = false }) => {
    const columns = makeColumns(humanReadablePropertiesColumn)
    const rows = transformBindingsToHeroTableData(bindings)

    return <Table
        aria-label='bindings table'
        classNames={slots}
        hideHeader={true}
        isCompact={true}
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
    >
        <TableHeader>
            <TableColumn>lr</TableColumn>
            <TableColumn>lp</TableColumn>
        </TableHeader>
        <TableBody>
            {Object.entries(bindings).map(([linkingPredicate, linkingPredicateData]) => Object.entries(linkingPredicateData).map(([linkedResource, bindings]) => <>
                <TableRow>
                    <TableCell className={p()}>{makeNonClickablePrefixedUri(makePrefixedUri(linkingPredicate))}</TableCell>
                    <TableCell className={uriData()}>{makeClickablePrefixedUri(linkedResource, makePrefixedUri(linkedResource))}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>
                        <BindingsTable
                            bindings={bindings}
                            humanReadablePropertiesColumn={true}
                            slots={{ td: 'p-0' }}
                            removeWrapper={false}
                        />
                    </TableCell>
                </TableRow>
            </>
            ))}
        </TableBody>
    </Table>
}

