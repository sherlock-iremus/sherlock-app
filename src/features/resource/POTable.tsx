import { Link } from 'react-router-dom'
import { SparqlQueryResultObject_Variable, SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { PrefixedUri, makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { getReadablePredicate, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { PiGlobeDuotone, PiLinkDuotone } from 'react-icons/pi'

export function displayLabel(v: SparqlQueryResultObject_Variable) {
    if (v.value.startsWith('http://') || v.value.startsWith('https://')) {
        return (
            <span className='text-gray-400 text-xs tracking-tighter'>
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

    return <span className='font-serif isa'>
        {b['r_type'] && <>
            <span> (est un </span>
            <span className='font-mono text-sm'>
                {makeNonClickablePrefixedUri(
                    makePrefixedUri(b['r_type'].value),
                    [
                        'text-prefixed_uri_prefix_lightbg',
                        'text-prefixed_uri_prefix_lightbg',
                        'text-prefixed_uri_local_name_lightbg'
                    ],
                    getKey()
                )
                }
            </span>
        </>}

        {b['r_type_type'] && <>
            <span> de type </span>
            « <Link key={getKey()} to={'/?resource=' + b['r_type_type'].value}>
                {b['r_type_type_label'].value}
            </Link> »
        </>}
        <span>)</span>
    </span>
}

export default function ({ bindings }: { bindings: SparqlQueryResultObject_Binding[] }) {
    return <table>
        <tbody>
            {bindings.map((b: SparqlQueryResultObject_Binding, i: number) => {
                const p = b['p'] ? makePrefixedUri(b['p'].value) : new PrefixedUri('', '')
                return <tr className='border-b border-b-data_table_border last:border-none' key={i}>
                    {b['property'] ?
                        <>
                            <td className='pr-11 pl-0 font-serif font-medium align-baseline'>
                                {b['property'].value}
                            </td>
                            <td className='pr-11 pl-0 font-serif align-baseline'>
                                {b['value'].value}
                            </td>
                        </>
                        :
                        <>
                            {/* PRÉDICAT URI */}
                            <td className='pr-11 pl-0 font-serif align-baseline whitespace-nowrap'>
                                {getReadablePredicate(p) && <span className='font-medium'>{getReadablePredicate(p)}</span>}
                                {getReadablePredicate(p) && <span className='isa'> &nbsp;(</span>}
                                <span className='font-mono text-sm'>
                                    {makeNonClickablePrefixedUri(p, [
                                        'text-prefixed_uri_prefix_lightbg',
                                        'text-prefixed_uri_prefix_lightbg',
                                        'text-prefixed_uri_local_name_lightbg'
                                    ])}
                                </span>
                                {getReadablePredicate(p) && <span className='isa'>)</span>}
                            </td>
                            {/* OBJET */}
                            <td className='p-[1px] align-baseline'>
                                {b['label'] && <span>
                                    {displayLabel(b['label'])}
                                </span>}
                                {b['label'] && <span>
                                    {b['r'] && <Link to={'/?resource=' + b['r'].value}>
                                        <PiLinkDuotone className='inline mb-1 ml-1 text-xl' />
                                    </Link>}
                                </span>}
                                {b['label']
                                    && b['label'].value.startsWith('http')
                                    && !b['label'].value.startsWith('http://data-iremus.huma-num.fr/graph/')
                                    && <Link to={b['label'].value} target="_blank">
                                        <PiGlobeDuotone className='inline mb-1 ml-1 text-xl' />
                                    </Link>}
                                {!b['label'] && b['r'] && <span className='text-sm'>{makeNonClickablePrefixedUri(
                                    makePrefixedUri(b['r'].value),
                                    [
                                        'text-prefixed_uri_prefix_lightbg',
                                        'text-prefixed_uri_prefix_lightbg',
                                        'text-prefixed_uri_local_name_lightbg'
                                    ]
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