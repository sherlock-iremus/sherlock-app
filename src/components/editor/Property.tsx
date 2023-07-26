import Box from '@mui/material/Box'

import { OntologyProperty } from '../../model/Ontology'
import { Literal, Resource } from '../../model/Resource'

type Props = {
  property: OntologyProperty
  value: Literal | Resource
}

/*
Types de valeurs possibles :
- liste de trucs
- truc
    - literal dont on peut choisir le type
    - ressource qu'on peut aller chercher (merci Antoine)
    - ressource qu'on peut créer (il faut un écran annexe)
*/
export default function ({ property, value }: Props) {
  console.log(property, value)
  return <Box>
    <Box>{property.name}</Box>
    <Box>Valeur</Box>
  </Box>
}