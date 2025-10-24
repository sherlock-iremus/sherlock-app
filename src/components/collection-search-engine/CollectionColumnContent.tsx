import React from 'react';
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result';
import { SingleCollectionProps } from '@/components/collection-search-engine/CollectionSearchEngine';

interface CollectionColumnContentProps {
    bindingsOfSameItem: SparqlQueryResultObject_Binding[];
    collections: SingleCollectionProps[];
}

export const CollectionColumnContent: React.FC<CollectionColumnContentProps> = ({
    bindingsOfSameItem,
    collections
}) => {

    return collections.find(c => c.collectionUri === bindingsOfSameItem[0].collection_uri.value)?.collectionName || 'Collection inconnue'
};