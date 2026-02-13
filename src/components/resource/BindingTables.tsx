import { getReadableClass, getReadablePredicate, makeClickablePrefixedUri, makeNonClickablePrefixedUri } from '@/components/resource/TriplesDisplayHelpers'
import { linkStyles } from '@/styles/variants/link';
import { LRLPIndexedBindings } from '@/utils/bindingsHelpers'
import { Tooltip } from '@heroui/react'
import React, { ReactNode } from 'react'
import Markdown from 'react-markdown'
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding, SparqlQueryResultObject_Variable } from 'sherlock-rdf/lib/sparql-result'
import { tv } from 'tailwind-variants'
import BasicTanStackTable from '../common/BasicTanStackTable'
import { createColumnHelper } from '@tanstack/react-table'
import TableWrapper from '../layout/TableWrapper'
import { Link } from '@heroui/react';

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
// HELPERS
//
////////////////////////////////////////////////////////////////////////////////////////////////////

type RowData = {
    p: ReactNode
    v: ReactNode
    v_md: ReactNode
}

function displayClassOrProperty(x: string): ReactNode {
    const pu = makePrefixedUri(x)
    const humanReadablePredicate = getReadablePredicate(pu)
    const rdfPredicate = <span className={uriData()}>{makeNonClickablePrefixedUri(pu, '')}</span>

    return humanReadablePredicate
        ? <Tooltip delay={0}>
            <Tooltip.Trigger>
                <span className={humanReadable()}>{humanReadablePredicate}</span>
            </Tooltip.Trigger>
            <Tooltip.Content className={rdfTypeTooltip()}>
                {rdfPredicate}
            </Tooltip.Content>
        </Tooltip>
        : rdfPredicate
}

function makeRowFromBinding(binding: SparqlQueryResultObject_Binding) {
    const x: RowData = { p: undefined, v: undefined, v_md: undefined }

    function processClass(className: string) {
        const pu = makePrefixedUri(className)
        const humanReadableClass = getReadableClass(pu)
        const rdfPredicate = <span className={uriData()}>{makeNonClickablePrefixedUri(pu, '')}</span>

        return humanReadableClass
            ? <Tooltip delay={0}>
                <Tooltip.Trigger>
                    <span className={humanReadable()}>{humanReadableClass}</span>
                </Tooltip.Trigger>
                <Tooltip.Content className={rdfTypeTooltip()}>
                    {rdfPredicate}
                </Tooltip.Content>
            </Tooltip>
            : rdfPredicate
    }

    function processV() {
        function makeLabel(v: SparqlQueryResultObject_Variable) {
            if (v.value.startsWith('http://') || v.value.startsWith('https://')) {
                return <Link
                    className={linkStyles({ textSize: 'sm', fontWeight: 'normal' })}
                    href={v.value}
                    target='_blank'
                >
                    {v.value}
                </Link>
            }

            return (
                <span className={`${literal()}`}>
                    {v.value}
                </span>
            )
        }

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
                        <Link
                            className={linkStyles({ textSize: 'sm', fontWeight: 'normal' })}
                            href={'/?resource=' + binding['r_type_type'].value}
                            target='_blank'
                        >
                            {binding['r_type_type_label'].value}
                        </Link>
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
        x.v = binding.markdown.value == 'true'
            ? <span className={literal()}><Markdown components={{
                a: ({ node, ...props }) => (
                    <a {...props} className='text-link hover:text-link_hover' />
                )
            }}>{binding['value'].value}</Markdown></span>
            : <span className={literal()}>{binding['value'].value}</span>
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

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// COMPONENTS
//
////////////////////////////////////////////////////////////////////////////////////////////////////

interface BindingsTableProps {
    bindings: SparqlQueryResultObject_Binding[],
    slots?: object,
    removeWrapper?: boolean,
}

export const BindingsTable: React.FC<BindingsTableProps> = ({ bindings }) => {
    const rows = bindings.map(makeRowFromBinding).filter(x => x.p && x.v)

    const columnHelper = createColumnHelper<RowData>()
    const columns = [
        columnHelper.accessor('p', { cell: x => x.getValue() }),
        columnHelper.accessor('v', { cell: x => x.getValue() }),
        columnHelper.accessor('v_md', { cell: x => x.getValue() }),
    ]

    return <TableWrapper>
        <BasicTanStackTable
            data={rows}
            columns={columns}
            showHeader={false}
            trStyle='border-b border-b-data-table-line last:border-none'
            tdStyle={`pr-3 pl-3 pt-1 pb-1 last:pr-0 ${textSize} align-top`}
        />
    </TableWrapper>
}

interface LinkedResourcesBindingsTableProps {
    bindings: LRLPIndexedBindings
}

export const LinkedResourcesBindingsTable: React.FC<LinkedResourcesBindingsTableProps> = ({ bindings }) => {
    let content: any[] = []

    for (const [linkingPredicate, linkingPredicateData] of Object.entries(bindings)) {
        for (const [linkedResource, bindingsList] of Object.entries(linkingPredicateData)) {
            const x = <>
                <tr>
                    <td className={uriData()}>{displayClassOrProperty(linkingPredicate)}</td>
                    <td className={uriData()}>{makeClickablePrefixedUri(linkedResource, makePrefixedUri(linkedResource), textSize)}</td>
                </tr>
                <tr className='border-b border-b-data_table_line last:border-none'>
                    <td>&nbsp;</td>
                    <td>
                        <BindingsTable
                            bindings={bindingsList}
                            slots={{ base: 'mb-2', wrapper: 'py-1 px-3', td: 'p-0' }}
                            removeWrapper={false}
                        />
                    </td>
                </tr>
            </>

            content.push(x)
        }
    }

    return <table>
        <tbody>
            {content}
        </tbody>
    </table>
}