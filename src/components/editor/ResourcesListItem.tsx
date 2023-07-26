import { useState } from 'react'

import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Ontology, OntologyClass, OntologyProperty, OntologyStuff } from '../../model/Ontology'

type Props = {
  filter: string;
  // onOntologyItemClicked: (item: OntologyStuff) => void;
  ontology: Ontology;
  ontologyStuffType: Function;
}

export default function ({ filter, /*onOntologyItemClicked,*/ ontology, ontologyStuffType }: Props) {

  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  let data: Array<OntologyStuff>
  let label = `${ontology.name}`
  switch (ontologyStuffType) {
    case OntologyClass:
      data = ontology.classes
      label += ` classes (${ontology.classes.length})`
      break
    case OntologyProperty:
      data = ontology.properties
      label += ` propriétés (${ontology.properties.length})`
      break
    default:
      data = []
  }

  return <Box>
    <ListItemButton onClick={handleClick} dense={true} sx={{
      margin: 0,
      padding: 0.5
    }}>
      <ListItemText primary={label} sx={{ color: 'primary.dark', }} />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div">
        {data
          .filter(_ => _.name.toLowerCase().includes(filter.toLowerCase()))
          .map(_ =>
            <ListItemButton key={_.name} dense={true} onClick={() => { /*onOntologyItemClicked(_)*/ }} sx={{ margin: 0, padding: 0.5 }}>
              <ListItemText primary={_.name} sx={{ margin: 0, padding: 0 }} />
            </ListItemButton>
          )}
      </List>
    </Collapse>
  </Box >
}