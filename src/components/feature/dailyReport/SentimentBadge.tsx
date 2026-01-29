type Sentiment = 'positive' | 'negative' | 'neutral' | 'mixed'

interface SentimentBadgeProps {
  sentiment: Sentiment
  description?: string
}

export function SentimentBadge({
  sentiment,
  description,
}: SentimentBadgeProps) {
  const getStyles = () => {
    switch (sentiment) {
      case 'positive':
        return 'bg-emerald-600 text-white'
      case 'negative':
        return 'bg-red-600 text-white'
      case 'mixed':
        return 'bg-yellow-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const getLabel = () => {
    switch (sentiment) {
      case 'positive':
        return '📈 긍정'
      case 'negative':
        return '📉 부정'
      case 'neutral':
        return '➡️ 중립'
      case 'mixed':
        return '🔀 혼조'
    }
  }

  return (
    <div
      className={`px-4 py-2.5 rounded-3xl ${getStyles()}`}
      title={description}
    >
      <span className="text-xs font-bold uppercase tracking-wide flex items-center leading-[1]">
        {getLabel()}
      </span>
    </div>
  )
}
