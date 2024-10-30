import { Stack, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import placeholder from '../assets/image-placeholder.svg'

const useStyles = makeStyles({
  placeholder: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 24,
    background: 'white',
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%239E9E9EFF' stroke-width='1' stroke-dasharray='6%2c 14' stroke-dashoffset='13' stroke-linecap='square'/%3e%3c/svg%3e")`,
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#F8F8F8' },
  },
})

export default function AnnotationPlaceholder() {
  const classes = useStyles()

  return (
    <Stack className={classes.placeholder}>
      <img src={placeholder} />
      <Typography variant="body1" sx={{ fontSize: 15 }}>
        Drag and drop a document or click to upload one
      </Typography>
    </Stack>
  )
}
