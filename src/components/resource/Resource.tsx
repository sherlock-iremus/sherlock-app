import { useMemo } from 'react'
// import { GiHourglass } from "react-icons/gi"
import { useSearchParams } from 'react-router-dom'
import { identity } from 'sherlock-sparql-queries/lib/identity'
import { countLinkingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { sparqlApi } from '../../services/sparqlApi'
import ResourceHeader from './ResourceHeader'
import ResourceIdentity from './ResourceIdentity'
import SparqlAccordions from './SparqlAccordions'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import { PrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"
import { TbHexagonLetterY } from 'react-icons/tb'
import { makePositiveButton } from '../common/buttons'

export function makeSectionTitleFragment(title: string | PrefixedUri, sparqlQuery: string, n: number) {
    return <h2 className='section flex items-center'>
        {title instanceof PrefixedUri
            ? <span className='font-mono lowercase'>
                <span>{title.prefix}</span>
                <span>:</span>
                <span>{title.localPart}</span>
            </span>
            : <span className='font-section uppercase '>{title}</span>
        }
        <span className='font-section'>&nbsp;[{n}]</span>
        {makePositiveButton(<TbHexagonLetterY className="text-lg" />, `https://yasgui.triply.cc/#query=${encodeURIComponent(sparqlQuery)}&endpoint=http%3A%2F%2Fdata-iremus.huma-num.fr%2Fsparql%2F&requestMethod=POST&tabTitle=Query&headers=%7B%7D&contentTypeConstruct=application%2Fn-triples%2C*%2F*%3Bq%3D0.9&contentTypeSelect=application%2Fsparql-results%2Bjson%2C*%2F*%3Bq%3D0.9&outputFormat=table`)}
    </h2>
}

export default function Resource() {
    const [searchParams] = useSearchParams()
    const resourceUri = searchParams.get('resource') || ''

    const identitySparqlQuery = useMemo(() => identity(resourceUri, false), [resourceUri])
    const { data: identityData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(identitySparqlQuery)

    const countLinkingPredicateSparqlQuery = useMemo(() => countLinkingPredicates(resourceUri), [resourceUri])
    const { data: countLinkingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(countLinkingPredicateSparqlQuery)

    return <>
        {resourceUri && <div className='px-6 py-6 bg-background-negative'>
            <h2 className='section text-foreground-negative'>Ressource consultée</h2>
            <ResourceHeader uri={resourceUri} />
        </div>
        }

        {identityData && <div className='px-6 py-6'>
            {makeSectionTitleFragment('Identité de la ressource', identitySparqlQuery, identityData.results.bindings.length)}
            <br />
            <ResourceIdentity data={identityData} />
        </div>}

        <div className='divider' />

        {countLinkingPredicatesData && countLinkingPredicatesData.results.bindings.map(binding => {
            let k = 0
            const n = parseInt(binding.c.value)
            return n > 20
                ? <div className='px-6 py-6' key={k++}>
                    <PredicateWithManyLinkedResources resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} />
                </div>
                : ""
        })}

        <div className='divider' />
    </>
}