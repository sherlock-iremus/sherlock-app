import React, { useState } from 'react'

import Search from '@mui/icons-material/Search'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ResourceListItem from './ResourcesListItem'
import { ontologiesSlice } from '../../features/ontologies/ontologiesSlice'
import { OntologyClass, OntologyProperty } from '../../model/Ontology'

export default function () {
  const [filter, setFilter] = useState<string>('')
  const [types, setTypes] = useState<Array<OntologyClass>>([])

  const onClassClicked = (item: OntologyClass) => {
    console.log('Class clicked!', item)
  }

  const onPropertyClicked = (item: OntologyProperty) => {
    console.log('Property clicked!', item)
  }

  return (
    <Box sx={{
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'row',
    }}>
      <Box sx={{
        alignItems: 'flex-start',
        borderRight: '1px solid',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'scroll',
        p: 1
      }}>
        <OutlinedInput
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilter(event.target.value)
          }}
          size='small'
          sx={{ marginBottom: 1, width: '100%' }}
        />
        <Box sx={{ overflow: 'scroll' }}>
          <List >
            {[...ontologiesSlice.getInitialState()['ontologies']].map(([ontologyName, ontology]) => (
              <React.Fragment key={ontologyName}>
                <ResourceListItem filter={filter} onOntologyItemClicked={onClassClicked} ontology={ontology} ontologyStuffType={OntologyClass} />
                <ResourceListItem filter={filter} onOntologyItemClicked={onPropertyClicked} ontology={ontology} ontologyStuffType={OntologyProperty} />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
      <Box sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        p: 1
      }}>
        <Button variant="outlined">Outlined</Button>
        <Typography variant="h2">
          Types
        </Typography>
        <Stack>
          {types.map(_ => <Chip label={_._name} variant='outlined' />)}
        </Stack>
      </Box>
    </Box >
  )
}