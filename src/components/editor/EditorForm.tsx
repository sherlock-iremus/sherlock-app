import React, { useState } from 'react'
import { alpha, styled } from '@mui/material/styles';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography, { TypographyProps } from '@mui/material/Typography'

import { OntologyClass, OntologyProperty } from '../../model/Ontology'
import Property from './Property'
import { Graph, OG, Resource } from '../../model/Resource'
import { RDF_TYPE } from '../../data/ontologies/RDF'

type Props = {
  resource: Resource
}

const PH = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.action.disabled
}))

export default function ({ resource }: Props) {
  const handleTypeDelete = (_: OG | undefined) => {

  }

  console.log(resource.pog.entries().next().value[0].name)

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
      {
        [...resource.pog.entries()]
          .filter(([p, og]) => p !== RDF_TYPE)
          .sort(([p1, og1], [p2, og2]) => p1.name.localeCompare(p2.name))
          .map(([p, og]) => <Box key={p.name} sx={{ mt: 2 }}>
            <PH>{p.name}</PH>
          </Box>)
      }
    </Box>
  </Box>
}