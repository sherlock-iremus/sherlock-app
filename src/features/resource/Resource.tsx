import LinkButton from '@/components/LinkButton'
import { useCountObjectsOfOutgoingPredicatesQuery, useDotOnePropertiesQuery, useE13WithLiteralP141Query, useObjectsOfLowFanOutgoingPredicatesQuery, useResourceIdentityQuery } from '@/hooks/sherlockSparql'
import { IdentityData, extractDataFromIdentityBindings, extractDataFromOutgoingPredicatesCountSparqlQueryResult, groupByLPLR } from '@/utils/bindings_helpers'
import { BsFiletypeXml } from "react-icons/bs"
import { FaIdCard, FaPenNib } from 'react-icons/fa'
import { GiHerbsBundle } from "react-icons/gi"
import { PiGitBranchDuotone, PiGraphDuotone } from 'react-icons/pi'
import { E55_BUSINESS_ID } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { BindingsTable, LinkedResourcesBindingsTable } from './BindingTables'
import DarkPart from './DarkPart'
import { guessMediaRepresentation, sortBindingsFn } from './helpers'
import HighFanOutPredicate from './HighFanOutPredicate'
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
  const { data: data__countObjectsOfOutgoingPredicates, query: query__countObjectsOfOutgoingPredicates } = useCountObjectsOfOutgoingPredicatesQuery(resourceUri)
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
          {makeH2(
            mediaRepresentation.title,
            mediaRepresentation.icon,
            '',
            <>
              <LinkButton content='URI du fichier TEI dans sa forge' href={mediaRepresentation.forgeFileUri} icon={<PiGitBranchDuotone />} />
              <LinkButton content='URI du fichier TEI' href={mediaRepresentation.fileUri} icon={<BsFiletypeXml />} />
            </>
          )}
          <div className='flex justify-center p-11 w-full text-center'>
            {mediaRepresentation.component}
          </div>
        </>}

        {literalObjectsOfLowFanOutgoingPredicatesBindings.length > 0 && <>
          {makeH2('Propriétés', <FaIdCard />, query__objectsOfLowFanOutgoingPredicatesData)}
          <BindingsTable bindings={literalObjectsOfLowFanOutgoingPredicatesBindings.map(x => ({ label: x.lr, p: x.lp }))} />
        </>}

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
            {makeH2('Ressources liées', <PiGraphDuotone />, query__objectsOfLowFanOutgoingPredicatesData)}
            <LinkedResourcesBindingsTable bindings={nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR} />
          </>
        )}

        {outgoingPredicatesCountData.highFanOutPredicatesBindings.length > 0 && makeH2('Prédicats à degré sortant élevé', <GiHerbsBundle />, query__countObjectsOfOutgoingPredicates)}
        {outgoingPredicatesCountData.highFanOutPredicatesBindings.map(binding => {
          let k = 0
          const n = parseInt(binding.c.value)
          return (
            <div key={k++}>
              <HighFanOutPredicate resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} />
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