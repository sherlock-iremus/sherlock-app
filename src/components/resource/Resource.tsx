// TODO : faire une requête count pour les prédicats entrants, same bins !

import { useMemo } from 'react'
import { PiGlobeFill } from "react-icons/pi"
import { Link, useSearchParams } from 'react-router-dom'
import { HiMiniIdentification } from "react-icons/hi2"
import { PiTreeViewDuotone } from "react-icons/pi"

import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { countIncomingPredicates, countOutgoingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { IDENTITY_PREDICATES, identity, LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'

import { sparqlApi } from '../../services/sparqlApi'
import { makeNegativeButton, makeYasguiButton } from '../common/buttons'
import POTable from './POTable'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import PredicateSectionTitle from './PredicateSectionTitle'
import { RDF_BASE } from 'sherlock-rdf/lib/rdf-prefixes'

export default function Resource() {
    const [searchParams] = useSearchParams()
    const resourceUri = searchParams.get('resource') || ''

    if (!resourceUri) return <>
        <div className="section-divider" />
    </>

    let identityBindings: SparqlQueryResultObject_Binding[] = []
    let authdocBindings: SparqlQueryResultObject_Binding[] = []
    const rdfTypes: string[] = []
    const bigOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
    const bigIncomingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
    const otherOutgoingPredicates: string[] = []
    const otherIncomingPredicates: string[] = []

    ////////////////////////////////////////////////////////////////////////////////
    //
    // IDENTITY BINDINGS
    //
    ////////////////////////////////////////////////////////////////////////////////

    const identitySparqlQuery = useMemo(() => identity(resourceUri, false), [resourceUri])
    let { data: identityData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(identitySparqlQuery)

    if (identityData) {
        for (const binding of identityData.results.bindings) {
            if (binding.hasOwnProperty('p') && binding['p'].value === RDF_BASE + 'type') {
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
    // OUTGOING PREDICATES
    //
    ////////////////////////////////////////////////////////////////////////////////

    const countOutgoingPredicateSparqlQuery = useMemo(() => countOutgoingPredicates(resourceUri), [resourceUri])
    const { data: countOutgoingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(countOutgoingPredicateSparqlQuery)

    if (countOutgoingPredicatesData) {
        countOutgoingPredicatesData.results.bindings.map(binding => {
            const n = parseInt(binding.c.value)
            if (n > 20) {
                bigOutgoingPredicatesBindings.push(binding)
            }
            if (n <= 20 && !IDENTITY_PREDICATES.includes(binding.lp.value)) {
                otherOutgoingPredicates.push(binding.lp.value)
            }
        })
    }

    const otherOutgoingPredicatesSparqlQuery = identity(resourceUri, true, otherOutgoingPredicates, LinkedResourcesDirectionEnum.OUTGOING)
    let { data: otherOutgoingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(otherOutgoingPredicatesSparqlQuery)

    ////////////////////////////////////////////////////////////////////////////////
    //
    // INCOMING PREDICATES
    //
    ////////////////////////////////////////////////////////////////////////////////

    const countIncomingPredicateSparqlQuery = useMemo(() => countIncomingPredicates(resourceUri), [resourceUri])
    const { data: countIncomingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(countIncomingPredicateSparqlQuery)

    if (countIncomingPredicatesData) {
        countIncomingPredicatesData.results.bindings.map(binding => {
            const n = parseInt(binding.c.value)
            if (n < 20) {
                otherIncomingPredicates.push(binding.lp.value)
            }
            else {
                bigIncomingPredicatesBindings.push(binding)
            }
        })
    }

    const otherIncomingPredicatesSparqlQuery = identity(resourceUri, true, otherIncomingPredicates, LinkedResourcesDirectionEnum.INCOMING)
    let { data: otherIncomingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(otherIncomingPredicatesSparqlQuery)

    ////////////////////////////////////////////////////////////////////////////////
    //
    // WEMI BINDINGS
    //
    ////////////////////////////////////////////////////////////////////////////////

    // let isF1 = rdfTypes.includes(LRMOO_BASE + 'F1_Work')
    // let isF2 = rdfTypes.includes(LRMOO_BASE + 'F2_Expression')
    // let isF3 = rdfTypes.includes(LRMOO_BASE + 'F3_Manifestation')
    // let isF5 = rdfTypes.includes(LRMOO_BASE + 'F5_Item')

    // if (isF1) wemiSparqlQuery = wemi(resourceUri, '', '', '')
    // if (isF2) wemiSparqlQuery = wemi('', resourceUri, '', '')
    // if (isF3) wemiSparqlQuery = wemi('', '', resourceUri, '')
    // if (isF5) wemiSparqlQuery = wemi('', '', '', resourceUri)

    // const skip = !(isF1 || isF2 || isF3 || isF5)

    // let { data: wemiData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(wemiSparqlQuery, { skip })

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
                        {makeYasguiButton(countOutgoingPredicateSparqlQuery, "Ouvrir la requête SPARQL dans Yasgui : nombres de triplets sortants par prédicats")}
                        {makeYasguiButton(countIncomingPredicateSparqlQuery, "Ouvrir la requête SPARQL dans Yasgui : nombres de triplets entrants par prédicats")}
                        {makeNegativeButton(<PiGlobeFill className="text-lg" />, resourceUri, "Consulter la ressource à l'extérieur de SHERLOCK")}
                    </div>
                </header>
            </div >
            <div className="section-divider" />
        </div >
        }

        <br />

        <PredicateSectionTitle
            direction={undefined}
            icon={<HiMiniIdentification />}
            title="Triplets identité"
            prefixedUri={undefined}
            sparqlQuery={identitySparqlQuery}
            n={0}
        />

        <div className='px-6 py-6'>
            <POTable bindings={identityBindings} linkedResources={false} />
        </div>

        {
            authdocBindings.length > 0 && <>

                <div className='px-6   flex'>
                    <span className='mt-1 icon'><PiTreeViewDuotone /></span>
                    <span>&nbsp;Cette ressource est un concept défini dans le document de référence intitulé :&nbsp;</span>
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
            otherOutgoingPredicatesData && <>
                <PredicateSectionTitle
                    direction={LinkedResourcesDirectionEnum.OUTGOING}
                    icon={undefined}
                    title="Autres triplets sortants"
                    prefixedUri={undefined}
                    sparqlQuery={otherOutgoingPredicatesSparqlQuery}
                    n={0}
                />
                <div className='px-6 py-6'>
                    {/* TODO mé non : il faut filtrer pour virer l'identité */}
                    <POTable bindings={otherOutgoingPredicatesData.results.bindings} linkedResources={true} />
                </div>
            </>
        }

        {
            bigOutgoingPredicatesBindings.map(binding => {
                let k = 0
                const n = parseInt(binding.c.value)
                return <div key={k++} className='py-6'>
                    <PredicateWithManyLinkedResources resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} direction={LinkedResourcesDirectionEnum.OUTGOING} />
                </div>
            })
        }

        {
            otherIncomingPredicatesData && <>
                <PredicateSectionTitle
                    direction={LinkedResourcesDirectionEnum.INCOMING}
                    icon={undefined}
                    title="triplets entrants"
                    prefixedUri={undefined}
                    sparqlQuery={otherIncomingPredicatesSparqlQuery}
                    n={0}
                />
                <div className='px-6 py-6'>
                    <POTable bindings={otherIncomingPredicatesData?.results.bindings} linkedResources={true} />
                </div>
            </>
        }

        {
            bigIncomingPredicatesBindings.map(binding => {
                let k = 0
                const n = parseInt(binding.c.value)
                return <div key={k++} className='py-6'>
                    <PredicateWithManyLinkedResources resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} direction={LinkedResourcesDirectionEnum.INCOMING} />
                </div>
            })
        }

        <div className='divider' />
    </>
}