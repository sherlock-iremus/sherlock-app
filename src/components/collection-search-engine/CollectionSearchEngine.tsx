import YasguiButton from '@/components/buttons-and-links/YasguiButton'
import { IdentityColumnContent } from '@/components/collection-search-engine/IdentityColumnContent'
import { QueryResultColumnContent } from '@/components/collection-search-engine/QueryResultColumnContent'
import { useGetAllProjectDataQuery } from '@/hooks/sherlockSparql'
import { groupByFields } from '@/utils/bindingsHelpers'
import { Input } from '@heroui/react'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { f } from 'sherlock-sparql-queries/lib/collectionItems'

export const DISPLAY_E13_TOOLTIP = false

// Accepts an array of collection props and a single projectGraphUri
export type SingleCollectionProps = {
  collectionName: string
  collectionUri: string
}

export type CollectionSearchEngineProps = {
  collections: SingleCollectionProps[]
  projectCode: string
  projectGraphUri: string
}

const CollectionSearchEngine: React.FC<CollectionSearchEngineProps> = ({
  collections,
  projectCode,
  projectGraphUri,
}) => {
  // TODO console.log(collections)
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [activeSearch, setActiveSearch] = useState('')

  const collectionUris = useMemo(() => collections.map(collection => collection.collectionUri), [collections])
  const query = useMemo(
    () => f(projectCode, collectionUris, projectGraphUri, activeSearch, DISPLAY_E13_TOOLTIP),
    [projectCode, collectionUris, projectGraphUri, activeSearch]
  )

  const shouldFetch = activeSearch.length > 2
  const { data, isLoading } = useGetAllProjectDataQuery(query, projectGraphUri, activeSearch, shouldFetch)
  const groupedData = useMemo(
    () => Object.values(groupByFields(data?.results.bindings || [], 'item')),
    [data?.results.bindings]
  )

  const triggerSearch = () => {
    if (searchValue.length > 2) {
      setActiveSearch(searchValue)
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
        <div className='flex flex-col items-center gap-3 w-full'>
          <div className='font-light'>
            Recherche dans : « {collections.map(collection => collection.collectionName).join(', ')} »
          </div>
          <div className='flex items-center gap-3 w-full'>
            <Input
              isClearable
              onClear={onClear}
              onValueChange={onSearchChange}
              radius='none'
              placeholder='📇'
              value={searchValue}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  triggerSearch()
                }
              }}
            />
            {groupedData.length > 0 && <div className='font-thin text-texte_annexe text-nowrap'>{groupedData.length} items</div>}
            <YasguiButton query={query} />
          </div>
        </div>
        {isLoading && (
          <div className='flex justify-center items-center pt-4 w-full'>
            <span className='border-t-2 border-b-2 rounded-full w-4 h-4 text-pink-600 animate-spin'></span>
          </div>
        )}
      </div>
    )
  }, [
    searchValue,
    onSearchChange,
    groupedData,
    isLoading
  ])

  return (
    <Table
      aria-label='Collection Search Engine'
      hideHeader={groupedData.length === 0}
      onRowAction={(key) => navigate('/?resource=' + key)}
      radius='none'
      topContent={topContent}
      topContentPlacement='inside'
    >
      <TableHeader>
        <TableColumn key='label' allowsSorting>Identité de la ressource</TableColumn>
        <TableColumn key='object' allowsSorting>Résultat de recherche</TableColumn>
        {/* <TableColumn key='collection' allowsSorting>Collection</TableColumn> */}
      </TableHeader>
      <TableBody items={groupedData}>
        {bindingsOfSameItem => (
          <TableRow key={bindingsOfSameItem[0].item.value} className='hover:bg-row_hover border-data_table_border border-b-1'>
            <TableCell className='py-0 font-serif align-top'>
              <IdentityColumnContent bindingsOfSameItem={bindingsOfSameItem} />
            </TableCell>
            <TableCell className='py-0 font-serif align-top'>
              <QueryResultColumnContent bindingsOfSameItem={bindingsOfSameItem} />
            </TableCell>
            {/* <TableCell>
              <CollectionColumnContent bindingsOfSameItem={bindingsOfSameItem} collections={collections} />
            </TableCell> */}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

}

export default CollectionSearchEngine