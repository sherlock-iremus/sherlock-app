import Link from '@/components/Link'
import clsx from 'clsx'
import { PiGlobeDuotone, PiLinkDuotone } from 'react-icons/pi'
import { PrefixedUri, makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding, SparqlQueryResultObject_Variable } from 'sherlock-rdf/lib/sparql-result'
import { tv } from 'tailwind-variants'
import { getReadablePredicate, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'

export const predicateFont = 'font-light text-gray-500 font-serif text-normal'

const tr = tv({
    base: 'border-b border-b-data_table_line last:border-none'
})

const predicate_td = tv({
    base: clsx(predicateFont, 'align-baseline pr-6 pl-1 whitespace-nowrap')
})

const object_td = tv({
    base: 'align-baseline font-normal font-serif pr-6 pl-1 py-0.5'
})

const uri = tv({
    base: 'font-mono font-normal text-sm'
})

export function displayLabel(v: SparqlQueryResultObject_Variable) {
    if (v.value.startsWith('http://') || v.value.startsWith('https://')) {
        return (
            <span className='font-mono text-gray-400 text-xs tracking-tighter'>
                {v.value}
            </span>
        )
    }

    return (
        <span className='font-serif'>
            {v.value}
            {v['xml:lang'] && <span className='lang'>{' @' + v['xml:lang']}</span>}
        </span>
    )
}

export function makeLinkedResourceTypesFragment(b: SparqlQueryResultObject_Binding) {
    let types_key = 0
    const getKey = () => 'types_key_' + types_key++

    return <span className='font-serif text-gray-400'>
        {b['r_type'] && <>
            <span> (est un </span>
            <span className='font-mono text-sm'>
                {makeNonClickablePrefixedUri(
                    makePrefixedUri(b['r_type'].value),
                    getKey()
                )
                }
            </span>
        </>}

        {b['r_type_type'] && <>
            <span> de type </span>
            « <Link key={getKey()} href={'/?resource=' + b['r_type_type'].value}>
                {b['r_type_type_label'].value}
            </Link> »
        </>}
        <span>)</span>
    </span>
}

export default function ({ bindings, startLines }: { bindings: SparqlQueryResultObject_Binding[], startLines?: string[][], className?: string }) {
    return <table className={clsx('', 'border-data_table_border')}>
        <tbody>
            {startLines?.map((line: string[], i: number) => {
                return <tr className={tr()} key={i}>
                    <td className={`${predicate_td()}`}>
                        {line[0]}
                    </td>
                    <td className={`${object_td()}`}>
                        {
                            line[1].startsWith('http')
                                ? <span className={`${uri()}`}><Link href={line[1]} >{line[1]}</Link></span>
                                : line[1]}
                    </td>
                </tr>
            })}
            {bindings.map((b: SparqlQueryResultObject_Binding, i: number) => {
                const p = b['p'] ? makePrefixedUri(b['p'].value) : new PrefixedUri('', '')
                return <tr className={tr()} key={i}>
                    {b['property'] ?
                        <>
                            <td className={`${predicate_td()}`}>
                                {b['property'].value}
                            </td>
                            <td className={`${object_td()}`}>
                                {b['value'].value}
                            </td>
                        </>
                        :
                        <>
                            {/* PRÉDICAT URI */}
                            <td className={`${predicate_td()}`}>
                                {getReadablePredicate(p) && <>
                                    {getReadablePredicate(p)}
                                    <span className={`${uri()} ml-2`}>
                                        <span className='text-data_table_parenthesis'>(</span>
                                        {makeNonClickablePrefixedUri(p)}
                                        <span className='text-data_table_parenthesis'>)</span>
                                    </span>
                                </>}
                            </td>
                            {/* OBJET */}
                            <td className={`${object_td()}`}>
                                {b['label'] && <span>
                                    {displayLabel(b['label'])}
                                </span>}
                                {b['label'] && <span>
                                    {b['r'] && <Link href={'/?resource=' + b['r'].value}>
                                        <PiLinkDuotone className='inline mb-1 ml-1 text-xl' />
                                    </Link>}
                                </span>}
                                {b['label']
                                    && b['label'].value.startsWith('http')
                                    && !b['label'].value.startsWith('http://data-iremus.huma-num.fr/graph/')
                                    && <Link href={b['label'].value} target='_blank'>
                                        <PiGlobeDuotone className='inline mb-1 ml-1 text-xl' />
                                    </Link>}
                                {!b['label'] && b['r'] && <span className={`${uri()}`}>{makeNonClickablePrefixedUri(
                                    makePrefixedUri(b['r'].value)
                                )}</span>}
                                {b['r_type'] && makeLinkedResourceTypesFragment(b)}
                            </td>
                        </>
                    }
                </tr>
            })}
        </tbody>
    </table>
}