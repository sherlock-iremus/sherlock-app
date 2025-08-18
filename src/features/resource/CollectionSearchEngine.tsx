import { useGetAllProjectDataQuery } from '@/hooks/sherlockSparql';
import { groupByFields } from '@/utils/bindings_helpers';
import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { f } from 'sherlock-sparql-queries/lib/collectionItems';
import { TbSearch } from 'react-icons/tb'
import { makeYasguiButton } from '@/components/buttons';
import { QueryResultColumnContent } from '@/components/collection-search-engine/QueryResultColumnContent';
import { IdentityColumnContent } from '@/components/collection-search-engine/IdentityColumnContent';
import { CollectionColumnContent } from '@/components/collection-search-engine/CollectionColumnContent';

export const DISPLAY_E13_TOOLTIP = false;
export const QUERY_E13 = true;

// Accepts an array of collection props and a single projectGraphUri
export type SingleCollectionProps = {
  collectionName: string;
  collectionUri: string;
};

export type CollectionSearchEngineProps = {
  collections: SingleCollectionProps[];
  projectCode: string;
  projectGraphUri: string;
};

const CollectionSearchEngine: React.FC<CollectionSearchEngineProps> = ({
  collections,
  projectCode,
  projectGraphUri,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const collectionUris = useMemo(() => collections.map(collection => collection.collectionUri), [collections]);
  const query = useMemo(
    () => f(projectCode, collectionUris, projectGraphUri, activeSearch, QUERY_E13, DISPLAY_E13_TOOLTIP),
    [projectCode, collectionUris, projectGraphUri, activeSearch]
  );

  const shouldFetch = activeSearch.length > 2;
  const { data, isLoading } = useGetAllProjectDataQuery(query, projectGraphUri, activeSearch, shouldFetch);
  const groupedData = useMemo(
    () => Object.values(groupByFields(data?.results.bindings || [], 'item')),
    [data?.results.bindings]
  );

  const triggerSearch = () => {
    if (searchValue.length > 2) {
      setActiveSearch(searchValue);
    }
  }

  const onSearchChange = (value?: string) => {
    if (value) {
      setSearchValue(value)
    } else {
      setSearchValue('')
    }
  }

  const onClear = useCallback(() => {
    setSearchValue('')
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col w-full'>
        <div className='flex items-center'>
          Collections : {collections.map(collection => collection.collectionName).join(', ')}
          <Input
            className='flex-1'
            isClearable
            onClear={onClear}
            onValueChange={onSearchChange}
            placeholder="Cherchez n'importe quelle donnée du projet..."
            value={searchValue}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                triggerSearch();
              }
            }}
          />
          <Button
            size='sm'
            variant='flat'
            className="flex border-teal-900 rounded-full w-8 h-8 text-teal-500 transition-all"
            isIconOnly
            radius="full"
            startContent={<TbSearch />}
            onPress={triggerSearch}
          ></Button>
          {makeYasguiButton(query, 'Requête SPARQL')}
          <div className='table-header ml-3'>({groupedData.length} items)</div>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center py-4 w-full">
            <span className="border-t-2 border-b-2 rounded-full w-8 h-8 animate-spin"></span>
            <span className="ml-3">Recherche en cours...</span>
          </div>
        )}
      </div>
    )
  }, [
    searchValue,
    onSearchChange,
    groupedData,
    isLoading
  ]);

  return (
    <Table
      aria-label="Collection Search Engine"
      topContent={topContent}
      topContentPlacement='inside'
      onRowAction={(key) => navigate('/?resource=' + key)}
    >
      <TableHeader>
        <TableColumn key='object' allowsSorting>Résultat de recherche</TableColumn>
        <TableColumn key='label' allowsSorting>Identité de la ressource</TableColumn>
        <TableColumn key='collection' allowsSorting>Collection</TableColumn>
      </TableHeader>
      <TableBody items={groupedData}>
        {bindingsOfSameItem => (
          <TableRow key={bindingsOfSameItem[0].item.value} className="hover:bg-row_hover">
            <TableCell className='py-0 font-serif align-top'>
              <QueryResultColumnContent bindingsOfSameItem={bindingsOfSameItem} />
            </TableCell>
            <TableCell>
              <IdentityColumnContent bindingsOfSameItem={bindingsOfSameItem} />
            </TableCell>
            <TableCell>
              <CollectionColumnContent bindingsOfSameItem={bindingsOfSameItem} collections={collections} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

};

export default CollectionSearchEngine;