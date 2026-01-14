import { createFileRoute, Link } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/tanstack-react-start'
import { useQuery } from '@tanstack/react-query'
import { LoginRequired } from '@/components/LoginRequired'
import { NewsCard } from '@/components/NewsCard'
import { NewsCardSkeleton } from '@/components/NewsCardSkeleton'
import { userBookmarksQueryOptions } from '@/lib/bookmarks.queries'
import { getPageMeta } from '@/lib/seo'
import { useEffect } from 'react'

export const Route = createFileRoute('/bookmarks')({
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
  return (
    <div className="bg-background min-h-screen">
      {/* 비로그인 사용자 */}
      <SignedOut>
        <LoginRequired
          title="북마크를 확인하려면 로그인하세요"
          description="저장한 기사를 모아보고 싶으신가요?&#10;로그인하고 관심있는 기사를 북마크하세요!"
          icon="📚"
          buttonText="로그인하고 북마크 시작하기"
        />
      </SignedOut>

      {/* 로그인 사용자 */}
      <SignedIn>
        <BookmarksContent />
      </SignedIn>
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

function EmptyBookmarks() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl">📖</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        아직 북마크한 기사가 없습니다
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        관심있는 기사를 북마크하고
        <br />
        나중에 다시 읽어보세요!
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        기사 둘러보기
      </Link>
    </div>
  )
}
