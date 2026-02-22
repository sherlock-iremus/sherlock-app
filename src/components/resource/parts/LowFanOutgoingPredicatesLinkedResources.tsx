import { makeH2 } from "@/components/layout/markupHelpers"
import { groupByLPLR } from "@/utils/bindingsHelpers"
import { PiGraphDuotone } from "react-icons/pi"
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { LinkedResourcesBindingsTable } from "../BindingTables"

export default function ({ bindings, query }: {
    bindings: SparqlQueryResultObject_Binding[]
    query: string
}) {
    let nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR: Record<string, any> = groupByLPLR(bindings)
    return Object.keys(nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR).length != 0
        ? <>
            {makeH2('Ressources liées', <PiGraphDuotone />, query)}
            <LinkedResourcesBindingsTable bindings={nonLiteralOtherOutgoingPredicatesBindingsGroupedByLPLR} />
        </>
        : ''
}