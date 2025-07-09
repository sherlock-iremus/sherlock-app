import { groupByFields } from '@/utils/bindings_helpers';
import React from 'react';
import { useMemo } from 'react';
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result';
import { makeClickablePrefixedUri } from '../../features/resource/TriplesDisplayHelpers'
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'

interface IdentityColumnContentProps {
    bindingsOfSameItem: SparqlQueryResultObject_Binding[];
}

export const IdentityColumnContent: React.FC<IdentityColumnContentProps> = ({
    bindingsOfSameItem,
}) => {
    const groupedByItemLabel = useMemo(() => Object.values(groupByFields(bindingsOfSameItem, ['item_label_p', 'item_label'])), [bindingsOfSameItem]);

    return groupedByItemLabel.map((row: SparqlQueryResultObject_Binding[]) =>
              <p key={row[0].item_label_p.value + row[0].item_label.value}>
                {makeClickablePrefixedUri(row[0].item_label_p.value, makePrefixedUri(row[0].item_label_p.value))} : {row[0].item_label.value}
              </p>
            )
};