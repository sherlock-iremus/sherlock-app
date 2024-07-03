import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PiGlobeFill } from "react-icons/pi"

import { identity } from 'sherlock-sparql-queries/lib/identity'
import { countLinkingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { IDENTITY_PREDICATES } from 'sherlock-sparql-queries/lib/identity'

import { sparqlApi } from '../../services/sparqlApi'
import { makeNegativeButton } from '../common/buttons'
import POTable from './POTable'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { wemi } from 'sherlock-sparql-queries'
import PredicateSectionTitle from './PredicateSectionTitle'
import { LRMOO_BASE, RDF_BASE } from 'sherlock-rdf/lib/rdf-prefixes'

export default function Resource() {
    const [searchParams] = useSearchParams()
    const resourceUri = searchParams.get('resource') || ''

    let identityBindings: SparqlQueryResultObject_Binding[] = []
    let authdocBindings: SparqlQueryResultObject_Binding[] = []
    const bigPredicatesBindings: SparqlQueryResultObject_Binding[] = []
    const rdfTypes: string[] = []
    const otherPredicates: string[] = []

    ////////////////////////////////////////////////////////////////////////////////
    //
    // IDENTITY BINDINGS
    //
    ////////////////////////////////////////////////////////////////////////////////

    const identitySparqlQuery = useMemo(() => identity(resourceUri, false), [resourceUri])
    let { data: identityData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(identitySparqlQuery)

    if (identityData) {
        for (const binding of identityData.results.bindings) {
            if (binding['p'].value === RDF_BASE + 'type') {
                rdfTypes.push(binding['r'].value)
            }
            if (binding.hasOwnProperty('authdoc') && binding.hasOwnProperty('authdoc_label') && binding.hasOwnProperty('authdoc_g')) {
                authdocBindings.push(binding)
            }
            else {
                identityBindings.push(binding)
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    //
    // OTHER BINDINGS
    //
    ////////////////////////////////////////////////////////////////////////////////

    const countLinkingPredicateSparqlQuery = useMemo(() => countLinkingPredicates(resourceUri), [resourceUri])
    const { data: countLinkingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(countLinkingPredicateSparqlQuery)

    if (countLinkingPredicatesData) {
        countLinkingPredicatesData.results.bindings.map(binding => {
            let k = 0
            const n = parseInt(binding.c.value)
            if (n > 20)
                bigPredicatesBindings.push(binding)
            if (n <= 20 && !IDENTITY_PREDICATES.includes(binding.lp.value))
                otherPredicates.push(binding.lp.value)
        })
    }

    const otherPredicatesSparqlQuery = identity(resourceUri, true, otherPredicates)
    let { data: otherPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(otherPredicatesSparqlQuery)

    ////////////////////////////////////////////////////////////////////////////////
    //
    // WEMI BINDINGS
    //
    ////////////////////////////////////////////////////////////////////////////////


    const f2SparqlQuery = wemi('', resourceUri, '', '')
    let { data: f2Data } = sparqlApi.endpoints.getFlattenedSparqlQueryResult.useQuery(f2SparqlQuery ?? rdfTypes.includes(LRMOO_BASE + 'F2_Expression'))
    console.log(f2Data)

    ////////////////////////////////////////////////////////////////////////////////
    //
    // <>
    //
    ////////////////////////////////////////////////////////////////////////////////

    return <>
        {resourceUri && <div>
            <div className="section-divider" />
            <div className='py-6 px-6 bg-background_negative'>
                {/* text-shadow: darkturquoise 0px 0px 5px, darkturquoise 0px 0px 20px, darkturquoise 0px 0px 40px, darkturquoise 0px 0px 60px; */}
                <h2 className="font-mono text-stone-300 lowercase text-xs">Ressource consultée</h2>
                <header className="flex items-center">
                    <h2
                        className="text-link_negative"
                        style={{ textShadow: 'darkturquoise 0px 0px 5px, darkturquoise 0px 0px 20px, darkturquoise 0px 0px 40px, darkturquoise 0px 0px 60px' }}
                    >
                        {resourceUri}
                    </h2>
                    <div className='ml-3 flex gap-[3px]'>
                        {/* {makeYasguiButton(countLinkingPredicateSparqlQuery, "Ouvrir la requête SPARQL dans Yasgui : nombres de triplets sortants par prédicats")} */}
                        {makeNegativeButton(<PiGlobeFill className="text-lg" />, resourceUri, "Consulter la ressource à l'extérieur de SHERLOCK")}
                    </div>
                </header>
            </div >
            <div className="section-divider" />
        </div >
        }

        <br />

        <PredicateSectionTitle title="Triplets identité" sparqlQuery={identitySparqlQuery} n={0} />

        <div className='px-6 py-6'>
            <POTable bindings={identityBindings} linkedResources={false} />
        </div>

        {
            authdocBindings.length > 0 && <>
                <div className='px-6'> Cette ressource est un concept défini dans le document de référence intitulé :&nbsp;
                    <span className='font-serif text-lg italic'>« <Link
                        to={'/?resource=' + authdocBindings[0].authdoc.value}
                        target='_blank'
                    >{authdocBindings[0].authdoc_label.value}</Link> »</span>
                    .</div>
                <br />
            </>
        }

        <div className='divider' />

        {
            bigPredicatesBindings.map(binding => {
                let k = 0
                const n = parseInt(binding.c.value)
                return <div key={k++} className='py-6'>
                    <PredicateWithManyLinkedResources resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} />
                </div>
            })
        }

        {
            otherPredicatesData && <>
                <PredicateSectionTitle title="Autres triplets sortants" sparqlQuery={otherPredicatesSparqlQuery} n={0} />
                <div className='px-6 py-6'>
                    <POTable bindings={otherPredicatesData.results.bindings} linkedResources={true} />
                </div>
            </>
        }

        <div className='divider' />
    </>
}