import { ReactElement } from 'react'

import BubbleChartIcon from '@mui/icons-material/BubbleChart'
import LanguageIcon from '@mui/icons-material/Language'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
// import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'

import { OG } from '../../model/Resource'
import { OntologyProperty } from '../../model/Ontology'
import { Typography } from '@mui/material'

type Props = {
  edit: boolean,
  og_list: Array<OG>,
  p: OntologyProperty
}

export default function ({ edit, p, og_list }: Props) {
  let i = 0

  return <Box key={p.name} sx={{ mt: 2 }}>
    <TableContainer component={Paper}>
      <Table size='small'>
        <TableBody>
          {og_list.map(og => {
            let c: ReactElement

            if (og.resource) {
              c = <TableRow key={i++}>
                <TableCell><Typography>{og.resource.uri}</Typography></TableCell>
                <TableCell></TableCell>
                <TableCell><Link href={og.resource.uri} target='_blank'><LanguageIcon /></Link></TableCell>
                <TableCell>
                  <Tooltip title={'GRAPH: ' + og.graph?.uri}>
                    <BubbleChartIcon />
                  </Tooltip>
                </TableCell>
              </TableRow>
            }
            else {
              c = <TableRow key={i++}>
                <TableCell style={{ width: '100%' }}>{og.literal?.value}</TableCell>
                <TableCell>@{og.literal?.lang}</TableCell>
                <TableCell sx={{ color: 'primary.dark' }}>{og.literal?.type}</TableCell>
                <TableCell>
                  <Tooltip title={'GRAPH: ' + og.graph?.uri}>
                    <BubbleChartIcon />
                  </Tooltip>
                </TableCell>
              </TableRow>
            }

            return c
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Box >
}
