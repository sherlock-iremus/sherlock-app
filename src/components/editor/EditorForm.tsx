import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { OntologyClass } from '../../model/Ontology'
import { OG, Resource } from '../../model/Resource'
import { RDF_TYPE } from '../../data/ontologies/RDF'
import { PH } from './PH'
import Values from './Values'
import React from 'react'

type Props = {
  resource: Resource
  edit: boolean
}

export default function ({ resource, edit }: Props) {
  const handleTypeDelete = (_: OG | undefined) => {

  }

  let i = 0

  return <Box sx={{
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    p: 1,
    width: '100%'
  }}>
    <Box sx={{
      alignItems: 'flex-end',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'end',
      gap: 1,
      width: '100%',
    }}>
      <Button variant='outlined' sx={{ height: 42 }}>ANNULER</Button>
      <Button variant='outlined' sx={{ height: 42 }}>ENREGISTRER</Button>
    </Box>
    <Box sx={{ mt: 0, p: 1, width: '100%' }}>
      <PH>URI</PH>
      <Typography>
        {resource.uri}
      </Typography>
      <br />
      <PH>rdf:type</PH>
      <Paper
        variant='outlined'
        sx={{
          alignItems: 'flex-start',
          // backgroundColor: focused === Focused.RDFTYPES ? 'action.hover' : 'none',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 0.5,
          mt: 1,
          p: 1,
          width: '100%',
          "&:hover": {
            backgroundColor: 'action.hover',
          },
        }}>
        {resource.getValues(RDF_TYPE)?.map(_ => <Chip
          key={(_?.resource as OntologyClass).name}
          label={(_?.resource as OntologyClass).name}
          onDelete={() => handleTypeDelete(_)}
          variant='outlined'
        />)}
      </Paper>
      <br />
      {
        [...resource.pog.entries()]
          .filter(([p]) => p !== RDF_TYPE)
          .sort(([p1], [p2]) => p1.name.localeCompare(p2.name))
          .map(([p, og_list]) => <React.Fragment key={i++}>
            <PH>{p.name}</PH>
            <Values edit={edit} p={p} og_list={og_list} ></Values>
            <br />
          </React.Fragment>)
      }
    </Box>
  </Box>
}