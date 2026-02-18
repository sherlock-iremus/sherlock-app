import { makeH2 } from "@/components/layout/markupHelpers"
import { useE13WithLiteralP141Query } from "@/hooks/sherlockSparql"
import { sortBindingsFn } from "@/utils/bindingsHelpers"
import { FaPenNib } from "react-icons/fa"
import { BindingsTable } from "../BindingTables"

interface Props {
    resourceUri: string,
}

const X: React.FC<Props> = ({ resourceUri }) => {
    const { data, query } = useE13WithLiteralP141Query(resourceUri)
    const e13WithLiteralP141Bindings = data?.results.bindings || []

    return e13WithLiteralP141Bindings.length > 0 && <>
        {makeH2('Propriétés', <FaPenNib />, query)}
        <BindingsTable
            bindings={data?.results.bindings.sort(sortBindingsFn('p177_label')) || []}
            wrapper={true}
        />
    </>
}

export default X