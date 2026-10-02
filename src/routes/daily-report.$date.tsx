import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getDailyReportWithArticles } from '../lib/daily-reports.api'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { Card } from '@/components/ui/card'
import { SentimentBadge } from '@/components/feature/dailyReport/SentimentBadge'
import { ExecutiveSummary } from '@/components/feature/dailyReport/ExecutiveSummary'
import { KeyInsightCard } from '@/components/feature/dailyReport/KeyInsightCard'
import DailyReportNotFound from '@/components/feature/dailyReport/DailyReportNotFound'
import { parseReportDate } from '@/lib/route-params'
import { ShareButtons } from '@/components/feature/article/ShareButtons'
import {
  SITE_CONFIG,
  getNotFoundMeta,
  getPageMeta,
  getBreadcrumbJsonLd,
  truncateDescription,
} from '../lib/seo'
import { formatKstDate } from '@/lib/date'

export const Route = createFileRoute('/daily-report/$date')({
  loader: async ({ params }) => {
    // 실제 존재하지 않는 날짜/형식은 DB 조회 없이 404 (SSR 응답 상태 코드도 404 가 된다)
    const date = parseReportDate(params.date)
    if (date === null) {
      throw notFound()
    }

    const result = await getDailyReportWithArticles({ data: date })
    if (!result) {
      throw notFound()
    }

    return result
  },
  head: ({ loaderData, params }) => {
    // loader 가 notFound 를 던지면 loaderData 가 없다 → 404 메타(noindex)
    if (!loaderData) {
      return { meta: getNotFoundMeta('리포트를 찾을 수 없습니다') }
    }

    const { report } = loaderData
    if (!report) {
      return {}
    }

    const formattedDate = formatKstDate(report.reportDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const title = `${formattedDate} 데일리 리포트`
    const description = truncateDescription(
      report.executiveSummary.overview ||
        `${formattedDate}의 경제 동향을 한눈에 파악하세요. 시장 분석, 핵심 인사이트, 주요 키워드를 포함한 종합 경제 리포트입니다.`,
    )

    const reportPath = `/daily-report/${params.date}`

    return {
      meta: getPageMeta({
        title,
        description,
        path: reportPath,
        type: 'article',
        publishedTime: report.createdAt?.toISOString(),
        modifiedTime: report.createdAt?.toISOString(),
        author: SITE_CONFIG.name,
        keywords: [
          '데일리리포트',
          '경제리포트',
          '시장분석',
          '경제동향',
          ...report.topKeywords.slice(0, 5),
        ],
      }),
      links: [
        {
          rel: 'canonical',
          href: `${SITE_CONFIG.url}${reportPath}`,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Report',
            headline: title,
            description,
            datePublished: report.createdAt?.toISOString(),
            dateModified: report.createdAt?.toISOString(),
            author: {
              '@type': 'Organization',
              name: SITE_CONFIG.name,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_CONFIG.name,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_CONFIG.url}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE_CONFIG.url}${reportPath}`,
            },
            about: {
              '@type': 'Thing',
              name: '경제 시장 분석',
              description: '일일 경제 동향 및 시장 분석 리포트',
            },
            keywords: report.topKeywords.join(', '),
            inLanguage: 'ko-KR',
          }),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', url: '/' },
              { name: '데일리 리포트', url: '/daily-reports' },
              { name: formattedDate, url: reportPath },
            ]),
          ),
        },
      ],
    }
  },
  notFoundComponent: DailyReportNotFoundComponent,
  component: DailyReportDetailPage,
})

// 없는 리포트 / 잘못된 날짜 → 404 화면 (그 외 서버 에러는 루트 ErrorComponent 가 처리)
function DailyReportNotFoundComponent() {
  const posthog = usePostHog()
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    // 프로덕션 환경에서만 PostHog에 로깅
    if (!isDevelopment && posthog) {
      posthog.capture('daily_report_not_found', {
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
      })
    }
  }, [posthog, isDevelopment])

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <DailyReportNotFound />
    </div>
  )
}

function DailyReportDetailPage() {
  const { report, articles, prevDate, nextDate } = Route.useLoaderData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 리포트가 없으면 loader 가 notFound 를 던지므로 여기서 report 는 항상 존재
  // 이전/다음은 실제로 존재하는 리포트 날짜(없으면 null)

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {formatKstDate(report.reportDate, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </h1>
            <SentimentBadge
              sentiment={report.executiveSummary.sentiment.overall}
              description={report.executiveSummary.sentiment.description}
            />
          </div>

          {/* Compact Sentiment Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground">
                감성 분석
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md text-xs font-medium border border-emerald-200/50 dark:border-emerald-700/50">
                <span className="font-bold">
                  {report.sentimentAnalysis.positiveCount}
                </span>
                긍정
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-bold">
                  {report.sentimentAnalysis.neutralCount}
                </span>
                중립
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-xs font-medium border border-red-200/50 dark:border-red-700/50">
                <span className="font-bold">
                  {report.sentimentAnalysis.negativeCount}
                </span>
                부정
              </span>
            </div>
            <ShareButtons />
          </div>
        </div>

        {/* Executive Summary */}
        <ExecutiveSummary executiveSummary={report.executiveSummary} />

        {/* Market Overview */}
        <div className="mb-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-zinc-950/40 rounded-2xl shadow-sm border border-slate-100/50 dark:border-slate-900/30 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0">
                📊
              </div>
              <h2 className="text-2xl font-bold text-foreground pt-1.5">
                시장 개요
              </h2>
            </div>
            <p className="text-muted-foreground text-responsive-base mb-6 leading-relaxed">
              {report.marketOverview.summary}
            </p>

            {/* Sections */}
            <div className="space-y-6">
              {report.marketOverview.sections.map((section, idx) => (
                <div key={idx} className="border-t border-border pt-4">
                  <h3 className="text-responsive-lg font-semibold text-foreground mb-3">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground text-responsive-base mb-3">
                    {section.content}
                  </p>

                  {/* Key Data */}
                  {section.keyData.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-responsive-sm font-semibold text-foreground mb-2">
                        주요 데이터
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-responsive-sm text-muted-foreground">
                        {section.keyData.map((data, dataIdx) => (
                          <li key={dataIdx}>{data}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Outlook */}
            <div className="mt-6 p-4 bg-card/50 rounded-lg">
              <h3 className="text-responsive-sm font-semibold text-foreground mb-2">
                📊 시장 전망
              </h3>
              <p className="text-muted-foreground text-responsive-sm">
                {report.marketOverview.outlook}
              </p>
            </div>

            {/* Watch List */}
            {report.marketOverview.watchList.length > 0 && (
              <div className="mt-4">
                <h3 className="text-responsive-sm font-semibold text-foreground mb-2">
                  👀 주시할 항목
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.marketOverview.watchList.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-card text-card-foreground rounded-lg text-responsive-sm font-medium border transition-all hover:scale-105"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Insights */}
        <div className="mb-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">핵심 인사이트</h2>
          {report.keyInsights.map((insight, idx) => (
            <KeyInsightCard key={idx} insight={insight} />
          ))}
        </div>

        {/* Keywords */}
        <div className="mb-8">
          <h2 className="text-responsive-lg font-bold text-foreground mb-4">
            주요 키워드
          </h2>
          <div className="flex flex-wrap gap-2">
            {report.topKeywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 cursor-pointer text-responsive-sm font-medium"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        {articles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-responsive-lg font-bold text-foreground mb-4">
              관련 기사 ({report.articleCount}개)
            </h2>
            <div className="grid gap-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to="/article/$id"
                  params={{ id: String(article.id) }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex gap-4">
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-responsive-sm text-muted-foreground line-clamp-2 mb-2">
                          {article.headlineSummary}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>
                            {article.pubDate && formatKstDate(article.pubDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Date Navigation */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Date */}
            {prevDate ? (
              <Link
                to="/daily-report/$date"
                params={{ date: prevDate }}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                <span className="text-xl">←</span>
                <span className="text-sm font-medium">이전 리포트</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground/40 cursor-not-allowed">
                <span className="text-xl">←</span>
                <span className="text-sm font-medium">이전 리포트</span>
              </div>
            )}

            {/* Current Date Display */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {formatKstDate(report.reportDate, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            {/* Next Date */}
            {nextDate ? (
              <Link
                to="/daily-report/$date"
                params={{ date: nextDate }}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium">다음 리포트</span>
                <span className="text-xl">→</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground/40 cursor-not-allowed">
                <span className="text-sm font-medium">다음 리포트</span>
                <span className="text-xl">→</span>
              </div>
            )}
          </div>
        </Card>
      </article>
    </div>
  )
}
