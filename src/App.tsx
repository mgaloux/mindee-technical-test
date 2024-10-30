import { useEffect, useRef, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { drawLayer, drawShape, setShapeConfig, Stage } from 'react-mindee-js'

import DocumentInterface from './DocumentInterface'
import { usePrediction } from './hooks/usePrediction'
import PredictionDisplay from './PredictionDisplay'
import { Polygon, PredictionData } from './types/types'
import { calculateAverageConfidence } from './calculateAverageConfidence'

const parsePrediction = (prediction: any): PredictionData[] => {
  const predictionData: PredictionData[] = []
  Object.keys(prediction).map((key: string) => {
    if (prediction[key].polygon && prediction[key].polygon.length > 0) {
      predictionData.push({
        id: key,
        name: key
          .replace('_', ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        value: prediction[key]?.value || 'N/A',
        coordinates: prediction[key].polygon as Polygon,
      })
    }
    if (prediction[key].length > 0) {
      prediction[key].map((item: any, index: number) => {
        predictionData.push({
          id: key + index,
          name: item?.description
            ? 'Item ' + index + ': ' + item?.description
            : key + ' ' + index,
          value: item?.description
            ? item?.quantity +
              ' unit' +
              (item?.quantity > 1 ? 's' : '') +
              ' x ' +
              item?.unit_price +
              ' = ' +
              item?.total_amount
            : 'N/A',
          coordinates: item?.polygon as Polygon,
        })
      })
    }
  })
  return predictionData
}


function App() {
  const [document, setDocument] = useState<File | null>(null)
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [averageConfidence, setAverageConfidence] = useState<number>(0)

  const { mutate: predict, data: documentInference } = usePrediction()

  const prediction = documentInference?.prediction
  const orientation = documentInference?.pages[0].orientation.value

  useEffect(() => {
    document && predict(document)
  }, [document])

  useEffect(() => {
    if (!prediction) return

    setPredictionData(parsePrediction(prediction))
    setAverageConfidence(calculateAverageConfidence(prediction))
  }, [prediction])

  const annotationViewerStageRef = useRef<null | Stage>(null)

  const onFieldMouseEnter = (shape: any) => {
    setSelectedKey(null)
    // when the field is hovered we can change the style of the desired shape by passing a config objet as a third argument
    // this function update the shape configs and redraw only that specific shape in the canvas.
    drawShape(annotationViewerStageRef.current!, shape, {
      fill: 'red',
      opacity: 0.3,
    })
  }
  const onFieldMouseLeave = (shape: any) => {
    // note that here we need to use setShapeConfig first to update the shape config without redrawing it the canvas
    setShapeConfig(annotationViewerStageRef.current!, shape, {
      fill: 'transparent',
      opacity: 1,
    })
    // when the update changes are done we can trigger one-time canvas redraw
    // this is useful to avoid performance issues
    drawLayer(annotationViewerStageRef.current!)
  }

  const setAnnotationViewerStage = (stage: Stage) => {
    annotationViewerStageRef.current = stage
  }

  return (
    <Grid container rowGap={2} sx={{ height: '100vh', background: '#FCFCFC' }}>
      <Grid item xs={6} sx={{ padding: 8 }}>
        <DocumentInterface
          setAnnotationViewerStage={setAnnotationViewerStage}
          document={document}
          annotationShapes={predictionData}
          setSelectedKey={setSelectedKey}
          onClickUpload={(file: File) => setDocument(file)}
        />
      </Grid>

      <Grid item xs={6} sx={{ display: 'grid', marginTop: 8 }}>
        {prediction ? (
          <PredictionDisplay
            averageConfidence={averageConfidence}
            onFieldMouseEnter={onFieldMouseEnter}
            onFieldMouseLeave={onFieldMouseLeave}
            orientation={orientation}
            prediction={prediction}
            predictionData={predictionData}
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
          />
        ) : (
          <Typography>Upload a document to start</Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default App
