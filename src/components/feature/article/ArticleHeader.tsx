import { ShareButtons } from './ShareButtons'
import { BookmarkButton } from '@/components/BookmarkButton'
import type { Article } from '@/db/schema'
import { CategoryBadge } from '@/components/CategoryBadge'
import { formatRelativeTime } from '@/lib/utils'

interface ArticleHeaderProps {
  article: Article
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <CategoryBadge category={article.category || ''} />

        {/* Region Badge */}
        {article.region && (
          <span className="px-3 py-1 bg-bg-secondary text-text-secondary rounded-full text-sm font-medium">
            📍 {article.region}
          </span>
        )}
      </div>

      <h1 className="mb-4 sm:mb-6 text-text-primary text-responsive-3xl font-bold leading-tight tracking-tight">
        {article.title}
      </h1>

      <p className="mb-6 text-text-secondary text-responsive-base leading-relaxed">
        {article.headlineSummary || article.description || ''}
      </p>

      <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-bg-tertiary">
        <div className="flex items-center gap-2 text-text-tertiary text-sm">
          <span>{article.source || '출처 없음'}</span>
        </div>
        <div className="flex items-center gap-2 text-text-tertiary text-sm">
          <span suppressHydrationWarning>
            {formatRelativeTime(article.pubDate)}
          </span>
          {article.importanceScore && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                {'⭐'.repeat(
                  Math.min(Math.ceil(article.importanceScore / 2), 5),
                )}
              </span>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <BookmarkButton articleId={article.id} size="md" showLabel />
          <ShareButtons />
        </div>
      </div>
    </header>
  )
}
