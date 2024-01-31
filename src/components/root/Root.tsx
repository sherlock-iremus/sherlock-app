import { useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { TextField, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Outlet } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import SearchResults from '../search/SearchResults'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { useGetSearchResultsQuery } from '../../features/search/searchApiSlice'
import { Resource } from '../../model/Resource'
import { useGetSparqlResultsQuery } from '../../features/sparql/sparqlSlice'

export const AB = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.default,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: 'none',
  height: '77px',
  position: 'sticky',
}))

export const TB = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: '0.5rem !important',
}))

export default function Root() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data: searchResults,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSparqlResultsQuery(debouncedSearchQuery, { skip: debouncedSearchQuery === '' })

  return (
    <Box>
      <AB>
        <TB>
          <Box
            component='form'
            noValidate
            autoComplete='off'
            sx={{ flexGrow: 1 }}
          >
            <TextField
              fullWidth
              color='warning'
              focused
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start' >
                    <Typography sx={{ fontSize: '2rem' }}>⛩️</Typography>
                  </InputAdornment>
                )
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(event.target.value)
              }}
            />
          </Box>
          {/* <Box sx={{ ml: 1 }}>
            <IconButton size='large' style={{ cursor: 'default' }}>🧺</IconButton>
            <IconButton size='large' style={{ cursor: 'default' }}>🍤</IconButton>
          </Box> */}
        </TB>
      </AB>
      <Box>
        {
          searchQuery.length
            ? <SearchResults results={searchResults} />
            : <Outlet />
        }
      </Box>

    </Box >
  )
}