import React, { useState } from 'react'

import Search from '@mui/icons-material/Search'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import OutlinedInput from '@mui/material/OutlinedInput'

import { ontologiesSlice } from '../../features/ontologies/ontologiesSlice'
import { OntologyClass, OntologyProperty } from '../../model/Ontology'
import ResourceListItem from './ResourcesListItem'

type Props = {
  sx: object
}

export default function ({ sx }: Props) {
  const [filter, setFilter] = useState<string>('')

  return <Box sx={{
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    minWidth: 300,
    overflow: 'scroll',
    p: 1,
    ...sx
  }}>
    <OutlinedInput
      startAdornment={
        <InputAdornment position='start'>
          <Search />
        </InputAdornment>
      }
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value)
      }}
      size='small'
      sx={{
        marginBottom: 1,
        height: 42,
        width: '100%'
      }}
    />
    <Box sx={{ overflow: 'scroll', width: '100%' }}>
      <List>
        {[...ontologiesSlice.getInitialState()['ontologies']].map(([ontologyName, ontology]) => (
          <React.Fragment key={ontologyName}>
            <Divider />
            <ResourceListItem
              filter={filter}
              // onOntologyItemClicked={onClassClicked}
              ontology={ontology}
              ontologyStuffType={OntologyClass}
            />
            <Divider />
            <ResourceListItem
              filter={filter}
              // onOntologyItemClicked={onPropertyClicked}
              ontology={ontology}
              ontologyStuffType={OntologyProperty}
            />
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  </Box>
}