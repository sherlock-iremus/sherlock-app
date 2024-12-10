import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { PrefixedUri, makePrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md"
import { PiChatTextDuotone, PiLinkSimpleHorizontalBreakDuotone, PiTagSimpleDuotone } from "react-icons/pi"
import { displayLabel, makeClickablePrefixedUri, makeLinkedResourceTypesFragment, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'

export default function ({ bindings }: {
    bindings: SparqlQueryResultObject_Binding[]
}) {
    const headerColumns = [
        <TableColumn key='header_p' className="table-header">prédicat</TableColumn>,
        <TableColumn key='header_o' className="table-header">valeur ou ressource liée</TableColumn>
    ]

    return <Table
        aria-label="potable"
        classNames={{
            thead: "hidden ",
            th: "bg-transparent border-b border-b-data_table_border px-0",
            td: "align-text-top pl-0 pr-4",
        }}
        isCompact={true}
        radius='none'
        removeWrapper={true}
        shadow='none'
    >
        <TableHeader className='hidden'>
            {headerColumns}
        </TableHeader>
        <TableBody>
            {bindings.map((b: SparqlQueryResultObject_Binding, i: number) => {
                const p = b.hasOwnProperty('p') ? makePrefixedUri(b["p"].value) : new PrefixedUri('', '')
                const cells = []

                // PRÉDICAT
                cells.push(
                    <TableCell key='cell_p' className='align-middle'>
                        {makeNonClickablePrefixedUri(p, ['text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_local_name_lightbg'])}
                    </TableCell>
                )

                // OBJET
                b["r"] && b["r_type"]
                    ? cells.push(
                        <TableCell key='cell_r' className='p-0 align-middle'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="pr-2 align-text-top"><PiLinkSimpleHorizontalBreakDuotone className='resource_icon' /></td>
                                        <td>{makeClickablePrefixedUri(b["r"].value, makePrefixedUri(b["r"].value))}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='flex mr-6 ml-6'>
                                <MdOutlineSubdirectoryArrowRight className='ml-1 linked_entity_icon' />
                                <table className="border-[1px] bg-stone-50 mb-1 border-l-data_table_border border-l-solid">
                                    <tbody>
                                        {b["label"] && <tr>
                                            <td className="pr-2 pl-2 align-text-top"><PiChatTextDuotone className='resource_icon' /></td>
                                            <td className="pr-2">{displayLabel(b["label"])}</td>
                                        </tr>}
                                        <tr>
                                            <td className="pl-2 align-text-top"><PiTagSimpleDuotone className='resource_icon' /></td>
                                            <td className="pr-2">{makeLinkedResourceTypesFragment(b)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TableCell>
                    )
                    : cells.push(
                        <TableCell key='cell_r' className='align-middle'>
                            <table>
                                <tbody>
                                    {b["label"] && <tr>
                                        <td className="pr-2 align-text-top"><PiChatTextDuotone className='resource_icon' /></td>
                                        <td>{displayLabel(b["label"])}</td>
                                    </tr>}
                                    {b["r"] && <tr>
                                        <td className="pr-2 align-text-top"><PiLinkSimpleHorizontalBreakDuotone className='resource_icon' /></td>
                                        <td>{makeClickablePrefixedUri(b["r"].value, makePrefixedUri(b["r"].value))}</td>
                                    </tr>}
                                </tbody>
                            </table>
                        </TableCell>
                    )

                return <TableRow className="border-b border-b-data_table_border last:border-none" key={i}>
                    {cells}
                </TableRow>
            })}
        </TableBody>
    </Table >
}