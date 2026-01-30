import { Link } from '@tanstack/react-router'

interface ExecutiveSummaryProps {
  executiveSummary: {
    headline: string
    overview: string
    sentiment: {
      overall: string
      description: string
    }
    highlights: Array<{
      title: string
      description: string
      relatedArticle: {
        id: number
        title: string
      }
    }>
  }
}

const getSentimentBorder = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'border-emerald-600'
    case 'negative':
      return 'border-red-600'
    case 'mixed':
      return 'border-yellow-600'
    default:
      return 'border-gray-600'
  }
}

const getSentimentUnderline = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'bg-emerald-600'
    case 'negative':
      return 'bg-red-600'
    case 'mixed':
      return 'bg-yellow-600'
    default:
      return 'bg-gray-600'
  }
}

export function ExecutiveSummary({ executiveSummary }: ExecutiveSummaryProps) {
  return (
    <div className="mb-8 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-slate-900/40 dark:via-gray-900/40 dark:to-slate-900/40 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/30 overflow-hidden">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {executiveSummary.headline}
        </h2>
        <div
          className={`h-1 w-24 mb-6 ${getSentimentUnderline(executiveSummary.sentiment.overall)}`}
        />
        <p className="text-responsive-base text-foreground leading-relaxed mb-6">
          {executiveSummary.overview}
        </p>

        {/* Highlights */}
        <div className="space-y-4">
          <h3 className="text-responsive-lg font-bold text-foreground">
            주요 내용
          </h3>
          <div className="space-y-4">
            {executiveSummary.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className={`border-l-4 ${getSentimentBorder(executiveSummary.sentiment.overall)} pl-4 py-2 bg-card/50 rounded-r-lg`}
              >
                <h4 className="font-semibold text-foreground mb-2">
                  {highlight.title}
                </h4>
                <p className="text-responsive-sm text-muted-foreground mb-2">
                  {highlight.description}
                </p>
                <Link
                  to="/article/$id"
                  params={{ id: String(highlight.relatedArticle.id) }}
                  className="text-responsive-sm text-primary underline underline-offset-2"
                >
                  관련 기사: {highlight.relatedArticle.title} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
