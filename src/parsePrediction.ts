import { PredictionData, Polygon } from "./types/types"

export const parsePrediction = (prediction: any): PredictionData[] => {
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