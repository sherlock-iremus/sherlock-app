import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import { Resource } from '../../model/Resource'

type Props = {
  results: Array<Resource>
}

export default function SearchResults({ results }: Props) {
  let i = 0

  return results?.length > 0
    ? <List dense={true} sx={{
      height: 'calc(100vh - 78px) !important',
      overflow: 'auto',
    }}>
      {
        results?.map((resource: Resource) => <ListItem key={i++} disablePadding>
          <ListItemText primary={`🍣 ${resource.uri}`} />
        </ListItem>)
      }
    </List>
    : <Box>🍱</Box>
}