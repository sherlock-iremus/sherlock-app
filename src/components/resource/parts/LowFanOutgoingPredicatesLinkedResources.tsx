import { makeH2 } from "@/components/layout/markupHelpers"
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { LinkedResourcesBindingsTable } from "../BindingTables"
import { PiGraphDuotone } from "react-icons/pi"
import { groupByLPLR } from "@/utils/bindingsHelpers"

interface Props {
    bindings: SparqlQueryResultObject_Binding[]
    query: string
}

const X: React.FC<Props> = ({ bindings, query }) => {
    let nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR: Record<string, any> = groupByLPLR(bindings)
    return Object.keys(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).length != 0
        ? <>
            {makeH2('Ressources liées', <PiGraphDuotone />, query)}
            <LinkedResourcesBindingsTable bindings={nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR} />
        </>
        : ''
}

export default X