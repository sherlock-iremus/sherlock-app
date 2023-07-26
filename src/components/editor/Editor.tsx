import Box from '@mui/material/Box'
import EditorOntologyBrowser from './EditorOntologyBrowser'
import EditorForm from './EditorForm'
import { sample_resource } from '../../data/sample'

export default function () {
  // const onClassClicked = (item: OntologyClass) => {
  //   switch (focused) {
  //     case Focused.RDFTYPES:
  //       if (types.includes(item)) {
  //         setTypes([...types.filter(_ => _ !== item)])
  //       }
  //       else {
  //         setTypes([...types, item].sort((a, b) => a._intCodeForSorting - b._intCodeForSorting))
  //       }
  //   }
  // }

  // const onPropertyClicked = (item: OntologyProperty) => {
  //   console.log(item._domain._uri)
  //   console.log(item._range._uri)
  // }

  return (
    <Box sx={{
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'row',
      width: '100%'
    }}>
      <EditorOntologyBrowser sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
      }} />
      <EditorForm resource={sample_resource} />
    </Box >
  )
}