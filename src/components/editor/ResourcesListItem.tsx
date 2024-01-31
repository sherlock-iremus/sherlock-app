import { useState } from 'react'

import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
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
      padding: 0
    }}
      style={{ cursor: 'default', }}>
      {open
        ? <KeyboardArrowDownIcon sx={{ fontSize: 'medium' }} />
        : <KeyboardArrowRightIcon sx={{ fontSize: 'medium' }} />
      }
      <ListItemText primary={label} sx={{ color: 'primary.dark', }} />
    </ListItemButton>
    <Collapse in={open} timeout="auto" unmountOnExit >
      <List component="div" sx={{ m: 0, p: 0 }}>
        {data
          .filter(_ => _.name.toLowerCase().includes(filter.toLowerCase()))
          .map(_ =>
            <ListItemButton
              key={_.name}
              dense={true}
              onClick={() => { /*onOntologyItemClicked(_)*/ }}
              sx={{ borderRadius: 1, margin: 0, padding: 0.5 }}
              style={{ cursor: 'default', }}
            >
              <ListItemText primary={_.name} sx={{ margin: 0, padding: 0 }} />
            </ListItemButton>
          )}
      </List>
    </Collapse>
  </Box >
}