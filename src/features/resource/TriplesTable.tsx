import clsx from 'clsx'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from '@heroui/table'
import React, { JSX } from 'react'
import { tv } from 'tailwind-variants'
import { PrefixedUri, makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { getReadablePredicate, makeClickablePrefixedUri, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'

////////////////////////////////////////////////////////////////////////////////////////////////////
// STYLES
////////////////////////////////////////////////////////////////////////////////////////////////////

const p = tv({
    base: 'font-light'
})

const uriData = tv({
    base: 'font-light'
})

const literal = tv({
    base: 'text-stone-700 font-serif'
})

/*
header.textSection margin-bottom: 2em;
header.textSection>h2 @apply font-serif font-bold text-2xl;
.section-font @apply font-["Albertus"] font-[350] font-bold uppercase;
.section-font-predicate @apply font-mono lowercase;
.linked_entity_icon @apply text-stone-400;
.lang @apply text-stone-400;
.icon @apply text-pink-500;
*/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////////////////////////////////////////////////

interface Props {
    bindings: SparqlQueryResultObject_Binding[],
    humanReadablePropertiesColumn: boolean,
    linkingPredicate?: any,
    linkedResource?: any,
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
            rowData.hrp = <span className={p()} />
            rowData.p = <span>{binding['property'].value}</span>
            rowData.v = <span>{binding['value'].value}</span>
        }
        else if (binding['p']) {
            const predicate = binding['p'] ? makePrefixedUri(binding['p'].value) : new PrefixedUri('', '')
            rowData.hrp = <span className={p()}>{getReadablePredicate(predicate)}</span>
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
// COMPONENT
////////////////////////////////////////////////////////////////////////////////////////////////////

const TriplesTable: React.FC<Props> = ({ bindings, humanReadablePropertiesColumn, linkingPredicate, linkedResource }) => {
    const columns = makeColumns(humanReadablePropertiesColumn)
    const rows = transformBindingsToHeroTableData(bindings)


    const mainTable = (slots: object) => <Table
        aria-label='triples table'
        isCompact={true}
        hideHeader={true}
        removeWrapper={linkingPredicate && linkedResource}
        classNames={slots}
    >
        <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
            {(item: any) => (
                <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                </TableRow>
            )}
        </TableBody>
    </Table>

    if (linkingPredicate && linkedResource) {
        return <Table
            aria-label='triple table'
            hideHeader={true}
        >
            <TableHeader>
                <TableColumn>lr</TableColumn>
                <TableColumn>lp</TableColumn>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>{makeNonClickablePrefixedUri(makePrefixedUri(linkingPredicate))}</TableCell>
                    <TableCell>{makeClickablePrefixedUri(linkedResource, makePrefixedUri(linkedResource))}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>{mainTable({ td: "p-0" })}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    }
    else {
        return mainTable({})
    }
}

export default TriplesTable
