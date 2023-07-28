import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    fontFamily: ['JetBrains Mono'].join(',')
  },
}))

export default theme