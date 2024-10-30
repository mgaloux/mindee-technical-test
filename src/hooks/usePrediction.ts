import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_MINDEE_API_KEY

const mindee = axios.create({
  baseURL: 'https://api.mindee.net/v1/products/',
  headers: {
    Authorization: `Token ${API_KEY}`,
    'Content-Type': 'multipart/form-data',
  },
})

export const usePrediction = () => {
  return useMutation({
    mutationFn: async (document: File) => {
      const formData = new FormData()
      formData.append('document', document)

      const response = await mindee.post(
        'mindee/financial_document/v1/predict',
        formData,
      )
      return response.data.document.inference
    },
  })
}
