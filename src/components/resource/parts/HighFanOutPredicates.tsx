import { makeH2 } from "@/components/layout/markupHelpers"
import { OutgoingPredicatesData } from "@/utils/bindingsHelpers"
import { GiHerbsBundle } from "react-icons/gi"
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import HighFanOutPredicate from "./HighFanOutPredicate"

interface Props {
    bindings: SparqlQueryResultObject_Binding[]
    outgoingPredicatesCountData: OutgoingPredicatesData
    query: string
    resourceUri: string
}

const X: React.FC<Props> = ({ bindings, outgoingPredicatesCountData, query, resourceUri }) => {
    return bindings.length > 0
        ? <>
            {makeH2('Prédicats à degré sortant élevé', <GiHerbsBundle />, query)}
            {
                outgoingPredicatesCountData.highFanOutPredicatesBindings.map(binding => {
                    let k = 0
                    const n = parseInt(binding.c.value)
                    return (
                        <div key={k++}>
                            <HighFanOutPredicate resourceUri={resourceUri} predicateUri={binding.lp.value} n={n} />
                        </div>
                    )
                })
            }
        </>
        : ''
}

export default X