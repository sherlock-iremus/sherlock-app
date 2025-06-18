import { useGetAllProjectDataQuery } from '@/hooks/sherlockSparql';
import { groupByField } from '@/utils/bindings_helpers';
import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@heroui/react'
import React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { f } from 'sherlock-sparql-queries/lib/collectionItems';
import { TbSearch } from 'react-icons/tb'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result';
import { makeYasguiButton } from '@/components/buttons';

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
    return item.find((row: SparqlQueryResultObject_Binding) => row.e13.value == row.e13_indexed.value);
  }

  const tooltipContent = (item: any) => {
    return <div className="whitespace-pre-line">
      {item.map((row: any) => `${row.P177_label ? row.p177_label.value : row.p177.value || ''} -> ${row.p141.value || ''}`).join('\n')}
    </div>
  }

  const getTableRow = (item: any) => {
    const row = getSignificantE13Row(item);
    return <TableRow
      key={row.item.value}
      className="hover:bg-row_hover"
    >
      <TableCell>{row.item.value}</TableCell>
      <TableCell className='py-0 font-serif align-top'>
        <Tooltip
          content={tooltipContent(item)}
          placement="top"
          isDisabled={!DISPLAY_ALL_E13}
        >
          <span>
            {row.p177_label ? row.p177_label.value : <Link target='_blank' to={'/?resource=' + row.p177.value} onClick={e => e.stopPropagation()}>
              Propriété inconnue :
            </Link>} {row.p141.value}
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  }

  return (
    <Table
      aria-label="Collection Search Engine"
      topContent={topContent}
      topContentPlacement='inside'
      onRowAction={(key) => navigate('/?resource=' + key)}
    >
      <TableHeader>
        <TableColumn key='resource' allowsSorting>Ressource</TableColumn>
        <TableColumn key='object' allowsSorting>Résultat de recherche</TableColumn>
      </TableHeader>
      <TableBody items={groupedData}>
        {item => getTableRow(item)}
      </TableBody>
    </Table>
  )

};

export default CollectionSearchEngine;