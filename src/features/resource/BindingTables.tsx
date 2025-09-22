import Link from '@/components/Link'
import { LRLPIndexedBindings } from '@/utils/bindings_helpers'
import { Link as HeroUiLink, extendVariants } from '@heroui/react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@heroui/table'
import React, { JSX } from 'react'
import { Tooltip } from '@heroui/tooltip'
// import { PiQuestionDuotone } from 'react-icons/pi'
import { PrefixedUri, makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding, SparqlQueryResultObject_Variable } from 'sherlock-rdf/lib/sparql-result'
import { tv } from 'tailwind-variants'
import { getReadablePredicate, getReadableClass, makeClickablePrefixedUri, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// STYLES
//
////////////////////////////////////////////////////////////////////////////////////////////////////

const humanReadable = tv({
    base: 'font-sans font-light'
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

const rdfTypeTooltip = tv({
    base: 'bg-black'
})

const TypeLink = extendVariants(HeroUiLink, {
    defaultVariants: {
        class: 'text-texte_annexe font-mono cursor-default hover:text-link_hover transition-colors tracking-tighter'
    }
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
        return <Link href={v.value} target='_blank'>{v.value}</Link>
    }

    return (
        <span className={`${literal()}`}>
            {v.value}
        </span>
    )
}

function makeRow(binding: SparqlQueryResultObject_Binding, i: number): RowData {
    const x: RowData = { key: i.toString() }

    function processPredicate(predicate: string) {
        const pu = makePrefixedUri(predicate)
        const humanReadablePredicate = getReadablePredicate(pu)
        const rdfPredicate = <span className={uriData()}>{makeNonClickablePrefixedUri(pu)}</span>

        return humanReadablePredicate
            ? <Tooltip className={rdfTypeTooltip()} content={rdfPredicate}>
                <span className={humanReadable()}>{humanReadablePredicate}</span>
            </Tooltip>
            : rdfPredicate
    }

    function processClass(className: string) {
        const pu = makePrefixedUri(className)
        const humanReadableClass = getReadableClass(pu)
        const rdfPredicate = <span className={uriData()}>{makeNonClickablePrefixedUri(pu)}</span>

        return humanReadableClass
            ? <Tooltip className={rdfTypeTooltip()} content={rdfPredicate}>
                <span className={humanReadable()}>{humanReadableClass}</span>
            </Tooltip>
            : rdfPredicate
    }

    function caca() {
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
                        <Link href={'/?resource=' + binding['r_type_type'].value} target='_blank'>{binding['r_type_type_label'].value}</Link>
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
        x.p = processPredicate(binding['p'].value)
    }

    // Cas d'une propriété .1
    if (binding['pc0'] && binding['pc0_type'] && binding['dotOneProperty']) {
        x.p = <span className={humanReadable()}>{binding['e55_label'].value}</span>
        x.v = <span className={literal()}>{binding['value'].value}</span>
    }
    // Cas d'une E13 dont le P140 est la ressource consultée
    else if (false) {

    }
    // Cas d'un binding identité d'une ressource liée à la ressource consultée
    else if (binding['lp'] && binding['lr']) {
        x.p = processPredicate(binding['p'].value)
        caca()
    }
    // Cas d'un binding identité de la ressource consultée
    else {
        caca()
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
                    {(columnKey) => <TableCell className='align-top'>{getKeyValue(item, columnKey)}</TableCell>}
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
            {Object.entries(bindings).map(([linkingPredicate, linkingPredicateData]) => Object.entries(linkingPredicateData).map(([linkedResource, bindings]) => {
                return <>
                    <TableRow className='mt-10'>
                        <TableCell className={uriData()}>{makeNonClickablePrefixedUri(makePrefixedUri(linkingPredicate))}</TableCell>
                        <TableCell className={uriData()}>{makeClickablePrefixedUri(linkedResource, makePrefixedUri(linkedResource))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>
                            <BindingsTable
                                bindings={bindings}
                                slots={{ wrapper: 'py-1 px-3', td: 'p-0' }}
                                removeWrapper={false}
                            />
                        </TableCell>
                    </TableRow>
                </>
            }
            ))}
        </TableBody>
    </Table>
}

