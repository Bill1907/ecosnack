export type TimeHorizon = 'short' | 'medium' | 'long'

interface TimeHorizonBadgeProps {
  timeHorizon: TimeHorizon
}

export function TimeHorizonBadge({ timeHorizon }: TimeHorizonBadgeProps) {
  const getLabel = () => {
    switch (timeHorizon) {
      case 'short':
        return '단기'
      case 'medium':
        return '중기'
      case 'long':
        return '장기'
    }
  }

  return (
    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold shrink-0 h-fit">
      {getLabel()}
    </span>
  )
}
