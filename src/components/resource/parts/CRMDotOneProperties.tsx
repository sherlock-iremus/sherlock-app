import { makeH2 } from "@/components/layout/markupHelpers"
import { useDotOnePropertiesQuery } from "@/hooks/sherlockSparql"
import { FaPenNib } from "react-icons/fa"
import { BindingsTable } from "../BindingTables"

interface Props {
    resourceUri: string,
}

const X: React.FC<Props> = ({ resourceUri }) => {
    const { data: data__dotOneProperties, query: query__dotOneProperties } = useDotOnePropertiesQuery(resourceUri)
    const dotOnePropertiesBindings = data__dotOneProperties?.results.bindings || []


    return dotOnePropertiesBindings.length > 0
        ? <>
            {makeH2('Propriétés', <FaPenNib />, query__dotOneProperties)}
            <BindingsTable bindings={dotOnePropertiesBindings} />
        </> : ''
}

export default X