import { useGetAllProjectDataQuery } from '@/hooks/sherlockSparql';
import { groupByField } from '@/utils/bindings_helpers';
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

const DISPLAY_ALL_E13 = true;

type CollectionSearchEngineProps = {
  collectionShortName: string;
  collectionName: string;
  collectionUri: string;
};


const CollectionSearchEngine: React.FC<CollectionSearchEngineProps> = ({
  collectionShortName,
  collectionName,
  collectionUri,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const query = useMemo(
    () => f(collectionShortName, collectionUri, searchValue, true, DISPLAY_ALL_E13),
    [collectionShortName, collectionUri, searchValue, true]
  );

  const { data, refetch } = useGetAllProjectDataQuery(query, collectionUri, searchValue, true, false, DISPLAY_ALL_E13)
  const groupedData = useMemo(
    () => Object.values(groupByField(data?.results.bindings || [], 'item')),
    [data?.results.bindings]
  );

  console.log(groupedData);
  const triggerSearch = () => {
    if (searchValue.length > 2) {
      refetch()
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
       Collection : {collectionName} 
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
      {item.map((row: any) => `${row.p177_label ? row.p177_label.value : row.p177?.value} -> ${row.p141?.value}`).join('\n')}
    </div>
  }

  const getE13TableRow = (item: any, row: SparqlQueryResultObject_Binding): JSX.Element => {
    return <TableRow
      key={row.item.value}
      className="hover:bg-row_hover"
    >
      <TableCell>{makeClickablePrefixedUri(row.item.value, makePrefixedUri(row.item.value))}</TableCell>
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
      <TableCell>{item[0].item_label?.value}</TableCell>
    </TableRow>
  }

  const getDirectIndexTableRow = (item: any): JSX.Element => {
    return <TableRow
      key={item[0].item.value}
      className="hover:bg-row_hover"
    >
      <TableCell>{makeClickablePrefixedUri(item[0].item.value, makePrefixedUri(item[0].item.value))}</TableCell>
      <TableCell className='py-0 font-serif align-top'>
          <span>
            {makeClickablePrefixedUri(item[0].p.value, makePrefixedUri(item[0].p.value))} : {item[0].lit.value}
          </span>
      </TableCell>
      <TableCell>{item.map((row: SparqlQueryResultObject_Binding) => row.label.value).join(' ~ ')}</TableCell>
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
        <TableColumn key='resource' allowsSorting>URI</TableColumn>
        <TableColumn key='object' allowsSorting>Résultat de recherche</TableColumn>
        <TableColumn key='label' allowsSorting>Libellé générique</TableColumn>
      </TableHeader>
      <TableBody items={groupedData}>
        {item => getTableRow(item)}
      </TableBody>
    </Table>
  )

};

export default CollectionSearchEngine;