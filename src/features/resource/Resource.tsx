// TODO : faire une requête count pour les prédicats entrants, same bins !

import { identity } from 'sherlock-sparql-queries/lib/identity'
import { countOutgoingPredicates } from 'sherlock-sparql-queries/lib/countLinkingPredicates'
import { getDotOneProperties } from 'sherlock-sparql-queries/lib/dotOne'
import { e13WithLiteralP141 } from 'sherlock-sparql-queries/lib/e13WithLiteralP141'
import { useSearchParams } from 'react-router-dom'
import { HiMiniIdentification } from 'react-icons/hi2'
import { sortBindingsFn } from './helpers'
import { makeYasguiButton } from '@/components/buttons'
import POTable from './POTable'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import PredicateSectionTitle from './PredicateSectionTitle'
import { IdentityData, extractDataFromIdentityBindings, extractDataFromOutgoingPredicatesCountSparqlQueryResult, groupByLPLR } from '@/utils/bindings_helpers'
import { makeClickablePrefixedUri, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { guessMediaRepresentation } from './helpers'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { E55_BUSINESS_ID } from 'sherlock-rdf/lib/rdf-prefixes'
import { useIdentityQuery, useCountObjectsOfOutgoingPredicatesQuery, useObjectsOfLowFanOutgoingPredicatesQuery, useDotOnePropertiesQuery, useE13WithLiteralP141Query } from '@/hooks/sherlockSparql'
import { LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'

export default function Resource() {
  const [searchParams] = useSearchParams()
  const resourceUri = searchParams.get('resource') || ''

  if (!resourceUri) return <div className='section-divider' />

  let projectId = null

  ////////////////////////////////////////////////////////////////////////////////
  //
  // SPARQL
  //
  ////////////////////////////////////////////////////////////////////////////////

  const queries = {
    identity: identity(resourceUri),
    outgoingPredicatesCount: '',
    objectsOfLowFanOutgoingPredicates: '',
    dotOneProperties: getDotOneProperties(resourceUri),
    E13WithLiteralP141: e13WithLiteralP141(resourceUri)
  }

  // Identity bindings
  const { data: identityResults } = useIdentityQuery(queries.identity, resourceUri)

  // Project ID
  const identityData: IdentityData = extractDataFromIdentityBindings(identityResults)
  for (const b of identityData.identityBindings) {
    if (b.r_type_type?.value === E55_BUSINESS_ID) {
      projectId = b.label.value.split('/')[1]
    }
  }

  // Media representation
  const mediaRepresentation = guessMediaRepresentation(identityData, projectId)

  // Outgoing predicates :: count
  queries.outgoingPredicatesCount = countOutgoingPredicates(resourceUri)
  const { data: countObjectsOfOutgoingPredicatesResults } = useCountObjectsOfOutgoingPredicatesQuery(queries.outgoingPredicatesCount, resourceUri)
  const outgoingPredicatesCountData = extractDataFromOutgoingPredicatesCountSparqlQueryResult(countObjectsOfOutgoingPredicatesResults)

  // Outgoing predicates :: low-fan
  queries.objectsOfLowFanOutgoingPredicates = identity(resourceUri, true, outgoingPredicatesCountData.lowFanOutPredicates, LinkedResourcesDirectionEnum.OUTGOING)
  const { data: objectsOfLowFanOutgoingPredicatesData } = useObjectsOfLowFanOutgoingPredicatesQuery(queries.objectsOfLowFanOutgoingPredicates, resourceUri, outgoingPredicatesCountData.lowFanOutPredicates.length > 0)
  let literalObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  let nonLiteralObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  objectsOfLowFanOutgoingPredicatesData?.results.bindings.map(x => {
    if (x.lr.type == 'literal') literalObjectsOfLowFanOutgoingPredicatesBindings.push(x)
    else nonLiteralObjectsOfLowFanOutgoingPredicatesBindings.push(x)
  })
  let nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR: Record<string, any> = groupByLPLR(nonLiteralObjectsOfLowFanOutgoingPredicatesBindings)

  // .1 Properties
  const { data: dotOnePropertiesResults } = useDotOnePropertiesQuery(queries.dotOneProperties, resourceUri)
  const dotOnePropertiesBindings = dotOnePropertiesResults?.results.bindings || []

  // E13 with literal P141
  const { data: e13WithLiteralP141Results } = useE13WithLiteralP141Query(queries.E13WithLiteralP141, resourceUri)

  // console.log(e13WithLiteralP141Results)

  ////////////////////////////////////////////////////////////////////////////////
  //
  // <>
  //
  ////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {resourceUri && (
        <div>
          <div className='bg-black px-6 py-6'>
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
                  queries.outgoingPredicatesCount,
                  'Ouvrir la requête SPARQL dans Yasgui : nombres de triplets sortants par prédicats'
                )}
                {/* {makeYasguiButton(
                  countIncomingPredicatesSparqlQuery,
                  'Ouvrir la requête SPARQL dans Yasgui : nombres de triplets entrants par prédicats'
                )} */}
              </div>
            </header>
          </div>
        </div>
      )}

      <PredicateSectionTitle direction={null} link={null} icon={<HiMiniIdentification />} title='identité de la ressource' prefixedUri={null} sparqlQuery={queries.identity} n={null} />
      <div className='px-6 py-6'>
        <POTable bindings={identityData.identityBindings} />
      </div>

      {mediaRepresentation && <>
        <PredicateSectionTitle direction={null} icon={mediaRepresentation[1]} title={mediaRepresentation[0]} prefixedUri={null} sparqlQuery={null} link={mediaRepresentation[2]} n={null} />
        <div className='flex justify-center p-11 w-full text-center'>
          {mediaRepresentation[3]}
        </div>
      </>
      }

      {literalObjectsOfLowFanOutgoingPredicatesBindings.length > 0 && <>
        <PredicateSectionTitle direction={null} link={null} icon={<HiMiniIdentification />} title='propriétés' prefixedUri={null} sparqlQuery={""} n={null} />
        <div className='px-6 py-6'>
          <POTable bindings={literalObjectsOfLowFanOutgoingPredicatesBindings.map(x => ({ label: x.lr, p: x.lp }))} />
        </div>
      </>
      }

      {dotOnePropertiesBindings.length > 0 && <>
        <PredicateSectionTitle direction={null} link={null} icon={<HiMiniIdentification />} title='propriétés .1' prefixedUri={null} sparqlQuery={queries.dotOneProperties} n={null} />
        <div className='px-6 py-6'>
          <POTable bindings={dotOnePropertiesResults?.results.bindings.map(x => ({ property: x.e55_label, ...x })) || []} />
        </div>
      </>
      }

      {e13WithLiteralP141Results && e13WithLiteralP141Results?.results.bindings.length > 0 && <>
        <PredicateSectionTitle direction={null} link={null} icon={<HiMiniIdentification />} title='annotations' prefixedUri={null} sparqlQuery={queries.E13WithLiteralP141} n={null} />
        <div className='px-6 py-6'>
          <POTable bindings={
            e13WithLiteralP141Results?.results.bindings
              .map(x => ({ property: x.p177_label, value: x.p141, ...x }))
              .sort(sortBindingsFn('p177_label'))
            || []} />
        </div>
      </>}

      {Object.keys(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).length != 0 && (
        <>
          <PredicateSectionTitle direction={LinkedResourcesDirectionEnum.OUTGOING} icon={null} link={null} title='Ressources pointées' prefixedUri={null} sparqlQuery={queries.objectsOfLowFanOutgoingPredicates} n={null} />
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

      {outgoingPredicatesCountData.highFanOutPredicatesBindings.map(binding => {
        let k = 0
        const n = parseInt(binding.c.value)
        return (
          <div key={k++} className='py-6'>
            <PredicateWithManyLinkedResources resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} direction={LinkedResourcesDirectionEnum.OUTGOING} />
          </div>
        )
      })}
    </>
  )
}
