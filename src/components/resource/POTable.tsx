import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { getGraphName, makePrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"
import { Link } from 'react-router-dom'
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md"
import { PiChatTextDuotone, PiLinkSimpleHorizontalBreakDuotone, PiTagSimpleDuotone } from "react-icons/pi"
import { displayLabel, makeClickablePrefixedUri, makeLinkedResourceTypesFragment, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'

export default function ({ bindings, linkedResources }: {
    bindings: SparqlQueryResultObject_Binding[],
    linkedResources: boolean
}) {

    const headerColumns = [
        <TableColumn key='header_p' className="table-header">prédicat</TableColumn>,
        <TableColumn key='header_o' className="table-header">valeur ou ressource liée</TableColumn>,
        <TableColumn key='header_g' className="table-header">graphe</TableColumn>,
    ]
    if (linkedResources) {
        headerColumns.unshift(<TableColumn key='header_lr' className="table-header">{linkedResources ? 'ressource liée' : ''}</TableColumn>)
        headerColumns.unshift(<TableColumn key='header_lp' className="table-header">{linkedResources ? 'prédicat liant' : ''}</TableColumn>)
    }

    return <Table
        aria-label="potable"
        classNames={{
            th: "bg-transparent border-b border-b-data_table_border px-0",
            td: "align-text-top pl-0 pr-4 text-base",
        }}
        isCompact={true}
        radius='none'
        removeWrapper={true}
        shadow='none'
    >
        <TableHeader>
            {headerColumns}
        </TableHeader>
        <TableBody>
            {bindings.map((b: SparqlQueryResultObject_Binding, i: number) => {
                const p = b.hasOwnProperty('p') ? makePrefixedUri(b["p"].value) : ''
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
                        <TableCell key='cell_r' className='align-middle p-0'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="pr-2 align-text-top"><PiLinkSimpleHorizontalBreakDuotone className='resource_icon' /></td>
                                        <td>{makeClickablePrefixedUri(b["r"].value, makePrefixedUri(b["r"].value))}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='flex ml-6 mr-6'>
                                <MdOutlineSubdirectoryArrowRight className='ml-1 linked_entity_icon' />
                                <table className="bg-stone-50 mb-1 border-[1px] border-l-solid border-l-data_table_border">
                                    <tbody>
                                        <tr>
                                            <td className="pl-2 align-text-top"><PiTagSimpleDuotone className='resource_icon' /></td>
                                            <td className="pr-2">{makeLinkedResourceTypesFragment(b)}</td>
                                        </tr>
                                        {b["label"] && <tr>
                                            <td className="pl-2 pr-2 align-text-top"><PiChatTextDuotone className='resource_icon' /></td>
                                            <td className="pr-2">{displayLabel(b["label"])}</td>
                                        </tr>}
                                    </tbody>
                                </table>
                            </div>
                        </TableCell>
                    )
                    : cells.push(
                        <TableCell key='cell_r' className='align-middle'>
                            <table>
                                <tbody>
                                    {b["r"] && <tr>
                                        <td className="pr-2 align-text-top"><PiLinkSimpleHorizontalBreakDuotone className='resource_icon' /></td>
                                        <td>{makeClickablePrefixedUri(b["r"].value, makePrefixedUri(b["r"].value))}</td>
                                    </tr>}
                                    {b["label"] && <tr>
                                        <td className="pr-2 align-text-top"><PiChatTextDuotone className='resource_icon' /></td>
                                        <td>{displayLabel(b["label"])}</td>
                                    </tr>}
                                </tbody>
                            </table>
                        </TableCell>
                    )

                //GRAPHE
                cells.push(
                    <TableCell key='cell_g' className='align-middle'>
                        <Link to={'/?resource=' + b["g"].value}>{getGraphName(b["g"].value)}</Link>
                    </TableCell>
                )


                if (linkedResources) {
                    // RESSOURCE LIÉE
                    cells.unshift(
                        <TableCell key='cell_lr' className='align-middle'>
                            {
                                linkedResources
                                    ? makeClickablePrefixedUri(b["lr"].value, makePrefixedUri(b["lr"].value))
                                    : ''
                            }
                        </TableCell>
                    )
                    // PRÉDICAT LIANT
                    cells.unshift(
                        <TableCell key='cell_lp' className='align-middle'>
                            {
                                linkedResources
                                    ? makeNonClickablePrefixedUri(makePrefixedUri(b["lp"].value), ['text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_prefix_lightbg', 'text-prefixed_uri_local_name_lightbg'])
                                    : ''
                            }
                        </TableCell>)
                }

                return <TableRow className="border-b border-b-data_table_border" key={i}>
                    {cells}
                </TableRow>
            })}
        </TableBody>
    </Table >
}