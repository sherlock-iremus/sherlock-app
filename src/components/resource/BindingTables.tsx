import { getReadableClass, getReadablePredicate, makeClickablePrefixedUri, makeNonClickablePrefixedUri } from '@/components/resource/TriplesDisplayHelpers';
import { linkStyles } from '@/styles/variants/link';
import { LRLPIndexedBindings } from '@/utils/bindingsHelpers';
import { Link, Tooltip } from '@heroui/react';
import { ColumnDef } from '@tanstack/react-table';
import React, { ReactNode } from 'react';
import Markdown from 'react-markdown';
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes';
import { SparqlQueryResultObject_Binding, SparqlQueryResultObject_Variable } from 'sherlock-rdf/lib/sparql-result';
import { tv } from 'tailwind-variants';
import BasicTanStackTable from '../common/BasicTanStackTable';
import TableWrapper from '../layout/TableWrapper';

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

export function displayClassOrProperty(x: string): ReactNode {
    const pu = makePrefixedUri(x)
    const humanReadablePredicate = getReadablePredicate(pu)
    const rdfPredicate = <span className={uriData()}>{makeNonClickablePrefixedUri(pu, '')}</span>

    return humanReadablePredicate
        ? <Tooltip delay={0}>
            <Tooltip.Trigger className='inline'>
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
                <Tooltip.Trigger className='inline'>
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
    wrapper: boolean
}

const columns: ColumnDef<RowData>[] = [
    {
        accessorKey: 'p',
        cell: info => info.getValue()
    },
    {
        accessorKey: 'v',
        cell: info => info.getValue()
    },
    {
        accessorKey: 'v_md',
        cell: info => info.getValue()
    },
]

export function BindingsTable({ bindings, wrapper = false }: BindingsTableProps) {
    const rows = bindings.map(makeRowFromBinding).filter(x => x.p && x.v)

    const table = <BasicTanStackTable
        data={rows}
        columns={columns as ColumnDef<unknown, any>[]}
        showHeader={false}
        trStyle='border-b border-b-data-table-line last:border-none'
        tdStyle={`pr-3 pl-3 pt-1 pb-1 last:pr-0 ${textSize} align-top`}
        tableStyle={''}
        theadStyle={''}
        thStyle={''}
        tbodyStyle={''}
        trClick={() => { }}
    />

    return wrapper ? <TableWrapper>{table}</TableWrapper> : table
}

interface LinkedResourcesBindingsTableProps {
    bindings: LRLPIndexedBindings
}

export const LinkedResourcesBindingsTable: React.FC<LinkedResourcesBindingsTableProps> = ({ bindings }) => {
    let content: any[] = []

    for (const [linkingPredicate, linkingPredicateData] of Object.entries(bindings)) {
        for (const [linkedResource, bindingsList] of Object.entries(linkingPredicateData)) {
            const x = <div key={linkedResource} className='mt-3 first:mt-0'>
                <div className='inline-block bg-table-head px-3 py-2 border border-text-text-secondary-foreground border-b-0 font-medium text-sm'>
                    <div className='flex items-center gap-2'>
                        {displayClassOrProperty(linkingPredicate)}
                        {makeClickablePrefixedUri(linkedResource, makePrefixedUri(linkedResource), 'sm')}
                    </div>
                </div>
                <TableWrapper>
                    <BindingsTable bindings={bindingsList} wrapper={false} />
                </TableWrapper>
            </div>

            content.push(x)
        }
    }

    return content
}