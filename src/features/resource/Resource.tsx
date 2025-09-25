// TODO : faire une requête count pour les prédicats entrants, same bins !

import { useCountObjectsOfOutgoingPredicatesQuery, useDotOnePropertiesQuery, useE13WithLiteralP141Query, useObjectsOfLowFanOutgoingPredicatesQuery, useResourceIdentityQuery } from '@/hooks/sherlockSparql'
import { IdentityData, extractDataFromIdentityBindings, extractDataFromOutgoingPredicatesCountSparqlQueryResult, groupByLPLR } from '@/utils/bindings_helpers'
import { FaIdCard, FaPenNib } from 'react-icons/fa'
import { PiGraphDuotone } from 'react-icons/pi'
import { E55_BUSINESS_ID } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { BindingsTable, LinkedResourcesBindingsTable } from './BindingTables'
import DarkPart from './DarkPart'
import { guessMediaRepresentation, sortBindingsFn } from './helpers'
import PredicateSectionTitle from './PredicateSectionTitle'
import PredicateWithManyLinkedResources from './PredicateWithManyLinkedResources'
import { makeH2 } from './markupHelpers'

////////////////////////////////////////////////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////////////////////////////////////////////////

interface Props {
  resourceUri: string;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENT
////////////////////////////////////////////////////////////////////////////////////////////////////

const Resource: React.FC<Props> = ({ resourceUri }) => {
  let projectId = null

  ////////////////////////////////////////////////////////////////////////////////
  //
  // SPARQL
  //
  ////////////////////////////////////////////////////////////////////////////////

  // Resource identity
  const { data: data__resourceIdentity, query: query__resourceIdentity } = useResourceIdentityQuery(resourceUri)

  // Project ID
  const identityData: IdentityData = extractDataFromIdentityBindings(data__resourceIdentity)

  for (const b of identityData.identityBindings) {
    if (b.r_type_type?.value === E55_BUSINESS_ID) {
      projectId = b.label.value.split('/')[1]
    }
  }

  // Media representation
  const mediaRepresentation = guessMediaRepresentation(identityData, projectId)

  // Outgoing predicates :: count
  const { data: data__countObjectsOfOutgoingPredicates, /*query: query__countObjectsOfOutgoingPredicates*/ } = useCountObjectsOfOutgoingPredicatesQuery(resourceUri)
  const outgoingPredicatesCountData = extractDataFromOutgoingPredicatesCountSparqlQueryResult(data__countObjectsOfOutgoingPredicates)

  // Outgoing predicates :: low-fan
  const { data: data__objectsOfLowFanOutgoingPredicates, query: query__objectsOfLowFanOutgoingPredicatesData } = useObjectsOfLowFanOutgoingPredicatesQuery(resourceUri, outgoingPredicatesCountData.lowFanOutPredicates, outgoingPredicatesCountData.lowFanOutPredicates.length > 0)
  let literalObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  let nonLiteralObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  data__objectsOfLowFanOutgoingPredicates?.results.bindings.map(x => {
    if (x.lr.type == 'literal') literalObjectsOfLowFanOutgoingPredicatesBindings.push(x)
    else nonLiteralObjectsOfLowFanOutgoingPredicatesBindings.push(x)
  })
  let nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR: Record<string, any> = groupByLPLR(nonLiteralObjectsOfLowFanOutgoingPredicatesBindings)

  // .1 Properties
  const { data: data__dotOneProperties, query: query__dotOneProperties } = useDotOnePropertiesQuery(resourceUri)
  const dotOnePropertiesBindings = data__dotOneProperties?.results.bindings || []

  // E13 with literal P141
  const { data: data__e13WithLiteralP141, query: query__e13WithLiteralP141 } = useE13WithLiteralP141Query(resourceUri)
  const e13WithLiteralP141Bindings = data__e13WithLiteralP141?.results.bindings || []

  ////////////////////////////////////////////////////////////////////////////////
  //
  // <>
  //
  ////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className='bg-background px-6 text-foreground light'>
        {makeH2('Identité de la ressource', <FaIdCard />, query__resourceIdentity)}
        <BindingsTable
          bindings={data__resourceIdentity?.results.bindings || []}
        />

        {mediaRepresentation && <>
          <PredicateSectionTitle direction={null} icon={mediaRepresentation[1]} title={mediaRepresentation[0]} prefixedUri={null} sparqlQuery={null} link={mediaRepresentation[2]} n={null} />
          <div className='flex justify-center p-11 w-full text-center'>
            {mediaRepresentation[3]}
          </div>
        </>
        }

        {/* {literalObjectsOfLowFanOutgoingPredicatesBindings.length > 0 && <>
          <PredicateSectionTitle direction={null} link={null} icon={null} title='propriétés' prefixedUri={null} sparqlQuery={''} n={null} />
          <div className='px-6 py-6'>
            <POTable bindings={literalObjectsOfLowFanOutgoingPredicatesBindings.map(x => ({ label: x.lr, p: x.lp }))} />
          </div>
        </>
        } */}

        {dotOnePropertiesBindings.length > 0 && <>
          {makeH2('Propriétés', <FaPenNib />, query__dotOneProperties)}
          <BindingsTable
            bindings={dotOnePropertiesBindings}
          />
        </>
        }

        {e13WithLiteralP141Bindings.length > 0 && <>
          {makeH2('Propriétés', <FaPenNib />, query__e13WithLiteralP141)}
          <BindingsTable
            bindings={data__e13WithLiteralP141?.results.bindings
              .sort(sortBindingsFn('p177_label'))
              || []}
          />
        </>}

        {Object.keys(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).length != 0 && (
          <>
            {makeH2('Ressources pointées', <PiGraphDuotone />, query__objectsOfLowFanOutgoingPredicatesData)}
            <LinkedResourcesBindingsTable bindings={nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR} />
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
      <DarkPart resourceUri={resourceUri} />
    </>
  )
}

export default Resource