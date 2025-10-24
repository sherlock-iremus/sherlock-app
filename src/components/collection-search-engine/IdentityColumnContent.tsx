import { makeNonClickablePrefixedUri } from '@/components/resource/TriplesDisplayHelpers';
import { groupByFields } from '@/utils/bindingsHelpers';
import React, { useMemo } from 'react';
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes';
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result';

interface IdentityColumnContentProps {
  bindingsOfSameItem: SparqlQueryResultObject_Binding[];
}

export const IdentityColumnContent: React.FC<IdentityColumnContentProps> = ({ bindingsOfSameItem, }) => {
  const groupedByItemLabel = useMemo(() => Object.values(groupByFields(bindingsOfSameItem, ['item_label_p', 'item_label'])), [bindingsOfSameItem]);

  return groupedByItemLabel.map((row: SparqlQueryResultObject_Binding[]) =>
    <p key={row[0].item_label_p.value + row[0].item_label.value}>
      {makeNonClickablePrefixedUri(makePrefixedUri(row[0].item_label_p.value), '')} : {row[0].item_label.value}
    </p>
  )
};