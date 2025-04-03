// TODO : faire une requête count pour les prédicats entrants, same bins !

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HiMiniIdentification } from 'react-icons/hi2'
import { countIncomingPredicates, countOutgoingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { identity, LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { getDotOneProperties } from 'sherlock-sparql-queries/lib/dotOne'
import { sparqlApi } from '@/services/sparqlApi'
import { makeYasguiButton } from '@/components/buttons'
import POTable from './POTable'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import PredicateSectionTitle from './PredicateSectionTitle'
import { IdentityData, extractDataFromIdentityBindings, extractDataFromOutgoingPredicatesCountSparqlQueryResult, groupByLPLR } from '@/utils/bindings_helpers'
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
  // SPARQL
  //
  ////////////////////////////////////////////////////////////////////////////////

  // Identity bindings
  const query_id = useMemo(() => identity(resourceUri, false), [resourceUri])
  const { data: sparqlresults_id } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(query_id)
  const data_id: IdentityData = extractDataFromIdentityBindings(sparqlresults_id)

  // Media representation
  const mediaRepresentation = guessMediaRepresentation(data_id)

  // Outgoing predicates :: count
  const countOutgoingPredicatesSparqlQuery = useMemo(() => countOutgoingPredicates(resourceUri), [resourceUri])
  const { data: outgoingPredicatesCountSparqlQueryResults } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(countOutgoingPredicatesSparqlQuery)
  const outgoingPredicatesCountData = extractDataFromOutgoingPredicatesCountSparqlQueryResult(outgoingPredicatesCountSparqlQueryResults)

  // Outgoing predicates :: other
  const otherOutgoingPredicatesSparqlQuery = identity(resourceUri, true, outgoingPredicatesCountData.otherOutgoingPredicates, LinkedResourcesDirectionEnum.OUTGOING)
  const { data: otherOutgoingPredicatesSparqlQueryResults } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(otherOutgoingPredicatesSparqlQuery)
  let literalOtherOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  let nonLiteralOtherOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  otherOutgoingPredicatesSparqlQueryResults?.results.bindings.map(x => {
    if (x.lr.type == 'literal') literalOtherOutgoingPredicatesBindings.push(x)
    else nonLiteralOtherOutgoingPredicatesBindings.push(x)
  })
  let nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR: Record<string, any> = groupByLPLR(nonLiteralOtherOutgoingPredicatesBindings)

  // Properties
  // let properties_bindings: SparqlQueryResultObject_Binding[] = []

  // .1 Properties
  const dotOnePropertiesSparqlQuery = getDotOneProperties(resourceUri)
  const { data: dotOnePropertiesSparqlQueryResults } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(dotOnePropertiesSparqlQuery)
  const dotOnePropertiesBindings = dotOnePropertiesSparqlQueryResults?.results.bindings || []

  // Incoming predicates
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
      {resourceUri && (
        <div>
          <div className='bg-background_negative px-6 py-6'>
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
                  countOutgoingPredicatesSparqlQuery,
                  'Ouvrir la requête SPARQL dans Yasgui : nombres de triplets sortants par prédicats'
                )}
                {makeYasguiButton(
                  n_in_q,
                  'Ouvrir la requête SPARQL dans Yasgui : nombres de triplets entrants par prédicats'
                )}
                {/* {makeNegativeButton(
                  <PiGlobeFill className='text-lg' />,
                  resourceUri,
                  "Consulter la ressource à l'extérieur de SHERLOCK"
                )} */}
              </div>
            </header>
          </div>
        </div>
      )}

      <PredicateSectionTitle direction={null} link={null} icon={<HiMiniIdentification />} title='identité de la ressource' prefixedUri={null} sparqlQuery={query_id} n={null} />
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
        <PredicateSectionTitle direction={null} icon={mediaRepresentation[1]} title={mediaRepresentation[0]} prefixedUri={null} sparqlQuery={null} link={mediaRepresentation[2]} n={null} />
        <div className='flex justify-center p-11 w-full text-center'>
          {mediaRepresentation[3]}
        </div>
      </>
      }

      {literalOtherOutgoingPredicatesBindings.length > 0 && <>
        <PredicateSectionTitle direction={null} link={null} icon={<HiMiniIdentification />} title='propriétés' prefixedUri={null} sparqlQuery={""} n={null} />
        <div className='px-6 py-6'>
          <POTable bindings={literalOtherOutgoingPredicatesBindings.map(x => ({ label: x.lr, p: x.lp }))} />
        </div>
      </>
      }

      {dotOnePropertiesBindings.length > 0 && <>
        <PredicateSectionTitle direction={null} link={null} icon={<HiMiniIdentification />} title='propriétés .1' prefixedUri={null} sparqlQuery={dotOnePropertiesSparqlQuery} n={null} />
        <div className='px-6 py-6'>
          <POTable bindings={dotOnePropertiesSparqlQueryResults?.results.bindings.map(x => ({ property: x.e55_label, ...x })) || []} />
        </div>
      </>
      }

      {Object.keys(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).length != 0 && (
        <>
          <PredicateSectionTitle direction={LinkedResourcesDirectionEnum.OUTGOING} icon={null} link={null} title='Ressources pointées' prefixedUri={null} sparqlQuery={otherOutgoingPredicatesSparqlQuery} n={null} />
          <div className='px-6 py-6'>
            {Object.entries(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).map(([lp, v1]) => {
              return Object.entries(v1 as Record<string, any>).map(([lr, v2]) => {
                return (
                  <div key={lp + lr} className='mt-5 first:mt-0'>
                    <div className='box-border flex items-center text-sm'>
                      <div className='bg-data_table_bg px-2 py-1 border border-teal-500'>{makeNonClickablePrefixedUri(makePrefixedUri(lp), ['text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_local_name_lightbg'])}</div>
                      <span className='text-teal-500 whitespace-nowrap'>{'———>'}</span>
                      <div className='bg-data_table_bg px-2 py-1 border border-teal-500'>{makeClickablePrefixedUri(lr, makePrefixedUri(lr))}</div>
                    </div>
                    <div className='ml-5'>
                      <POTable bindings={v2 as SparqlQueryResultObject_Binding[]} />
                    </div>
                  </div>
                )
              })
            })}
          </div>
        </>
      )}

      {outgoingPredicatesCountData.bigOutgoingPredicatesBindings.map(binding => {
        let k = 0
        const n = parseInt(binding.c.value)
        return (
          <div key={k++} className='py-6'>
            <PredicateWithManyLinkedResources resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} direction={LinkedResourcesDirectionEnum.OUTGOING} />
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
