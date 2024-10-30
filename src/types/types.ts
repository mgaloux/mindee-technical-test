export type Polygon = [number, number][]

export type PredictionData = {
  id: string
  name: string
  value: string
  coordinates?: Polygon
}
