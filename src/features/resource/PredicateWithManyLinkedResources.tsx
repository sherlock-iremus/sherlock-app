import { useCallback, useMemo, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { identityLight, identityIncomingLight } from 'sherlock-sparql-queries/lib/identityLight'
import { makePrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import PredicateSectionTitle from './PredicateSectionTitle'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result'
import { Button, Input, Pagination, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { sparqlApi } from '@/services/sparqlApi'
import { LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { useNavigate } from 'react-router-dom'

export default function PredicateWithManyLinkedResources({ n, predicateUri, resourceUri, direction }: {
  n: number
  predicateUri: string
  resourceUri: string
  direction: LinkedResourcesDirectionEnum
}) {

  const navigate = useNavigate()

  ////////////////////////////////////////////////////////////////////////////////
  // ITEMS
  ////////////////////////////////////////////////////////////////////////////////

  const identitySparqlQuery = direction === LinkedResourcesDirectionEnum.INCOMING
    ? identityIncomingLight(resourceUri, predicateUri)
    : identityLight(resourceUri, predicateUri)
  const { data } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(identitySparqlQuery)

  ////////////////////////////////////////////////////////////////////////////////
  // SEARCH
  ////////////////////////////////////////////////////////////////////////////////

  const [filterValue, setFilterValue] = useState('')
  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = useMemo(() => {
    let _ = data ? [...data.results.bindings] : []

    if (hasSearchFilter) {
      _ = _.filter(binding =>
        binding.label.value.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    return _
  }, [data?.results.bindings, filterValue])

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  ////////////////////////////////////////////////////////////////////////////////
  // SORT
  ////////////////////////////////////////////////////////////////////////////////

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'label',
    direction: 'ascending'
  })

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort(
      (
        a: SparqlQueryResultObject_Binding,
        b: SparqlQueryResultObject_Binding
      ) => {
        const first = a[sortDescriptor.column as string].value as string
        const second = b[sortDescriptor.column as string].value as string
        const cmp = first < second ? -1 : first > second ? 1 : 0

        return sortDescriptor.direction === 'descending' ? -cmp : cmp
      }
    )
  }, [sortDescriptor, filteredItems])

  ////////////////////////////////////////////////////////////////////////////////
  // PAGINATION
  ////////////////////////////////////////////////////////////////////////////////

  const [page, setPage] = useState(1)

  const rowsPerPage = 20

  const pages = Math.ceil(sortedItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return sortedItems.slice(start, end)
  }, [page, sortedItems, rowsPerPage])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  ////////////////////////////////////////////////////////////////////////////////
  // TOP & BOTTOM CONTENT
  ////////////////////////////////////////////////////////////////////////////////

  const topContent = useMemo(() => {
    return (
      <div className='flex items-center'>
        <Input
          className='flex-1'
          isClearable
          onClear={() => onClear()}
          onValueChange={onSearchChange}
          placeholder='Chercher par label...'
          startContent={<CiSearch />}
          value={filterValue}
        />
        <div className='table-header ml-3'>({filteredItems.length} items)</div>
      </div>
    )
  }, [
    filterValue,
    onSearchChange,
    data?.results.bindings.length,
    hasSearchFilter
  ])

  const bottomContent = useMemo(() => {
    return (
      <div className='flex justify-between items-center'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className='hidden sm:flex justify-end gap-2 w-[30%]'>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onPreviousPage}
          >
            «
          </Button>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onNextPage}
          >
            »
          </Button>
        </div>
      </div>
    )
  }, [items.length, page, pages, hasSearchFilter])

  ////////////////////////////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <PredicateSectionTitle
        direction={direction}
        icon={null}
        title=''
        link={null}
        prefixedUri={makePrefixedUri(predicateUri)}
        sparqlQuery={identitySparqlQuery}
        n={n}
      />
      <br />
      <div className='px-6'>
        {data ? (
          <Table
            aria-label={predicateUri}
            bottomContent={bottomContent}
            bottomContentPlacement='inside'
            onSortChange={setSortDescriptor}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement='inside'
            onRowAction={(key) => navigate('/?resource=' + key)}
          >
            <TableHeader>
              <TableColumn key='internal_id' allowsSorting>Id</TableColumn>
              <TableColumn key='label' allowsSorting>Label</TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {item => <TableRow
                key={item.linked_resource.value}
                className="hover:bg-row_hover"
              >
                <TableCell>{item.internal_id?.value}</TableCell>
                <TableCell className='py-0 font-serif align-top'>
                  {item.label.value}
                </TableCell>
              </TableRow>}
            </TableBody>
          </Table>
        ) : (
          '⏳'
        )}
      </div>
      <div className='divider' />
    </>
  )
}
