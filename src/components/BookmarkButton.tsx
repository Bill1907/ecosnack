import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import {
  bookmarkStatusQueryOptions,
  useToggleBookmark,
} from '@/lib/bookmarks.queries'

interface BookmarkButtonProps {
  articleId: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function BookmarkButton({
  articleId,
  size = 'md',
  showLabel = false,
}: BookmarkButtonProps) {
  const { isSignedIn } = useAuth()
  const { data, isLoading } = useQuery({
    ...bookmarkStatusQueryOptions(articleId),
    enabled: isSignedIn,
  })
  const { mutate: toggle, isPending } = useToggleBookmark()

  if (!isSignedIn) {
    return null
  }

  const isBookmarked = data?.bookmarked ?? false

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(articleId)
      }}
      disabled={isLoading || isPending}
      aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
      aria-pressed={isBookmarked}
      className={`
        ${sizeClasses[size]}
        rounded-full transition-all duration-200
        ${
          isBookmarked
            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
            : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
      `}
    >
      <span className="flex items-center gap-1.5">
        {isBookmarked ? (
          <BookmarkCheck className={iconSizes[size]} />
        ) : (
          <Bookmark className={iconSizes[size]} />
        )}
        {showLabel && (
          <span className="text-sm font-medium">
            {isBookmarked ? '저장됨' : '저장'}
          </span>
        )}
      </span>
    </button>
  )
}
