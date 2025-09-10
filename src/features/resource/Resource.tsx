// TODO : faire une requête count pour les prédicats entrants, same bins !

import clsx from 'clsx'
import { useCountObjectsOfOutgoingPredicatesQuery, useDotOnePropertiesQuery, useE13WithLiteralP141Query, useObjectsOfLowFanOutgoingPredicatesQuery, useResourceIdentityQuery } from '@/hooks/sherlockSparql'
import { IdentityData, extractDataFromIdentityBindings, extractDataFromOutgoingPredicatesCountSparqlQueryResult, groupByLPLR } from '@/utils/bindings_helpers'
import { E55_BUSINESS_ID, makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { tv } from 'tailwind-variants'
import { PiGraphDuotone } from 'react-icons/pi'
import DarkPart from './DarkPart'
import { guessMediaRepresentation, sortBindingsFn } from './helpers'
import POTable, { predicateFont } from './POTable'
import PredicateSectionTitle from './PredicateSectionTitle'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import { getReadablePredicate, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { FaIdCard, FaPenNib } from 'react-icons/fa'

const h2 = tv({
  base: 'font-light font-serif mb-6 mt-12 text-2xl font-mono tracking-wider items-center lowercase text-teal-500 flex gap-2'
})

interface Props {
  resourceUri: string;
}

const Resource: React.FC<Props> = ({ resourceUri }) => {
  let projectId = null

  ////////////////////////////////////////////////////////////////////////////////
  //
  // SPARQL
  //
  ////////////////////////////////////////////////////////////////////////////////

  // Resource identity
  const { data: dataResourceIdentity, query: queryResourceIdentity } = useResourceIdentityQuery(resourceUri)

  // Project ID
  const identityData: IdentityData = extractDataFromIdentityBindings(dataResourceIdentity)
  for (const b of identityData.identityBindings) {
    if (b.r_type_type?.value === E55_BUSINESS_ID) {
      projectId = b.label.value.split('/')[1]
    }
  }

  // Media representation
  const mediaRepresentation = guessMediaRepresentation(identityData, projectId)

  // Outgoing predicates :: count
  const { data: countObjectsOfOutgoingPredicatesResults, query: queryCountObjectsOfOutgoingPredicates } = useCountObjectsOfOutgoingPredicatesQuery(resourceUri)
  const outgoingPredicatesCountData = extractDataFromOutgoingPredicatesCountSparqlQueryResult(countObjectsOfOutgoingPredicatesResults)

  // Outgoing predicates :: low-fan
  const { data: objectsOfLowFanOutgoingPredicatesData, query: queryObjectsOfLowFanOutgoingPredicatesData } = useObjectsOfLowFanOutgoingPredicatesQuery(resourceUri, outgoingPredicatesCountData.lowFanOutPredicates, outgoingPredicatesCountData.lowFanOutPredicates.length > 0)
  let literalObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  let nonLiteralObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  objectsOfLowFanOutgoingPredicatesData?.results.bindings.map(x => {
    if (x.lr.type == 'literal') literalObjectsOfLowFanOutgoingPredicatesBindings.push(x)
    else nonLiteralObjectsOfLowFanOutgoingPredicatesBindings.push(x)
  })
  let nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR: Record<string, any> = groupByLPLR(nonLiteralObjectsOfLowFanOutgoingPredicatesBindings)

  // .1 Properties
  const { data: dataDotOneProperties } = useDotOnePropertiesQuery(resourceUri)
  const dotOnePropertiesBindings = dataDotOneProperties?.results.bindings || []

  // E13 with literal P141
  const { data: e13WithLiteralP141Results, query: queryE13WithLiteralP141 } = useE13WithLiteralP141Query(resourceUri)

  ////////////////////////////////////////////////////////////////////////////////
  //
  // <>
  //
  ////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className='bg-background px-6 text-foreground light'>
        <h2 className={h2()}><FaIdCard />Identité de la ressource</h2>
        <POTable bindings={identityData.identityBindings} />

        {mediaRepresentation && <>
          <PredicateSectionTitle direction={null} icon={mediaRepresentation[1]} title={mediaRepresentation[0]} prefixedUri={null} sparqlQuery={null} link={mediaRepresentation[2]} n={null} />
          <div className='flex justify-center p-11 w-full text-center'>
            {mediaRepresentation[3]}
          </div>
        </>
        }

        {literalObjectsOfLowFanOutgoingPredicatesBindings.length > 0 && <>
          <PredicateSectionTitle direction={null} link={null} icon={null} title='propriétés' prefixedUri={null} sparqlQuery={''} n={null} />
          <div className='px-6 py-6'>
            <POTable bindings={literalObjectsOfLowFanOutgoingPredicatesBindings.map(x => ({ label: x.lr, p: x.lp }))} />
          </div>
        </>
        }

        {dotOnePropertiesBindings.length > 0 && <>
          <div className='px-6 py-6'>
            <POTable bindings={dotOnePropertiesBindings.map(x => ({ property: x.e55_label, ...x })) || []} />
          </div>
        </>
        }

        {e13WithLiteralP141Results && e13WithLiteralP141Results?.results.bindings.length > 0 && <>
          <h2 className={h2()}><FaPenNib />Annotations</h2>
          <POTable bindings={
            e13WithLiteralP141Results?.results.bindings
              .map(x => ({ property: x.p177_label, value: x.p141, ...x }))
              .sort(sortBindingsFn('p177_label'))
            || []} />
        </>}

        {Object.keys(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).length != 0 && (
          <>
            <h2 className={h2()}><PiGraphDuotone />Ressources pointées</h2>
            {Object.entries(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).map(([lp, v1]) => {
              return Object.entries(v1 as Record<string, any>).map(([lr, v2]) => {
                return (
                  <div key={lp + lr} className=''>
                    <div className='mb-2'>
                      <span className={clsx(predicateFont, 'text-xl')}>{getReadablePredicate(makePrefixedUri(lp))}&nbsp;</span>
                      ({makeNonClickablePrefixedUri(makePrefixedUri(lp))})
                    </div>
                    <POTable className='ml-5' bindings={v2 as SparqlQueryResultObject_Binding[]} startLines={[['ressource pointée', lr]]} />
                  </div>
                )
              })
            })}
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
      </div>
      <div className='mt-18'></div>
      <DarkPart
        identityQuery={queryResourceIdentity}
        resourceUri={resourceUri}
        outgoingPredicatesCountQuery={queryCountObjectsOfOutgoingPredicates}
        queryE13WithLiteralP141={queryE13WithLiteralP141}
        queryObjectsOfLowFanOutgoingPredicatesData={queryObjectsOfLowFanOutgoingPredicatesData}
      />
    </>
  )
}

export default Resource