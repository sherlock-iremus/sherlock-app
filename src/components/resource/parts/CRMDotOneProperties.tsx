import { makeH2 } from "@/components/layout/markupHelpers"
import { useDotOnePropertiesQuery } from "@/hooks/sherlockSparql"
import { FaPenNib } from "react-icons/fa"
import { BindingsTable } from "../BindingTables"
import { SparqlQueryResultObject_Variable } from "sherlock-rdf/lib/sparql-result"
import { Type } from "sherlock-rdf/lib/rdf-literal"

interface Props {
    resourceUri: string,
}

const X: React.FC<Props> = ({ resourceUri }) => {
    const { data: data__dotOneProperties, query: query__dotOneProperties } = useDotOnePropertiesQuery(resourceUri)
    const dotOnePropertiesBindings = data__dotOneProperties?.results.bindings || []

    for (const p of dotOnePropertiesBindings) {
        let v = new SparqlQueryResultObject_Variable()
        v.type = Type.literal
        v.value = "true"
        p.markdown = v
    }

    return dotOnePropertiesBindings.length > 0
        ? <>
            {makeH2('Propriétés', <FaPenNib />, query__dotOneProperties)}
            <BindingsTable bindings={dotOnePropertiesBindings} />
        </> : ''
}

export default X