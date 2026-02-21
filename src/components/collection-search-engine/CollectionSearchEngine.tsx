import { IdentityColumnContent } from '@/components/collection-search-engine/IdentityColumnContent'
import { QueryResultColumnContent } from '@/components/collection-search-engine/QueryResultColumnContent'
import YasguiButton from '@/components/common/YasguiButton'
import { useGetAllProjectDataQuery } from '@/hooks/sherlockSparql'
import { groupByFields } from '@/utils/bindingsHelpers'
import { Input } from '@heroui/react'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { f } from 'sherlock-sparql-queries/lib/collectionItems'
import TableWrapper from '../layout/TableWrapper'

export const DISPLAY_E13_TOOLTIP = false

// Accepts an array of collection props and a single projectGraphUri
export type SingleCollectionProps = {
  collectionName: string
  collectionUri: string
}

export default function ({
  collections,
  projectCode,
  projectGraphUri,
}: {
  collections: SingleCollectionProps[]
  projectCode: string
  projectGraphUri: string
}) {
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
            <span className="text-text-secondary-foreground">Recherche dans : « </span><span className="">{collections.map(collection => collection.collectionName).join(', ')}</span><span className="text-text-secondary-foreground"> »</span>
          </div>
          <div className='flex items-center gap-3 w-full'>
            <Input
              className='rounded-none w-full'
              onChange={e => onSearchChange(e.target.value)}
              placeholder='📇'
              value={searchValue}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  triggerSearch()
                }
              }}
            />
            {groupedData.length > 0 && <div className='font-thin text-texte_annexe text-nowrap'>{groupedData.length} items</div>}
            <YasguiButton sparqlQuery={query} />
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
    <TableWrapper>
      {topContent}
      {groupedData.length > 0 && <table
        className='mt-3 [&_th]:p-2 [&_td]:px-2 [&_td]:py-1 text-xs'
      >
        <thead className='bg-table-head'>
          <tr>
            <th>Identité de la ressource</th>
            <th>Résultat de recherche</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map(bindingsOfSameItem => {
            return <tr
              key={bindingsOfSameItem[0].item.value}
              className='hover:bg-table-head border-b'
              onClick={() => navigate('/?resource=' + bindingsOfSameItem[0].item.value)}
            >
              <td className='py-0 font-serif align-top'>
                <IdentityColumnContent bindingsOfSameItem={bindingsOfSameItem} />
              </td>
              <td className='py-0 font-serif align-top'>
                <QueryResultColumnContent bindingsOfSameItem={bindingsOfSameItem} />
              </td>
              {/* <TableCell>
              <CollectionColumnContent bindingsOfSameItem={bindingsOfSameItem} collections={collections} />
            </TableCell> */}
            </tr>
          })}
        </tbody>
      </table>}
    </TableWrapper>
  )
}