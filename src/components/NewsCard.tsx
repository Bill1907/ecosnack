import { Link } from '@tanstack/react-router'
import { CategoryBadge } from './CategoryBadge'

interface NewsCardProps {
  id: number
  category: string
  headline: string
  summary: string
  source: string
  timestamp: string
  imageUrl: string
}

export function NewsCard({
  id,
  category,
  headline,
  summary,
  source,
  timestamp,
  imageUrl,
}: NewsCardProps) {
  return (
    <Link to={`/article/$id`} params={{ id: String(id) }}>
      <article className="bg-white border border-bg-tertiary p-4 sm:p-6 rounded-sm transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:shadow-xl origin-center">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={headline}
            className="w-full object-cover mb-3 rounded-sm"
          />
        )}

        <h2 className="mb-3 text-text-primary line-clamp-3 text-responsive-lg font-bold leading-tight">
          {headline}
        </h2>

        <p className="mb-4 text-text-secondary line-clamp-2 text-responsive-sm leading-relaxed">
          {summary}
        </p>

        <div className="flex items-center gap-2 text-text-tertiary text-xs">
          <CategoryBadge category={category} />
          <span>{source}</span>
          <span>·</span>
          <span suppressHydrationWarning>{timestamp}</span>
        </div>
      </article>
    </Link>
  )
}
