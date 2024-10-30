import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  ButtonGroup,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'

import { ChevronDown, ChevronRight } from 'lucide-react'

import { Polygon, PredictionData } from './types/types'
import { ConfidencePieChart } from './components/ConfidencePieChart'

function getLanguageName(localeCode: string): string {
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' })
    return displayNames.of(localeCode) ?? localeCode // Defaults to code if not found
  } catch {
    return localeCode // Fallback in case of unsupported locale
  }
}

function getCurrencyName(currencyCode: string): string {
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'currency' })
    const currencyName = displayNames.of(currencyCode)

    if (!currencyName) return currencyCode

    // Use Intl.NumberFormat to get the currency symbol
    const currencyFormatter = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    const symbol = currencyFormatter.format(1).replace(/\d/g, '').trim()
    return `${currencyName} (${symbol})`
  } catch {
    return currencyCode // Fallback in case of unsupported currency code
  }
}

interface PredictionField {
  confidence: number
  page_id?: number
  polygon?: any[]
  value: string | number | null
  raw_value?: string
}

interface ItemField {
  confidence: number
  description: string | null
  quantity: number | null
  unit_price: number | null
  total_amount: number | null
  tax_rate: number | null
  tax_amount: number | null
  polygon?: Polygon
}

interface PredictionProps {
  averageConfidence: number
  orientation: number
  prediction: Record<string, PredictionField | any>
  predictionData: PredictionData[]
  selectedKey: string | null
  setSelectedKey: (key: string | null) => void
  onFieldMouseEnter?: (key: string) => void
  onFieldMouseLeave?: (key: string) => void
}

const PredictionDisplay: React.FC<PredictionProps> = ({
  averageConfidence,
  orientation,
  prediction,
  selectedKey,
  predictionData,
  onFieldMouseEnter,
  onFieldMouseLeave,
}) => {
  // Fixed fields : locale, document type, total amount, due date, orientation
  const language = getLanguageName(prediction['locale'].language) || 'N/A'
  const currency = getCurrencyName(prediction['locale'].currency) || 'N/A'
  const documentType = prediction['document_type'].value || ''
  const totalAmount = prediction['total_amount'].value || ''
  const dueDate = prediction['due_date'].value || ''
  const orientationLabel = orientation === 0 ? 'Portrait' : 'Landscape'

  const fixedFields: [string, string][] = [
    ['Language', language],
    ['Currency', currency],
    ['Document Type', documentType],
    ['Total Amount', totalAmount],
    ['Due Date', dueDate],
    ['Orientation', orientationLabel],
  ]

  // Line_Item fields
  const itemFields: ItemField[] = []
  prediction['line_items'].map((line_item: ItemField) => {
    itemFields.push(line_item)
  })

  const [isDocumentMetadataOpen, setIsDocumentMetadataOpen] = useState(true)
  const [isAllItemsOpen, setIsAllItemsOpen] = useState(true)

  // Toggle Collapse
  const handleDocumentMetadataToggleCollapse = () => {
    setIsDocumentMetadataOpen(!isDocumentMetadataOpen)
  }

  // Toggle Collapse
  const handleAllItemsToggleCollapse = () => {
    setIsAllItemsOpen(!isAllItemsOpen)
  }

  // Scroll Into View When Hovering Shapes
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (selectedKey && fieldRefs.current[selectedKey]) {
      fieldRefs.current[selectedKey]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [selectedKey])

  return (
    <Box sx={{ width: 'full', height: '80vh', overflowY: 'scroll', paddingRight: 10 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        
        <Box sx={{ flexGrow: "inherit" }}>
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This <b>{documentType.toLowerCase()}</b> document is written in{' '}
            <b>{language}</b> in <b>{orientationLabel}</b> format. It contains a
            total of <b>{itemFields.length}</b> items for an amount of{' '}
            <b>{totalAmount}</b> <b>{currency}</b> due by <b>{dueDate}</b>.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Typography variant="h6" gutterBottom>
            Confidence
          </Typography>
          <ConfidencePieChart value={averageConfidence}/>
        </Box>
      </Box>
      {fixedFields.length > 0 ? (
        <div>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ButtonGroup
              onClick={handleDocumentMetadataToggleCollapse}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              {isDocumentMetadataOpen ? <ChevronDown /> : <ChevronRight />}
              <Typography variant="h6" gutterBottom sx={{ margin: '0' }}>
                Document Metadata
              </Typography>
            </ButtonGroup>
            <Collapse in={isDocumentMetadataOpen} timeout="auto" unmountOnExit>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {fixedFields.map(([name, value], index) => (
                  <div key={name + index}>
                    <ListItem
                      sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        borderLeft: '4px solid',
                        borderColor:
                          selectedKey === name ? 'grey.500' : 'grey.300',
                        boxShadow: selectedKey === name ? 3 : 1,
                        transition: 'all 0.15s',
                        '&:hover': {
                          borderColor: 'grey.500',
                          borderLeftWidth: '8px',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              width: '100%',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: 'grey.800' }}
                            >
                              {name}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ color: 'black', fontWeight: 'bold' }}
                            >
                              {value}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </div>
                ))}
              </Box>
            </Collapse>

            <List>
              <ButtonGroup
                onClick={handleAllItemsToggleCollapse}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '12px',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                {isAllItemsOpen ? <ChevronDown /> : <ChevronRight />}
                <Typography variant="h6" gutterBottom sx={{ margin: '0' }}>
                  All Detected Items
                </Typography>
              </ButtonGroup>
              <Collapse in={isAllItemsOpen} timeout="auto" unmountOnExit>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  {predictionData.map((item, index) => (
                    <div
                      key={item.id + index}
                      ref={(el) => (fieldRefs.current[item.id] = el)}
                    >
                      <ListItem
                        onMouseEnter={
                          onFieldMouseEnter
                            ? () => onFieldMouseEnter(item.id)
                            : undefined
                        }
                        onMouseLeave={
                          onFieldMouseLeave
                            ? () => onFieldMouseLeave(item.id)
                            : undefined
                        }
                        sx={{
                          bgcolor:
                            selectedKey === item.id ? '#FEDEDE' : 'white',
                          borderRadius: 2,
                          borderLeft: '4px solid',
                          borderColor:
                            selectedKey === item.id ? '#b2102f' : '#ff1744',
                          boxShadow: selectedKey === item.id ? 3 : 1,
                          transition: 'all 0.15s',
                          '&:hover': {
                            borderColor: '#b2102f',
                            bgcolor: '#FEDEDE',
                            borderLeftWidth: '8px',
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: 'grey.800' }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ color: 'black', fontWeight: 'bold' }}
                              >
                                {item.value}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </div>
                  ))}
                </Box>
              </Collapse>
            </List>
          </List>
        </div>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No data to display.
        </Typography>
      )}
    </Box>
  )
}

export default PredictionDisplay
