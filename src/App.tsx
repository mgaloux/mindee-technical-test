import { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import DocumentInterface from './DocumentInterface'

const API_KEY = import.meta.env.VITE_MINDEE_API_KEY

const mindee = axios.create({ baseURL: 'https://api.mindee.net/v1/products/' })

const usePrediction = () => {
  return useMutation({
    mutationFn: async (document: File) => {
      // call mindee API
    },
  })
}

function App() {
  const [document, setDocument] = useState<File | null>(null)

  const { mutate: predict, data: prediction } = usePrediction()
  useEffect(() => console.log('prediction', prediction), [prediction])

  return (
    <Grid container rowGap={2} sx={{ height: '100vh', background: '#FCFCFC' }}>
      <Grid item xs={6} sx={{ padding: 8 }}>
        <DocumentInterface
          document={document}
          onClickUpload={(file: File) => setDocument(file)}
          onClickPredict={() => document && predict(document)}
        />
      </Grid>

      <Grid item xs={6} sx={{ display: 'grid', placeItems: 'center' }}>
        <Typography>Add the result of the inference here</Typography>
      </Grid>
    </Grid>
  )
}

export default App
