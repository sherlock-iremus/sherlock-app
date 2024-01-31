import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import { useParams, useSearchParams } from 'react-router-dom'

import EditorOntologyBrowser from './EditorOntologyBrowser'
import EditorForm from './EditorForm'
import { sample_resource } from '../../data/sample'

export interface IEditorProps { }

const C: React.FunctionComponent<IEditorProps> = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  // useEffect(() => {
  //   const paramsAsObject = Object.fromEntries([...searchParams]);

  //   console.log(paramsAsObject);
  // }, [searchParams]);

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
      <EditorForm resource={sample_resource} edit={false} />
    </Box >
  )
}

export default C