import { Link } from '@tanstack/react-router'
import { CategoryBadge } from './CategoryBadge'
import { BookmarkButton } from './BookmarkButton'
import type { Article } from '../db/schema'
import { formatRelativeTime } from '../lib/utils'

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  const {
    id,
    category,
    title,
    description,
    headlineSummary,
    source,
    pubDate,
    imageUrl,
  } = article

  const displayCategory = category || '기타'
  const displaySummary = description || headlineSummary || ''
  const displayTimestamp = formatRelativeTime(pubDate)
  const displaySource = source || ''

  return (
    <Link to={`/article/$id`} params={{ id: String(id) }}>
      <article className="relative bg-white border border-bg-tertiary p-4 sm:p-6 rounded-sm transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:shadow-xl origin-center">
        {/* Bookmark Button */}
        <div className="absolute top-3 right-3 z-10">
          <BookmarkButton articleId={id} size="sm" />
        </div>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full object-cover mb-3 rounded-sm"
          />
        )}

        <h2 className="mb-3 text-text-primary line-clamp-3 text-responsive-lg font-bold leading-tight pr-8">
          {title}
        </h2>

        <p className="mb-4 text-text-secondary line-clamp-2 text-responsive-sm leading-relaxed">
          {displaySummary}
        </p>

        <div className="flex items-center gap-2 text-text-tertiary text-xs">
          <CategoryBadge category={displayCategory} />
          <span>{displaySource}</span>
          <span>·</span>
          <span suppressHydrationWarning>{displayTimestamp}</span>
        </div>
      </article>
    </Link>
  )
}
