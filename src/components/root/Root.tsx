import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}