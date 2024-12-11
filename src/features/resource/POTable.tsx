import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { PrefixedUri, makePrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md"
import { PiTextAaLight, PiLinkSimpleHorizontalBreakDuotone, PiTagSimpleDuotone } from "react-icons/pi"
import { displayLabel, makeClickablePrefixedUri, makeLinkedResourceTypesFragment, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'

export default function ({ bindings }: {
    bindings: SparqlQueryResultObject_Binding[]
}) {
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
            <TableColumn key='header_p' className="table-header">prédicat</TableColumn>
            <TableColumn key='header_o' className="table-header">valeur ou ressource liée</TableColumn>
        </TableHeader>
        <TableBody>
            {bindings.map((b: SparqlQueryResultObject_Binding, i: number) => {
                const p = b.hasOwnProperty('p') ? makePrefixedUri(b["p"].value) : new PrefixedUri('', '')

                return <TableRow className="border-b border-b-data_table_border last:border-none" key={i}>
                    {/* PRÉDICAT */}
                    <TableCell key='cell_p' className='align-top'>
                        {makeNonClickablePrefixedUri(p, ['text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_local_name_lightbg'])}
                    </TableCell>
                    {/* OBJET */}
                    <TableCell key='cell_r' className='p-0 align-middle'>
                        <table>
                            <tbody>
                                {b['label'] && <tr>
                                    <td className="pr-2"><PiTextAaLight className='resource_icon' /></td>
                                    <td>{displayLabel(b["label"])}</td>
                                </tr>}
                                {b["r_type"] && <tr>
                                    <td className=""><PiTagSimpleDuotone className='resource_icon' /></td>
                                    <td className="pr-2">{makeLinkedResourceTypesFragment(b)}</td>
                                </tr>}
                                {b['r'] && <tr>
                                    <td className="pr-2 align-text-top"><PiLinkSimpleHorizontalBreakDuotone className='resource_icon' /></td>
                                    <td>{makeClickablePrefixedUri(b["r"].value, makePrefixedUri(b["r"].value))}</td>
                                </tr>}
                            </tbody>
                        </table>
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table >
}