// TODO : faire une requête count pour les prédicats entrants, same bins !

import { useMemo } from 'react'
import { PiGlobeFill } from 'react-icons/pi'
import { useSearchParams } from 'react-router-dom'
import { HiMiniIdentification } from 'react-icons/hi2'
import { countIncomingPredicates, countOutgoingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { identity, LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { sparqlApi } from '@/services/sparqlApi'
import { makeNegativeButton, makeYasguiButton } from '../../components/buttons'
import POTable from './POTable'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import PredicateSectionTitle from './PredicateSectionTitle'
import { IdentityData, extractDataFromIdentityBindings, extractDataFromOutgoingPredicatesBindings, groupByLPLR } from '@/utils/bindings_helpers'
import { makeClickablePrefixedUri, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { guessMediaRepresentation } from './helpers'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'

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
  console.log(otherOutgoingBindings)
  let otherOutgoingBindingsGroupedByLPLR = {}
  if (otherOutgoingBindings?.results.bindings) {
    otherOutgoingBindingsGroupedByLPLR = groupByLPLR(otherOutgoingBindings.results.bindings)
  }

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
  // MEDIA REPRESENTATION
  //
  ////////////////////////////////////////////////////////////////////////////////

  const mediaRepresentation = guessMediaRepresentation(data_id)

  ////////////////////////////////////////////////////////////////////////////////
  //
  // <>
  //
  ////////////////////////////////////////////////////////////////////////////////

  return (
    <>
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
        direction={null}
        link={null}
        icon={<HiMiniIdentification />}
        title='identité de la ressource'
        prefixedUri={null}
        sparqlQuery={query_id}
        n={null}
      />

      <div className='px-6 py-6'>
        <POTable bindings={data_id.identityBindings} />
      </div>

      {/* {data_id.authdocBindings.length > 0 && (
        <>
          <div className='flex px-6'>
            <span className='mt-1 icon'>
              <PiTreeViewDuotone />
            </span>
            <span>
              &nbsp;Cette ressource est un concept défini dans le document de
              référence intitulé :&nbsp;
            </span>
            <span className='font-serif'>
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
      )} */}

      {mediaRepresentation && <>
        <PredicateSectionTitle
          direction={null}
          icon={mediaRepresentation[1]}
          title={mediaRepresentation[0]}
          prefixedUri={null}
          sparqlQuery={null}
          link={mediaRepresentation[2]}
          n={null}
        />
        <div className='flex justify-center p-11 w-full text-center'>
          {mediaRepresentation[3]}
        </div>
      </>
      }

      {otherOutgoingBindings && (
        <>
          <PredicateSectionTitle
            direction={LinkedResourcesDirectionEnum.OUTGOING}
            icon={null}
            link={null}
            title='Ressources pointées'
            prefixedUri={null}
            sparqlQuery={out_q}
            n={null}
          />
          <div className='px-6 py-6'>
            {Object.entries(otherOutgoingBindingsGroupedByLPLR).map(([lp, v1]) => {
              return Object.entries(v1 as Record<string, any>).map(([lr, v2]) => {
                return (
                  <div key={lp + lr} className='mt-9 first:mt-0'>
                    <div className='box-border flex items-center mb-3'>
                      <div className='bg-data_table_bg px-2 py-1 border border-teal-500'>{makeNonClickablePrefixedUri(makePrefixedUri(lp), ['text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_local_name_lightbg'])}</div>
                      <span className='text-teal-500 whitespace-nowrap'>{'———>'}</span>
                      <div className='bg-data_table_bg px-2 py-1 border border-teal-500'>{makeClickablePrefixedUri(lr, makePrefixedUri(lr))}</div>
                    </div>
                    <div className=''>
                      <POTable bindings={v2 as SparqlQueryResultObject_Binding[]} />
                    </div>
                  </div>
                )
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
    </>
  )
}

export default Resource
