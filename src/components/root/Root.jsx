import { AccountCircle } from '@mui/icons-material'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { TextField, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Outlet } from 'react-router-dom'
import { styled } from '@mui/material/styles'

export const AB = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.default,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: 'none',
}))

export const TB = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: '0.5rem !important',
}))

export default function Root() {
  return (
    <Box>
      <AB position='static'>
        <TB>
          <Box
            component='form'
            noValidate
            autoComplete='off'
            sx={{ flexGrow: 1 }}
          >
            <TextField
              fullWidth
              color='warning'
              focused
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start' >
                    <Typography sx={{ fontSize: '2rem' }}>⛩️</Typography>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ ml: 1 }}>
            <IconButton size='large' style={{ cursor: 'default' }}>🧺</IconButton>
            <IconButton size='large' style={{ cursor: 'default' }}>🍤</IconButton>
          </Box>
        </TB>
      </AB>
      <Outlet />
    </Box >
  )
}