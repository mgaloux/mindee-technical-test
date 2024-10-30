import { PieChart } from '@mui/x-charts/PieChart'
import { styled } from '@mui/material/styles'

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 15,
  fontWeight: 'bold',
}))

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  return (
    <StyledText x={30} y={28}>
      {children}
    </StyledText>
  )
}

export function ConfidencePieChart({ value }: { value: number }) {
    return (
      <PieChart
        tooltip={{ trigger: 'none' }}
        series={[
          {
            cx: 25,
            cy: 25,
            innerRadius: 18,
            outerRadius: 30,
            cornerRadius: 5,
            data: [
              { id: 0, value, color: 'green' },
              { id: 1, value: 100 - value, color: 'transparent' },
            ],
          },
        ]}
        width={60}
        height={60}
      >
        <PieCenterLabel>{value}%</PieCenterLabel>
      </PieChart>
    )
}