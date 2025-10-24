import Link from '@/components/buttons-and-links/Link';
import { DISPLAY_E13_TOOLTIP } from '@/components/collection-search-engine/CollectionSearchEngine';
import { makeNonClickablePrefixedUri } from '@/components/resource/TriplesDisplayHelpers';
import { groupByFields } from '@/utils/bindingsHelpers';
import { Tooltip } from '@heroui/react';
import React, { JSX, useMemo } from 'react';
import { PiLinkDuotone } from 'react-icons/pi';
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes';
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result';

interface QueryResultColumnContentProps {
    bindingsOfSameItem: SparqlQueryResultObject_Binding[];
}

export const QueryResultColumnContent: React.FC<QueryResultColumnContentProps> = ({
    bindingsOfSameItem,
}) => {

    const displayIdentifier = (row: SparqlQueryResultObject_Binding): JSX.Element => {
        return row.identifier ? <span className='text-gray-500 text-xs'>(<Link href={row.identifier.value} target="_blank">
            <PiLinkDuotone className='inline mb-1 ml-1 text-xl' />{row.type_label.value}
        </Link>)</span> : <></>;
    }

    const getSignificantE13Bindings = (bindings: SparqlQueryResultObject_Binding[]): SparqlQueryResultObject_Binding[] => {
        return bindings.filter((row: SparqlQueryResultObject_Binding) => row.e13 && row.e13?.value == row.e13_indexed?.value);
    }

    const tooltipContent = (item: SparqlQueryResultObject_Binding[]) => {
        return <div className="bg-gray-50 p-2 border border-gray-300 rounded whitespace-pre-line">
            <strong>Propriétés associées :</strong><br />
            {item.filter((row: SparqlQueryResultObject_Binding) => !!row.p177).map((row: SparqlQueryResultObject_Binding) => `${row.p177_label ? row.p177_label.value : row.p177.value} -> ${row.p141.value}`).join('\n')}
        </div>
    }

    const getQueryResultColumnContentRow = (row: SparqlQueryResultObject_Binding) => {
        // If "p177" is set, then we have to get its value. Otherwise, we display "p" because it is directly readable.
        if (row.p177) {
            return <p key={row.p177_label.value + row.p141.value}>
                {/* <Link target='_blank' href={'/?resource=' + row.p177.value} onClick={e => e.stopPropagation()}>
                    {row.p177_label ? row.p177_label.value : 'Propriété inconnue'}
                </Link> : {row.p141.value} */}
                <span className='font-serif font-bold'>{row.p177_label.value}</span> : {row.p141.value}
            </p>
        } else {
            return <p key={row.p.value + row.lit.value + row.type_label?.value}>
                {makeNonClickablePrefixedUri(makePrefixedUri(row.p.value), '')} : {row.lit.value} {displayIdentifier(row)}
            </p>

        }

    }

    // All indexations. We have to filter because group by does not exclude items if columns are missing.
    const uniqueDirectIndexation = useMemo(() => Object.values(groupByFields(bindingsOfSameItem, ['p', 'lit', 'type_label'])).map((row) => row[0]).filter((row) => row.p), [bindingsOfSameItem]);
    const uniqueE13Indexation = useMemo(() => Object.values(groupByFields(bindingsOfSameItem, ['e13'])).map((row) => row[0]), [bindingsOfSameItem]);
    const significantE13Bindings = useMemo(() => getSignificantE13Bindings(bindingsOfSameItem), [bindingsOfSameItem]);
    const queryResults = useMemo(() => uniqueDirectIndexation.concat(significantE13Bindings), [uniqueDirectIndexation, significantE13Bindings]);

    return <Tooltip
        content={tooltipContent(uniqueE13Indexation)}
        placement="top"
        isDisabled={!DISPLAY_E13_TOOLTIP || significantE13Bindings.length === 0}
    ><div>
            {queryResults.map((row: SparqlQueryResultObject_Binding) =>
                getQueryResultColumnContentRow(row)
            )}
        </div>
    </Tooltip>
};