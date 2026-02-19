import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import { Card } from '@/components/ui/card'
import { LoginRequired } from '@/components/LoginRequired'
import { personalizedReportsQueryOptions } from '@/lib/personalized-reports.queries'
import { getPageMeta } from '@/lib/seo'
import { getAuthStatus } from '@/lib/auth.middleware'
import { FileText, ChevronRight, Calendar } from 'lucide-react'

export const Route = createFileRoute('/my-report/')({
  beforeLoad: async () => {
    const { isAuthenticated } = await getAuthStatus()
    return { isAuthenticated }
  },
  head: () => ({
    meta: getPageMeta({
      title: '나의 맞춤 리포트',
      description: '나의 관심 분야에 맞춰 분석된 개인화 경제 리포트 목록입니다.',
      path: '/my-report',
    }),
  }),
  component: MyReportListPage,
})

function MyReportListPage() {
  const { isAuthenticated: ssrIsAuthenticated } = Route.useRouteContext()
  const { isSignedIn } = useAuth()

  const isAuthenticated =
    typeof window === 'undefined' ? ssrIsAuthenticated : isSignedIn

  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen">
        <LoginRequired
          title="맞춤 리포트를 확인하려면 로그인하세요"
          description="나의 관심사에 맞춘 개인화 경제 리포트를&#10;로그인하고 확인하세요!"
          icon="🎯"
          buttonText="로그인하고 맞춤 리포트 보기"
        />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MyReportListContent />
    </div>
  )
}

function MyReportListContent() {
  const { data, isLoading } = useQuery(personalizedReportsQueryOptions())

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const reports = data?.reports ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-md text-xs font-bold">
            🎯 맞춤 리포트
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          나의 맞춤 리포트
        </h1>
        <p className="text-muted-foreground">
          나의 관심 분야에 맞춰 분석된 개인화 경제 리포트입니다.
        </p>
      </div>

      {/* Report List */}
      {reports.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span className="text-4xl">📭</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            아직 리포트가 없습니다
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            관심 분야를 설정하면 매일 맞춤 리포트가 생성됩니다.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Link
              key={report.id}
              to="/my-report/$date"
              params={{ date: report.reportDate }}
            >
              <Card className="p-4 sm:p-5 hover:shadow-lg transition-all cursor-pointer group border-border/50 hover:border-violet-200 dark:hover:border-violet-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(report.reportDate).toLocaleDateString(
                          'ko-KR',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'short',
                          },
                        )}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded">
                        긍정 {report.sentimentAnalysis.positiveCount}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 rounded">
                        중립 {report.sentimentAnalysis.neutralCount}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
                        부정 {report.sentimentAnalysis.negativeCount}
                      </span>
                      <span className="text-muted-foreground">
                        기사 {report.articleCount}개
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Load More (간단한 안내) */}
      {data?.hasMore && (
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            더 많은 리포트가 있습니다.
          </p>
        </div>
      )}
    </div>
  )
}
