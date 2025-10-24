import { makeH2 } from "@/components/layout/markupHelpers"
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { BindingsTable } from "../BindingTables"
import { FaIdCard } from "react-icons/fa"

interface Props {
    bindings: SparqlQueryResultObject_Binding[]
    query: string
}

const X: React.FC<Props> = ({ bindings, query }) => {

    return bindings.length > 0 && <>
        {makeH2('Propriétés', <FaIdCard />, query)}
        <BindingsTable bindings={bindings.map(x => ({ label: x.lr, p: x.lp }))} />
    </>
}

export default X