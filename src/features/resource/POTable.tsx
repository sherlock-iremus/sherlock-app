import { Link } from 'react-router-dom'
import { SparqlQueryResultObject_Variable, SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { PrefixedUri, makePrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"
import { getReadablePredicate, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { PiGlobeDuotone } from 'react-icons/pi'

export function displayLabel(v: SparqlQueryResultObject_Variable) {
    if (v.value.startsWith('http://') || v.value.startsWith('https://')) {
        return (
            <Link className='text-link' to={'/?resource=' + v.value}      >
                {v.value}
            </Link>
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

    return <div className='font-serif isa'>
        {b['r_type'] && <>
            <span>est un </span>
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
            <span> : </span>
            « <Link key={getKey()} to={'/?resource=' + b['r_type_type'].value}>
                {b['r_type_type_label'].value}
            </Link> »
        </>}
    </div>
}


export default function ({ bindings }: { bindings: SparqlQueryResultObject_Binding[] }) {
    return <table>
        <tbody>
            {bindings.map((b: SparqlQueryResultObject_Binding, i: number) => {
                const p = b.hasOwnProperty('p') ? makePrefixedUri(b["p"].value) : new PrefixedUri('', '')
                return <tr className="border-b border-b-data_table_border last:border-none" key={i}>
                    {/* PRÉDICAT URI */}
                    <td className='pr-11 pl-0 w-auto font-serif align-baseline'>
                        <span className='font-medium'>{getReadablePredicate(p)}</span>
                        <span className='isa'> &nbsp;(</span>
                        <span className='font-mono text-sm'>
                            {makeNonClickablePrefixedUri(p, [
                                'text-prefixed_uri_prefix_lightbg',
                                'text-prefixed_uri_prefix_lightbg',
                                'text-prefixed_uri_local_name_lightbg'
                            ])}
                        </span>
                        <span className='isa'>)</span>
                    </td>
                    {/* OBJET */}
                    <td className='p-[1px] w-auto align-baseline'>
                        {b['label'] && <span>
                            {displayLabel(b["label"])}
                            {b['r'] && <Link to={'/?resource=' + b["r"].value}>
                                <PiGlobeDuotone className='inline mb-1 ml-1 text-xl' />
                            </Link>}
                        </span>}
                        {!b['label'] && b['r'] && <span className='text-sm'>{makeNonClickablePrefixedUri(
                            makePrefixedUri(b['r'].value),
                            [
                                'text-prefixed_uri_prefix_lightbg',
                                'text-prefixed_uri_prefix_lightbg',
                                'text-prefixed_uri_local_name_lightbg'
                            ]
                        )}</span>
                        }
                        {b["r_type"] && makeLinkedResourceTypesFragment(b)}
                    </td>
                </tr>
            })}
        </tbody>
    </table>
}