import { PrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"
import { makeYasguiButton } from '../common/buttons'
import { makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'


export default function ({ title, sparqlQuery = '', n }: {
    title: PrefixedUri | string,
    sparqlQuery: string,
    n: number
}) {
    return <div>
        <div className="section-divider" />
        <div className="px-6 py-2 section-bg section-font-predicate">
            <h2 className='flex items-center'>
                {(title instanceof PrefixedUri) && makeNonClickablePrefixedUri(title, ['text-prefixed_uri_prefix_darkbg', 'text-prefixed_uri_prefix_darkbg', 'text-prefixed_uri_local_name_darkbg'])}
                {!(title instanceof PrefixedUri) && <span className='font-mono text-prefixed_uri_prefix_darkbg text-prefixed_uri_prefix_darkbg text-prefixed_uri_local_name_darkbg'>{title}</span>}
                {n > 0 && <span className='font-medium italic font-serif text-stone-200 text-large'>&nbsp;&nbsp;({n})</span>}
                {sparqlQuery && <div className='ml-3 flex gap-[3px]'>
                    {makeYasguiButton(sparqlQuery, "Ouvrir la requête SPARQL dans Yasgui")}
                </div>}
            </h2>
        </div>
        <div className="section-divider" />
    </div>
}