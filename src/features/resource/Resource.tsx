// TODO : faire une requête count pour les prédicats entrants, same bins !
// TODO : virer les prédicats identités des autres prédicats sortants

import { useMemo } from 'react'
import { PiGlobeFill } from 'react-icons/pi'
import { data, Link, useSearchParams } from 'react-router-dom'
import { HiMiniIdentification } from 'react-icons/hi2'
import { PiTreeViewDuotone } from 'react-icons/pi'
import { countIncomingPredicates, countOutgoingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { identity, LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { sparqlApi } from '../../services/sparqlApi'
import { makeNegativeButton, makeYasguiButton } from '../../components/buttons'
import POTable from './POTable'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import PredicateSectionTitle from './PredicateSectionTitle'
import { sortBindings } from 'sherlock-rdf/lib/rdf-prefixes'
import { IdentityData, extractDataFromIdentityBindings, extractDataFromOutgoingPredicatesBindings, groupByLPLR } from '../../utils/bindings_helpers'

function Resource() {
  const [searchParams] = useSearchParams()
  const resourceUri = searchParams.get('resource') || ''

  if (!resourceUri) return <div className='section-divider' />

  ////////////////////////////////////////////////////////////////////////////////
  //
  // IDENTITY BINDINGS
  //
  ////////////////////////////////////////////////////////////////////////////////

  const query_id = useMemo(() => identity(resourceUri, false), [resourceUri])
  const { data: sparqlresults_id } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(query_id)
  const data_id: IdentityData = extractDataFromIdentityBindings(sparqlresults_id)

  ////////////////////////////////////////////////////////////////////////////////
  //
  // OUTGOING PREDICATES
  //
  ////////////////////////////////////////////////////////////////////////////////

  // OUT :: count
  const query_countoutgoing = useMemo(() => countOutgoingPredicates(resourceUri), [resourceUri])
  const { data: sparqlresults_countoutoutgoing } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(query_countoutgoing)
  const data_outgoing = extractDataFromOutgoingPredicatesBindings(sparqlresults_countoutoutgoing)

  // OUT :: other
  const out_q = identity(resourceUri, true, data_outgoing.otherOutgoingPredicates, LinkedResourcesDirectionEnum.OUTGOING)
  const { data: otherOutgoingBindings } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(out_q, { skip: data_outgoing.otherOutgoingPredicates.length === 0 })
  let otherOutgoingBindingsGroupedByLPLR = {}
  if (otherOutgoingBindings?.results.bindings) {
    otherOutgoingBindingsGroupedByLPLR = groupByLPLR(otherOutgoingBindings.results.bindings)
  }

  // OUT :: big

  ////////////////////////////////////////////////////////////////////////////////
  //
  // INCOMING PREDICATES
  //
  ////////////////////////////////////////////////////////////////////////////////

  const n_in_q = useMemo(() => countIncomingPredicates(resourceUri), [resourceUri])
  // const { data: countIncomingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(n_in_q)
  // const bigIncomingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  // const otherIncomingPredicates: string[] = []

  // if (countIncomingPredicatesData) {
  //     countIncomingPredicatesData.results.bindings.map(binding => {
  //         const n = parseInt(binding.c.value)
  //         if (n < 20) {
  //             otherIncomingPredicates.push(binding.lp.value)
  //         }
  //         else {
  //             bigIncomingPredicatesBindings.push(binding)
  //         }
  //     })
  // }

  // const otherIncomingPredicatesSparqlQuery = identity(resourceUri, true, otherIncomingPredicates, LinkedResourcesDirectionEnum.INCOMING)
  // let { data: otherIncomingPredicatesData } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(otherIncomingPredicatesSparqlQuery)

  ////////////////////////////////////////////////////////////////////////////////
  //
  // <>
  //
  ////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {/* <pre className='text-xs'>
        {JSON.stringify(data_outgoing, null, 4)}
        <br />{'-'.repeat(120)}<br />
        {JSON.stringify(otherOutgoingBindings, null, 4)}
      </pre> */}
      {resourceUri && (
        <div>
          {/* <div className='section-divider' /> */}
          <div className='bg-background_negative px-6 py-6'>
            {/* text-shadow: darkturquoise 0px 0px 5px, darkturquoise 0px 0px 20px, darkturquoise 0px 0px 40px, darkturquoise 0px 0px 60px; */}
            <h2 className='font-mono text-stone-300 text-xs lowercase'>
              Ressource consultée
            </h2>
            <header className='flex items-center'>
              <h2
                className='text-link_negative'
                style={{
                  textShadow:
                    'darkturquoise 0px 0px 5px, darkturquoise 0px 0px 20px, darkturquoise 0px 0px 40px, darkturquoise 0px 0px 60px'
                }}
              >
                {resourceUri}
              </h2>
              <div className='flex gap-[3px] ml-3'>
                {makeYasguiButton(
                  query_countoutgoing,
                  'Ouvrir la requête SPARQL dans Yasgui : nombres de triplets sortants par prédicats'
                )}
                {makeYasguiButton(
                  n_in_q,
                  'Ouvrir la requête SPARQL dans Yasgui : nombres de triplets entrants par prédicats'
                )}
                {makeNegativeButton(
                  <PiGlobeFill className='text-lg' />,
                  resourceUri,
                  "Consulter la ressource à l'extérieur de SHERLOCK"
                )}
              </div>
            </header>
          </div>
        </div>
      )}

      <PredicateSectionTitle
        direction={undefined}
        icon={<HiMiniIdentification />}
        title='Triplets identité'
        prefixedUri={undefined}
        sparqlQuery={query_id}
        n={0}
      />

      <div className='px-6 py-6'>
        <POTable bindings={data_id.identityBindings.toSorted(sortBindings)} />
      </div>

      {data_id.authdocBindings.length > 0 && (
        <>
          <div className='flex px-6'>
            <span className='mt-1 icon'>
              <PiTreeViewDuotone />
            </span>
            <span>
              &nbsp;Cette ressource est un concept défini dans le document de
              référence intitulé :&nbsp;
            </span>
            <span className='font-serif text-lg italic'>
              «
              <Link
                to={'/?resource=' + data_id.authdocBindings[0].authdoc.value}
                target='_blank'
              >
                {data_id.authdocBindings[0].authdoc_label.value}
              </Link>
              »
            </span>
            .
          </div>
          <br />
        </>
      )}

      <div className='divider' />

      {otherOutgoingBindings && (
        <>
          <PredicateSectionTitle
            direction={LinkedResourcesDirectionEnum.OUTGOING}
            icon={undefined}
            title='Autres triplets sortants'
            prefixedUri={undefined}
            sparqlQuery={out_q}
            n={0}
          />
          <div className='px-6 py-6'>
            {Object.entries(otherOutgoingBindingsGroupedByLPLR).map(([lp, v1]) => {
              return Object.entries(v1).map(([lr, v2]) => {
                return <div key={lp + lr}>
                  <div>{lp} — {lr}</div>
                  <POTable bindings={v2} />
                </div>
              })
            })}
          </div>
        </>
      )}

      {data_outgoing.bigOutgoingPredicatesBindings.map(binding => {
        let k = 0
        const n = parseInt(binding.c.value)
        return (
          <div key={k++} className='py-6'>
            <PredicateWithManyLinkedResources
              resourceUri={resourceUri}
              predicateUri={binding.lp.value}
              n={n}
              direction={LinkedResourcesDirectionEnum.OUTGOING}
            />
          </div>
        )
      })}

      {/* {
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
        } */}

      <div className='divider' />
    </>
  )
}

export default Resource
