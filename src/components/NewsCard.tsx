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
      <article className="bg-white border border-[#e5e5e5] p-4 sm:p-6 rounded-sm transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:shadow-xl origin-center">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={headline}
            className="w-full object-cover mb-3"
          />
        )}

        <h2
          className="mb-3 text-[#1a1a1a] line-clamp-3"
          style={{
            fontSize: 'clamp(16px, 3vw, 20px)',
            fontWeight: '700',
            lineHeight: '1.4',
          }}
        >
          {headline}
        </h2>

        <p
          className="mb-4 text-[#666666] line-clamp-2"
          style={{
            fontSize: 'clamp(14px, 2.5vw, 15px)',
            lineHeight: '1.6',
          }}
        >
          {summary}
        </p>

        <div
          className="flex items-center gap-2 text-[#999999]"
          style={{
            fontSize: '12px',
          }}
        >
          <CategoryBadge category={category} />
          <span>{source}</span>
          <span>·</span>
          <span>{timestamp}</span>
        </div>
      </article>
    </Link>
  )
}
