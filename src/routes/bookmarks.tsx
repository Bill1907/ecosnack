import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import { NewsCard } from '@/components/NewsCard'
import { NewsCardSkeleton } from '@/components/NewsCardSkeleton'
import { userBookmarksQueryOptions } from '@/lib/bookmarks.queries'
import { getPageMeta } from '@/lib/seo'
import { getAuthStatus } from '@/lib/auth.middleware'
import { LoginRequired } from '@/components/LoginRequired'
import { useEffect } from 'react'
import EmptyBookmarks from '@/components/feature/bookmarks/EmptyBookmarks'

export const Route = createFileRoute('/bookmarks')({
  // SSR 시점에 인증 상태 확인 (리다이렉트 없음)
  beforeLoad: async () => {
    const { isAuthenticated } = await getAuthStatus()
    return { isAuthenticated }
  },
  head: () => ({
    meta: getPageMeta({
      title: '북마크',
      description: '저장한 기사 목록을 확인하세요',
      path: '/bookmarks',
    }),
  }),
  component: BookmarksPage,
})

function BookmarksPage() {
  const { isAuthenticated: ssrIsAuthenticated } = Route.useRouteContext()
  const { isSignedIn } = useAuth() // 클라이언트 사이드 인증 체크

  // SSR: ssrIsAuthenticated 사용
  // 클라이언트: isSignedIn 사용
  const isAuthenticated =
    typeof window === 'undefined' ? ssrIsAuthenticated : isSignedIn

  // 비로그인 사용자에게 LoginRequired 표시
  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen">
        <LoginRequired
          title="북마크를 확인하려면 로그인하세요"
          description="저장한 기사를 모아보고 싶으신가요?&#10;로그인하고 관심있는 기사를 북마크하세요!"
          icon="📚"
          buttonText="로그인하고 북마크 시작하기"
        />
      </div>
    )
  }

  // 로그인된 사용자에게 북마크 목록 표시
  return (
    <div className="bg-background min-h-screen">
      <BookmarksContent />
    </div>
  )
}

function BookmarksContent() {
  const { data: bookmarks, isLoading } = useQuery(userBookmarksQueryOptions)

  // PostHog 페이지 뷰 이벤트
  useEffect(() => {
    if (typeof window !== 'undefined' && window.posthog && !isLoading) {
      window.posthog.capture('bookmarks_page_view', {
        bookmark_count: bookmarks?.length || 0,
        timestamp: new Date().toISOString(),
      })
    }
  }, [isLoading])

  if (!bookmarks || bookmarks.length === 0) {
    if (isLoading) {
      // 로딩 중
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                📚 북마크
              </h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              저장한 기사를 모아보세요
            </p>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )
    }

    // 빈 상태
    return <EmptyBookmarks />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            📚 북마크
          </h1>
          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-8 px-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md">
            {bookmarks.length}
          </span>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          저장한 기사 {bookmarks.length}개를 모아봤어요
        </p>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
