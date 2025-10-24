import { useCountObjectsOfOutgoingPredicatesQuery, useObjectsOfLowFanOutgoingPredicatesQuery, useResourceIdentityQuery } from '@/hooks/sherlockSparql'
import { extractDataFromOutgoingPredicatesCountSparqlQueryResult, groupByLPLR } from '@/utils/bindingsHelpers'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import Dotone from './parts/CRMDotOneProperties'
import E13 from './parts/CRME13WithLiteraP141'
import Identity from './parts/Identity'
import MediaRepresentation from './parts/MediaRepresentation'

interface Props {
  resourceUri: string
}

const Resource: React.FC<Props> = ({ resourceUri }) => {
  const { data: dataId, query: queryId } = useResourceIdentityQuery(resourceUri)



  const { data: data__countOutgoing, query: query__countOutgoing } = useCountObjectsOfOutgoingPredicatesQuery(resourceUri)
  const outgoingPredicatesCountData = extractDataFromOutgoingPredicatesCountSparqlQueryResult(data__countOutgoing)

  const { data: data__objectsOfLowFanOutgoingPredicates, query: query__objectsOfLowFanOutgoingPredicatesData } = useObjectsOfLowFanOutgoingPredicatesQuery(resourceUri, outgoingPredicatesCountData.lowFanOutPredicates, outgoingPredicatesCountData.lowFanOutPredicates.length > 0)
  let literalObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  let nonLiteralObjectsOfLowFanOutgoingPredicatesBindings: SparqlQueryResultObject_Binding[] = []
  data__objectsOfLowFanOutgoingPredicates?.results.bindings.map(x => {
    if (x.lr.type == 'literal') literalObjectsOfLowFanOutgoingPredicatesBindings.push(x)
    else nonLiteralObjectsOfLowFanOutgoingPredicatesBindings.push(x)
  })
  let nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR: Record<string, any> = groupByLPLR(nonLiteralObjectsOfLowFanOutgoingPredicatesBindings)



  return (
    <>
      <div className='bg-background mb-6 px-6 text-foreground light'>
        <Identity resourceIdentityBindings={dataId} resourceIdentityQuery={queryId} />
        <MediaRepresentation resourceIdentityBindings={dataId} />
        <Dotone resourceUri={resourceUri} />
        <E13 resourceUri={resourceUri} />
      </div>
    </>
  )

  //       {literalObjectsOfLowFanOutgoingPredicatesBindings.length > 0 && <>
  //         {makeH2('Propriétés', <FaIdCard />, query__objectsOfLowFanOutgoingPredicatesData)}
  //         <BindingsTable bindings={literalObjectsOfLowFanOutgoingPredicatesBindings.map(x => ({ label: x.lr, p: x.lp }))} />
  //       </>}


  //       {Object.keys(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).length != 0 && (
  //         <>
  //           {makeH2('Ressources liées', <PiGraphDuotone />, query__objectsOfLowFanOutgoingPredicatesData)}
  //           <LinkedResourcesBindingsTable bindings={nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR} />
  //         </>
  //       )}

  //       {outgoingPredicatesCountData.highFanOutPredicatesBindings.length > 0 && makeH2('Prédicats à degré sortant élevé', <GiHerbsBundle />, query__countObjectsOfOutgoingPredicates)}
  //       {outgoingPredicatesCountData.highFanOutPredicatesBindings.map(binding => {
  //         let k = 0
  //         const n = parseInt(binding.c.value)
  //         return (
  //           <div key={k++}>
  //             <HighFanOutPredicate resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} />
  //           </div>
  //         )
  //       })}
}

export default Resource