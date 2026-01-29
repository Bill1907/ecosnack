export type Impact = 'high' | 'medium' | 'low'

interface ImpactBadgeProps {
  impact: Impact
}

export function ImpactBadge({ impact }: ImpactBadgeProps) {
  const getStyles = () => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    }
  }

  const getLabel = () => {
    switch (impact) {
      case 'high':
        return '🔴 높음'
      case 'medium':
        return '🟡 중간'
      case 'low':
        return '🟢 낮음'
    }
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 h-fit ${getStyles()}`}
    >
      {getLabel()}
    </span>
  )
}
