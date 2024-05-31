import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { SparqlQueryResultObject, SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { getGraphName, getPrefixedUri } from "sherlock-rdf/lib/rdf-prefixes"
import { Link } from 'react-router-dom'
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md"
import { PiChatTextDuotone, PiLinkSimpleHorizontalBreakDuotone, PiTagSimpleDuotone } from "react-icons/pi"
import { displayLabel, makeClickablePrefixedUri, makeLinkedResourceTypesFragment, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'

type Props = {
    data: SparqlQueryResultObject
}

export default function ({ data }: Props) {

    return <Table
        aria-label="potable"
        classNames={{
            th: "bg-transparent border-b border-b-data-table-border px-0",
            td: "align-text-top pl-0 pr-4 text-base",
        }}
        isCompact={true}
        radius='none'
        removeWrapper={true}
        shadow='none'
    >
        <TableHeader>
            <TableColumn className="table-header">prédicat</TableColumn>
            <TableColumn className="table-header">valeur ou ressource liée</TableColumn>
            <TableColumn className="table-header">graphe</TableColumn>
        </TableHeader>
        <TableBody>
            {data.results.bindings.map((b: SparqlQueryResultObject_Binding, i: number) => {
                const p = getPrefixedUri(b["p"].value)

                return <TableRow className="border-b border-b-data-table-border" key={i}>

                    {/* PRÉDICAT */}

                    <TableCell className='align-middle'>
                        {makeNonClickablePrefixedUri(p)}
                    </TableCell>

                    {/* OBJET */}
                    {
                        b["r"] && b["r_type"]
                            ? <TableCell className='align-middle p-0'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="pr-2 align-text-top"><PiLinkSimpleHorizontalBreakDuotone className='resource_icon' /></td>
                                            <td>{makeClickablePrefixedUri(b["r"].value, getPrefixedUri(b["r"].value))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className='flex ml-6'>
                                    <MdOutlineSubdirectoryArrowRight className='ml-1 linked_entity_icon' />
                                    <table className="bg-stone-50 mb-1 border-[1px] border-l-solid border-l-data-table-border">
                                        <tbody>
                                            <tr>
                                                <td className="pl-2 align-text-top"><PiTagSimpleDuotone className='resource_icon' /></td>
                                                <td className="pr-2">{makeLinkedResourceTypesFragment(b)}</td>
                                            </tr>
                                            {b["label"] && <tr>
                                                <td className="pl-2 pr-2 align-text-top"><PiChatTextDuotone className='resource_icon' /></td>
                                                <td className="pr-2">{displayLabel(b["label"].value)}</td>
                                            </tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </TableCell>
                            : <TableCell className='align-middle'>
                                <table>
                                    <tbody>
                                        {b["r"] && <tr>
                                            <td className="pr-2 align-text-top"><PiLinkSimpleHorizontalBreakDuotone className='resource_icon' /></td>
                                            <td>{makeClickablePrefixedUri(b["r"].value, getPrefixedUri(b["r"].value))}</td>
                                        </tr>}
                                        {b["label"] && <tr>
                                            <td className="pr-2 align-text-top"><PiChatTextDuotone className='resource_icon' /></td>
                                            <td>{displayLabel(b["label"].value)}</td>
                                        </tr>}
                                    </tbody>
                                </table>
                            </TableCell>
                    }

                    {/* GRAPHE */}

                    <TableCell className='align-middle'>
                        <Link to={'/?resource=' + b["g"].value}>{getGraphName(b["g"].value)}</Link>
                    </TableCell>

                </TableRow>
            })}
        </TableBody>
    </Table >
}