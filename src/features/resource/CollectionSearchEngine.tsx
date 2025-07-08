import { useGetAllProjectDataQuery } from '@/hooks/sherlockSparql';
import { groupByFields } from '@/utils/bindings_helpers';
import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@heroui/react'
import React, { JSX } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { f } from 'sherlock-sparql-queries/lib/collectionItems';
import { TbSearch } from 'react-icons/tb'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result';
import { makeYasguiButton } from '@/components/buttons';
import { makeClickablePrefixedUri } from './TriplesDisplayHelpers'
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { PiLinkDuotone } from 'react-icons/pi';

const DISPLAY_ALL_E13 = true;

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
    () => f(projectCode, collectionUris, projectGraphUri, activeSearch, DISPLAY_ALL_E13, true),
    [projectCode, collectionUris, projectGraphUri, activeSearch]
  );

  const shouldFetch = activeSearch.length > 2;
  const { data } = useGetAllProjectDataQuery(query, projectGraphUri, activeSearch, shouldFetch);
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
      <div className='flex items-center'>
        Collections : {collections.map(collection => collection.collectionName).join(', ')}
        <Input
          className='flex-1'
          isClearable
          onClear={onClear}
          onValueChange={onSearchChange}
          placeholder="Cherchez n'importe quelle donnée du projet..."
          value={searchValue}
        />
        <Button
          size='sm'
          variant='flat'
          className="flex hover:bg-teal-950 hover:border-cyan-300 border-teal-900 rounded-full w-8 h-8 text-teal-500 hover:text-teal-300 transition-all"
          isIconOnly
          radius="full"
          startContent={<TbSearch />}
          onPress={triggerSearch}
        ></Button>
        {makeYasguiButton(query, 'Requête SPARQL')}
        <div className='table-header ml-3'>({groupedData.length} items)</div>
      </div>
    )
  }, [
    searchValue,
    onSearchChange,
    groupedData,
  ]);

  const getSignificantE13Row = (item: any): SparqlQueryResultObject_Binding => {
    return item.find((row: SparqlQueryResultObject_Binding) => row.e13 && row.e13?.value == row.e13_indexed?.value);
  }

  const tooltipContent = (item: any) => {
    return <div className="whitespace-pre-line border border-gray-300 p-2 rounded bg-gray-50">
      <strong>Propriétés associées :</strong><br />
      {item.filter((row: SparqlQueryResultObject_Binding) => !!row.p177).map((row: SparqlQueryResultObject_Binding) => `${row.p177_label ? row.p177_label.value : row.p177.value} -> ${row.p141.value}`).join('\n')}
    </div>
  }

  const getE13TableRow = (item: any, row: SparqlQueryResultObject_Binding): JSX.Element => {
    return <TableRow
      key={row.item.value}
      className="hover:bg-row_hover"
    >
      <TableCell className='py-0 font-serif align-top'>
        <Tooltip
          content={tooltipContent(item)}
          placement="top"
          isDisabled={!DISPLAY_ALL_E13}
        >
          <span>
            <Link target='_blank' to={'/?resource=' + row.p177.value} onClick={e => e.stopPropagation()}>
              {row.p177_label ? row.p177_label.value : 'Propriété inconnue'} </Link> : {row.p141.value}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell> {Object.values(groupByFields(item, ['item_label_p', 'item_label'])).map((row: SparqlQueryResultObject_Binding[]) =>
          <p>
            {makeClickablePrefixedUri(row[0].item_label_p.value, makePrefixedUri(row[0].item_label_p.value))} : {row[0].item_label.value}
          </p>
        )}
      </TableCell>
      <TableCell>
        {collections.find(c => c.collectionUri === item[0].collection_uri?.value)?.collectionName || 'Collection inconnue'} <br />
      </TableCell>
    </TableRow>
  }

  const displayIdentifier = (row: SparqlQueryResultObject_Binding): JSX.Element => {
    return row.identifier ? <span className='text-xs text-gray-500'>(<Link to={row.identifier.value} target="_blank">
                                            <PiLinkDuotone className='inline mb-1 ml-1 text-xl' />{row.type_label.value}
                                        </Link>)</span> : <></>;
  }

  // TODO: Refactor this to avoid code duplication with getE13TableRow
  // TODO: use Memoization or find an alternative to groupByFields 
  const getDirectIndexTableRow = (item: SparqlQueryResultObject_Binding[]): JSX.Element => {
    return <TableRow
      key={item[0].item.value}
      className="hover:bg-row_hover"
    >
      <TableCell className='py-0 font-serif align-top'>
        {Object.values(groupByFields(item, ['p', 'lit', 'type_label'])).map((row: SparqlQueryResultObject_Binding[]) =>
          <p key={row[0].p.value + row[0].lit.value}>
            {makeClickablePrefixedUri(row[0].p.value, makePrefixedUri(row[0].p.value))} : {row[0].lit.value} {displayIdentifier(row[0])}
          </p>
        )}
      </TableCell>
      <TableCell> {Object.values(groupByFields(item, ['item_label_p', 'item_label'])).map((row: SparqlQueryResultObject_Binding[]) =>
          <p key={row[0].item_label_p.value + row[0].item_label.value}>
            {makeClickablePrefixedUri(row[0].item_label_p.value, makePrefixedUri(row[0].item_label_p.value))} : {row[0].item_label.value}
          </p>
        )}
      </TableCell>
      <TableCell>
        {collections.find(c => c.collectionUri === item[0].collection_uri.value)?.collectionName || 'Collection inconnue'} <br />
      </TableCell>
    </TableRow>
  }

  const getTableRow = (item: any) => {
    const row = getSignificantE13Row(item);
    return row ? getE13TableRow(item, row) : getDirectIndexTableRow(item);
  }

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
        {item => getTableRow(item)}
      </TableBody>
    </Table>
  )

};

export default CollectionSearchEngine;