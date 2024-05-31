import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { identity } from 'sherlock-sparql-queries/lib/identity'
import { countLinkingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { sparqlApi } from '../../services/sparqlApi'
import ResourceHeader from './ResourceHeader'
import POTable from './POTable'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import { PrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"
import { TbHexagonLetterY } from 'react-icons/tb'
import { makePositiveButton } from '../common/buttons'
import { makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'

export function makeSectionTitleFragment(title: string | PrefixedUri, sparqlQuery: string, n: number) {
    return <h2 className='section flex items-center'>
        {title instanceof PrefixedUri
            ? makeNonClickablePrefixedUri(title)
            : <span className='font-section uppercase '>{title}</span>
        }
        <span className='font-section table-header'>&nbsp;[{n}]</span>
        {makePositiveButton(<TbHexagonLetterY className="text-lg" />, `https://yasgui.triply.cc/#query=${encodeURIComponent(sparqlQuery)}&endpoint=http%3A%2F%2Fdata-iremus.huma-num.fr%2Fsparql%2F&requestMethod=POST&tabTitle=Query&headers=%7B%7D&contentTypeConstruct=application%2Fn-triples%2C*%2F*%3Bq%3D0.9&contentTypeSelect=application%2Fsparql-results%2Bjson%2C*%2F*%3Bq%3D0.9&outputFormat=gchart`)}
    </h2>
}

export default function Resource() {
    const [searchParams] = useSearchParams()
    const resourceUri = searchParams.get('resource') || ''

    const identitySparqlQuery = useMemo(() => identity(resourceUri, false), [resourceUri])
    let { data: identityData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(identitySparqlQuery)

    const countLinkingPredicateSparqlQuery = useMemo(() => countLinkingPredicates(resourceUri), [resourceUri])
    const { data: countLinkingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(countLinkingPredicateSparqlQuery)

    let identityTableData = {
        head: identityData?.head,
        results: {
            bindings: []
        }
    }
    let e32Data = {
        head: identityData?.head,
        results: {
            bindings: []
        }
    }

    if (identityData) {
        for (const binding of identityData.results.bindings) {
            if (binding.e32 && binding.e32_e55_graph && binding.e32_label && binding.e32_graph) {
                e32Data.results.bindings.push(binding)
            }
            else {
                identityTableData.results.bindings.push(binding)
            }
        }
    }

    return <>
        {resourceUri && <div className='px-6 py-6 bg-background-negative'>
            <h2 className="font-['Albertus'] section text-foreground-negative uppercase">Ressource consultée</h2>
            <ResourceHeader uri={resourceUri} />
        </div>
        }

        {identityTableData && <div className='px-6 py-6'>
            {makeSectionTitleFragment('Identité de la ressource', identitySparqlQuery, identityTableData.results.bindings.length)}
            <POTable data={identityTableData} />
            {e32Data.results.bindings && JSON.stringify(e32Data.results.bindings)}
        </div>}

        <div className='divider' />

        {countLinkingPredicatesData && countLinkingPredicatesData.results.bindings.map(binding => {
            let k = 0
            const n = parseInt(binding.c.value)
            return n > 20
                ? <div key={k++}>
                    <div className='px-6 py-6'>
                        <PredicateWithManyLinkedResources resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} />
                    </div>
                    <div className='divider' />
                </div>
                : ""
        })}
    </>
}