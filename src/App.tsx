import { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { usePrediction } from './hooks/usePrediction'

import DocumentInterface from './DocumentInterface'
import { PredictionData } from './types/types'
import { parsePrediction } from './parsePrediction'

function App() {
  const [document, setDocument] = useState<File | null>(null)
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])

  const { mutate: predict, data: documentInference } = usePrediction()

  const prediction = documentInference?.prediction
  const orientation = documentInference?.pages[0].orientation.value

  useEffect(() => {
    document && predict(document)
  }, [document])

  useEffect(() => {
    if (!prediction) return

    setPredictionData(parsePrediction(prediction))
    console.log(predictionData)
    console.log(orientation)
  }, [prediction])

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
