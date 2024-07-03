import { Link } from 'react-router-dom'
import { PrefixedUri, makePrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"

import { SparqlQueryResultObject_Binding, SparqlQueryResultObject_Variable } from "sherlock-rdf/lib/sparql-result"

export function displayLabel(v: SparqlQueryResultObject_Variable) {
    const lang = v['xml:lang'] ? <span className='lang'>{' @' + v['xml:lang']}</span> : ''
    if (v.value.startsWith('http://') || v.value.startsWith('https://')) {
        return <Link className='font-mono text-base text-link' to={'/?resource=' + v.value}>{v.value}</Link>
    }

    return <span className='font-serif text-lg'>{v.value}{lang}</span>
}

export function makeClickablePrefixedUri(uri: string, pu: PrefixedUri, key: string = '') {
    return pu.prefix
        ? <Link to={'/?resource=' + uri}>
            <span className='font-mono' key={key}>
                <span>{pu.prefix}</span>
                <span>:</span>
                <span>{pu.localPart}</span>
            </span>
        </Link>
        :
        <Link to={'/?resource=' + uri}>
            <span className='font-mono' key={key}>
                <span>{pu.localPart}</span>
            </span>
        </Link>
}

export function makeNonClickablePrefixedUri(pu: PrefixedUri, colors: string[], key: string = '') {
    return pu.prefix
        ? <span className='font-mono' key={key}>
            <span className={colors[0]}>{pu.prefix}</span>
            <span className={colors[1]}>:</span>
            <span className={colors[2]}>{pu.localPart}</span>
        </span>
        : <span className='font-mono' key={key}>
            <span className={colors[2]}>{pu.localPart}</span>
        </span>
}

export function makeLinkedResourceTypesFragment(b: SparqlQueryResultObject_Binding) {
    const types = []
    let types_key = 0
    const getKey = () => 'types_key_' + types_key++
    const addDivider = () => { if (types.length > 0) types.push(<span className='px-1 text-stone-600' key={getKey()}>•</span>) }

    if (b["r_type_type"]) {
        addDivider()
        types.push(<Link className='' key={getKey()} to={'/?resource=' + b["r_type_type"].value}>{b["r_type_type_label"].value}</Link>)
    }
    if (b["r_type"]) {
        addDivider()
        types.push(makeNonClickablePrefixedUri(makePrefixedUri(b["r_type"].value), ['text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_local_name_lightbg'], getKey()))
    }

    return types
}