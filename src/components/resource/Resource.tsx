import { useCountObjectsOfOutgoingPredicatesQuery, useObjectsOfLowFanOutgoingPredicatesQuery, useResourceIdentityQuery } from '@/hooks/sherlockSparql'
import { extractDataFromOutgoingPredicatesCountSparqlQueryResult } from '@/utils/bindingsHelpers'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import Dotone from './parts/CRMDotOneProperties'
import E13 from './parts/CRME13WithLiteraP141'
import HighFanOutPredicates from './parts/HighFanOutPredicates'
import Identity from './parts/Identity'
import LFOLR from './parts/LowFanOutgoingPredicatesLinkedResources'
import LFO from './parts/LowFanOutgoingPredicatesLiteralObjects'
import MediaRepresentation from './parts/MediaRepresentation'

interface Props {
  resourceUri: string
}

const Resource: React.FC<Props> = ({ resourceUri }) => {
  const { data: dataId, query: queryId } = useResourceIdentityQuery(resourceUri)
  const { data: dataCountOutgoing } = useCountObjectsOfOutgoingPredicatesQuery(resourceUri)
  const outgoingPredicatesCountData = extractDataFromOutgoingPredicatesCountSparqlQueryResult(dataCountOutgoing)

  const { data: data__objectsOfLowFanOutgoingPredicates, query: query__objectsOfLowFanOutgoingPredicatesData } = useObjectsOfLowFanOutgoingPredicatesQuery(resourceUri, outgoingPredicatesCountData.lowFanOutPredicates, outgoingPredicatesCountData.lowFanOutPredicates.length > 0)
  let literalObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  let nonLiteralObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  data__objectsOfLowFanOutgoingPredicates?.results.bindings.map(x => {
    if (x.lr.type == 'literal') literalObjectsOfLowFanOutgoingPredicatesBindings.push(x)
    else nonLiteralObjectsOfLowFanOutgoingPredicatesBindings.push(x)
  })

  return (
    <>
      <div className='bg-background mb-6 px-6 text-foreground light'>
        <Identity resourceIdentityBindings={dataId} resourceIdentityQuery={queryId} />
        <MediaRepresentation resourceIdentityBindings={dataId} />
        <Dotone resourceUri={resourceUri} />
        <E13 resourceUri={resourceUri} />
        <LFO bindings={literalObjectsOfLowFanOutgoingPredicatesBindings} query={query__objectsOfLowFanOutgoingPredicatesData} />
        <LFOLR bindings={nonLiteralObjectsOfLowFanOutgoingPredicatesBindings} query={query__objectsOfLowFanOutgoingPredicatesData} />
        <HighFanOutPredicates
          bindings={outgoingPredicatesCountData.highFanOutPredicatesBindings}
          outgoingPredicatesCountData={outgoingPredicatesCountData}
          query={query__objectsOfLowFanOutgoingPredicatesData}
          resourceUri={resourceUri}
        />
      </div>
    </>
  )
}

export default Resource