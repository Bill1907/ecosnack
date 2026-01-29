import { Card } from '@/components/ui/card'
import { Impact, ImpactBadge } from './ImpactBadge'
import { TimeHorizon, TimeHorizonBadge } from './TimeHorizonBadge'

interface KeyInsight {
  title: string
  summary: string
  analysis: string
  impact: Impact
  timeHorizon: TimeHorizon
  implications: {
    investors: string
    workers: string
    consumers: string
  }
  actionItems: string[]
}

interface KeyInsightCardProps {
  insight: KeyInsight
}

export function KeyInsightCard({ insight }: KeyInsightCardProps) {
  return (
    <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="text-responsive-lg font-semibold text-foreground break-keep ">
          {insight.title}
        </h3>
        <div className="flex gap-2">
          <ImpactBadge impact={insight.impact} />
          <TimeHorizonBadge timeHorizon={insight.timeHorizon} />
        </div>
      </div>

      <p className="text-responsive-sm text-muted-foreground mb-4">
        {insight.summary}
      </p>

      <div className="mb-4">
        <h4 className="text-responsive-sm font-semibold text-foreground mb-2">
          분석
        </h4>
        <p className="text-responsive-sm text-muted-foreground">
          {insight.analysis}
        </p>
      </div>

      {/* Implications */}
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
            💼 투자자
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            {insight.implications.investors}
          </p>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
            👷 근로자
          </h4>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {insight.implications.workers}
          </p>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
            🛒 소비자
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {insight.implications.consumers}
          </p>
        </div>
      </div>

      {/* Action Items */}
      {insight.actionItems.length > 0 && (
        <div>
          <h4 className="text-responsive-sm font-semibold text-foreground mb-2">
            ✅ 실행 항목
          </h4>
          <ul className="space-y-1">
            {insight.actionItems.map((action, actionIdx) => (
              <li
                key={actionIdx}
                className="text-responsive-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-primary">•</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
