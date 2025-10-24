import Link from '@/components/buttons-and-links/Link'
import { getReadableClass, getReadablePredicate, makeClickablePrefixedUri, makeNonClickablePrefixedUri } from '@/components/resource/TriplesDisplayHelpers'
import { LRLPIndexedBindings } from '@/utils/bindingsHelpers'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@heroui/table'
import { Tooltip } from '@heroui/tooltip'
import React, { JSX } from 'react'
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding, SparqlQueryResultObject_Variable } from 'sherlock-rdf/lib/sparql-result'
import { tv } from 'tailwind-variants'

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// STYLES
//
////////////////////////////////////////////////////////////////////////////////////////////////////

export const textSize = 'text-sm'

export const humanReadable = tv({
    base: 'font-sans font-light'
})

export const uriData = tv({
    base: 'font-mono'
})

const literal = tv({
    base: 'font-serif text-stone-700 font-medium text-l'
})

export const rdfTypeTooltip = tv({
    base: 'bg-black'
})

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// TYPES
//
////////////////////////////////////////////////////////////////////////////////////////////////////

interface BindingsTableProps {
    bindings: SparqlQueryResultObject_Binding[],
    slots?: object,
    removeWrapper?: boolean,
}

interface LinkedResourcesBindingsTableProps {
    bindings: LRLPIndexedBindings
}

type RowData = {
    key: string
    p?: JSX.Element
    v?: JSX.Element
    v_md?: JSX.Element
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// HELPERS
//
////////////////////////////////////////////////////////////////////////////////////////////////////

function makeColumns() {
    const columns: any[] = [
        { key: 'p', label: 'P' },
        { key: 'v', label: 'V' },
        { key: 'v_md', label: 'V_MD' },
    ]

    return columns
}

function makeLabel(v: SparqlQueryResultObject_Variable) {
    if (v.value.startsWith('http://') || v.value.startsWith('https://')) {
        return <Link className={textSize} href={v.value} target='_blank'>{v.value}</Link>
    }

    return (
        <span className={`${literal()}`}>
            {v.value}
        </span>
    )
}

function displayClassOrProperty(x: string): JSX.Element {
    const pu = makePrefixedUri(x)
    const humanReadablePredicate = getReadablePredicate(pu)
    const rdfPredicate = <span className={uriData()}>{makeNonClickablePrefixedUri(pu, '')}</span>

    return humanReadablePredicate
        ? <Tooltip className={rdfTypeTooltip()} content={rdfPredicate}>
            <span className={humanReadable()}>{humanReadablePredicate}</span>
        </Tooltip>
        : rdfPredicate
}

function makeRow(binding: SparqlQueryResultObject_Binding, i: number): RowData {
    const x: RowData = { key: i.toString() }

    function processClass(className: string) {
        const pu = makePrefixedUri(className)
        const humanReadableClass = getReadableClass(pu)
        const rdfPredicate = <span className={uriData()}>{makeNonClickablePrefixedUri(pu, '')}</span>

        return humanReadableClass
            ? <Tooltip className={rdfTypeTooltip()} content={rdfPredicate}>
                <span className={humanReadable()}>{humanReadableClass}</span>
            </Tooltip>
            : rdfPredicate
    }

    function processV() {
        // Cas d'un prédicat pointant sur une valeur littérale
        if (binding['label'] && !binding['r']) {
            x.v = makeLabel(binding['label'])
            x.v_md = binding['label']['xml:lang'] ? <span className='text-texte_annexe'>{' @' + binding['label']['xml:lang']}</span> : <></>
        }
        // Cas d'un objet de type ressource décrite dans SHERLOCK
        else if (binding['label'] && binding['r'] && binding['r_type']) {
            x.v = makeLabel(binding['label'])
            x.v_md = <>
                {processClass(binding['r_type'].value)}
                {binding['r_type_type'] && binding['r_type_type_label'] &&
                    <>
                        <span className={humanReadable()}> de type </span>
                        <Link className={textSize} href={'/?resource=' + binding['r_type_type'].value} target='_blank'>{binding['r_type_type_label'].value}</Link>
                    </>
                }
            </>
        }
        // Cas d'un objet de type ressource non décrite dans SHERLOCK
        else if (!binding['label'] && binding['r']) {
            x.v = processClass(binding['r'].value)
        }
    }

    // Aspects liés au prédicat
    if (binding['p']) {
        x.p = displayClassOrProperty(binding['p'].value)
    }

    // Cas d'une propriété .1
    if (binding['pc0'] && binding['pc0_type'] && binding['dotOneProperty']) {
        x.p = <span className={humanReadable()}>{binding['e55_label'].value}</span>
        x.v = <span className={literal()}>{binding['value'].value}</span>
    }
    // Cas d'une E13 dont le P140 est la ressource consultée
    else if (binding['p177_label'] && binding['p141']) {
        x.p = <span className={humanReadable()}>{binding['p177_label'].value}</span>
        x.v = <span className={literal()}>{binding['p141'].value}</span>
    }
    // Cas d'un binding identité d'une ressource liée à la ressource consultée
    else if (binding['lp'] && binding['lr']) {
        x.p = displayClassOrProperty(binding['p'].value)
        processV()
    }
    // Cas d'un binding identité de la ressource consultée
    else {
        processV()
    }

    return x
}

function transformBindingsToHeroTableData(bindings: SparqlQueryResultObject_Binding[]): any[] {
    const tableData: RowData[] = []

    for (let i = 0; i < bindings.length; i++) {
        const binding: SparqlQueryResultObject_Binding = bindings[i]
        tableData.push(makeRow(binding, i))
    }

    return tableData
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// COMPONENTS
//
////////////////////////////////////////////////////////////////////////////////////////////////////

export const BindingsTable: React.FC<BindingsTableProps> = ({ bindings, slots = {}, removeWrapper = false }) => {
    const columns = makeColumns()
    const rows = transformBindingsToHeroTableData(bindings).filter(x => x.p && x.v)

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
                    {(columnKey) => <TableCell className={`pr-3 last:pr-0 ${textSize} align-top`}>{getKeyValue(item, columnKey)}</TableCell>}
                </TableRow>
            )}
        </TableBody>
    </Table>
}

export const LinkedResourcesBindingsTable: React.FC<LinkedResourcesBindingsTableProps> = ({ bindings }) => {
    let content: any[] = []

    for (const [linkingPredicate, linkingPredicateData] of Object.entries(bindings)) {
        for (const [linkedResource, bindingsList] of Object.entries(linkingPredicateData)) {
            const x = <>
                <TableRow>
                    <TableCell className={uriData()}>{displayClassOrProperty(linkingPredicate)}</TableCell>
                    <TableCell className={uriData()}>{makeClickablePrefixedUri(linkedResource, makePrefixedUri(linkedResource), textSize)}</TableCell>
                </TableRow>
                <TableRow className='border-b border-b-data_table_line last:border-none'>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>
                        <BindingsTable
                            bindings={bindingsList}
                            slots={{ base: 'mb-2', wrapper: 'py-1 px-3', td: 'p-0' }}
                            removeWrapper={false}
                        />
                    </TableCell>
                </TableRow>
            </>

            content.push(x)
        }
    }

    return <Table
        aria-label='linked resource bindings table'
        hideHeader={true}
        isCompact={true}
        radius='none'
        removeWrapper={true}
    >
        <TableHeader>
            <TableColumn>lr</TableColumn>
            <TableColumn>lp</TableColumn>
        </TableHeader>
        <TableBody>
            {content}
        </TableBody>
    </Table>
}