import React, { useState } from 'react'

import Search from '@mui/icons-material/Search'

import Box from '@mui/material/Box'
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

  return <Box
    sx={{
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 78px) !important',
      overflow: 'auto',
      minWidth: 280,
      p: 1,
      ...sx
    }}
  >
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
        mb: 1,
        width: '100%'
      }}
    />
    <Box sx={{ width: '100%' }}>
      <List sx={{ m: 0, p: 0 }}>
        {[...ontologiesSlice.getInitialState()['ontologies']].map(([ontologyName, ontology]) => (
          <React.Fragment key={ontologyName}>
            <ResourceListItem
              filter={filter}
              // onOntologyItemClicked={onClassClicked}
              ontology={ontology}
              ontologyStuffType={OntologyClass}
            />
            <ResourceListItem
              filter={filter}
              // onOntologyItemClicked={onPropertyClicked}
              ontology={ontology}
              ontologyStuffType={OntologyProperty}
            />
          </React.Fragment>
        ))}
      </List>
    </Box>
  </Box>
}