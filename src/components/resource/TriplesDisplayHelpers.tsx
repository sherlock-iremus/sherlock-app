import { Link } from 'react-router-dom'
import { PrefixedUri, getPrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"

import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"

export function displayLabel(label: string) {
    if (label.startsWith('http://') || label.startsWith('https://')) {
        return <Link className='font-mono text-base text-link' to={'/?resource=' + label}>{label}</Link>
    }

    return <span className='font-serif text-lg'>{label}</span>
}

export function makeClickablePrefixedUri(uri: string, pu: PrefixedUri, key: string = '') {
    return <Link to={'/?resource=' + uri}>
        <span className='font-mono' key={key}>
            <span>{pu.prefix}</span>
            <span>:</span>
            <span>{pu.localPart}</span>
        </span>
    </Link>
}

export function makeNonClickablePrefixedUri(pu: PrefixedUri, key: string = '') {
    return <span className='font-mono' key={key}>
        <span className='text-prefixed_uri_prefix'>{pu.prefix}</span>
        <span className='text-prefixed_uri_prefix'>:</span>
        <span className='text-prefixed_uri_local_name'>{pu.localPart}</span>
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
        types.push(makeNonClickablePrefixedUri(getPrefixedUri(b["r_type"].value), getKey()))
    }

    return types
}