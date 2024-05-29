import { styled } from '@mui/material/styles'

import Typography, { TypographyProps } from '@mui/material/Typography'

export const PH = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.action.disabled,
}))