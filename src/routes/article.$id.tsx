import { Link, createFileRoute } from '@tanstack/react-router'
import { ArticleHeader } from '../components/feature/article/ArticleHeader'
import { Footer } from '../components/Footer'
import { ImpactItem } from '../components/feature/article/ImpactItem'
import { getArticleById } from '../lib/articles.api'
import {
  CATEGORY_NAMES,
  SITE_CONFIG,
  getArticleJsonLd,
  getBreadcrumbJsonLd,
  getPageMeta,
  truncateDescription,
} from '../lib/seo'
import { TIME_HORIZON_CONFIG } from '@/lib/const'
import ArticleNotFound from '@/components/feature/article/ArticleNotFound'

export const Route = createFileRoute('/article/$id')({
  loader: async ({ params }) => {
    const article = await getArticleById({ data: Number(params.id) })
    return { article }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {}
    }

    const { article } = loaderData
    if (!article) {
      return {}
    }

    const categoryName = article.category
      ? CATEGORY_NAMES[article.category]
      : '경제'
    const description = truncateDescription(
      article.description || article.headlineSummary || article.title,
    )

    const articlePath = `/article/${article.id}`

    return {
      meta: getPageMeta({
        title: article.title,
        description,
        path: articlePath,
        image: article.imageUrl || undefined,
        type: 'article',
        publishedTime: article.pubDate?.toISOString(),
        modifiedTime: article.createdAt?.toISOString(),
        author: article.source || SITE_CONFIG.name,
        keywords: article.keywords || [categoryName, '경제뉴스', '뉴스분석'],
      }),
      links: [
        {
          rel: 'canonical',
          href: `${SITE_CONFIG.url}${articlePath}`,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(getArticleJsonLd(article)),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: '홈', url: '/' },
              { name: categoryName, url: `/?category=${article.category}` },
              { name: article.title, url: `/article/${article.id}` },
            ]),
          ),
        },
      ],
    }
  },
  component: ArticleDetailPage,
})

function ArticleDetailPage() {
  const { article } = Route.useLoaderData()

  if (!article) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <ArticleNotFound />
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Article Content */}
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
        {/* Article Header */}
        <ArticleHeader article={article} />

        {/* Article Body */}
        <div className="article-content">
          {/* Article Image */}
          {article.imageUrl && (
            <div className="mb-6 rounded-sm overflow-hidden shadow-sm">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover max-h-[400px]"
              />
            </div>
          )}
          {/* Main Description */}
          {article.description && (
            <p className="text-text-primary text-responsive-base leading-relaxed">
              {article.description}
            </p>
          )}
          {/* Original Link */}
          {article.link && (
            <div className="pt-4 pb-8 border-b mb-10 border-bg-tertiary flex justify-end">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-link hover:underline text-responsive-sm font-medium"
              >
                원문 보기 →
              </a>
            </div>
          )}

          {/* So What Section */}
          {article.soWhat && (
            <div className="mb-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl shadow-sm border border-amber-100/50 overflow-hidden transition-all duration-300 hover:shadow-md">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-amber-100 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0">
                    🤔
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary pt-1.5 text-responsive-lg">
                    So What?
                  </h3>
                </div>
                <p className="text-text-primary leading-relaxed text-responsive-base">
                  {article.soWhat.main_point}
                </p>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-3">
                {/* Market Signal */}
                <div className="bg-white/70 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2 text-text-primary flex items-center gap-2">
                    <span className="text-amber-600">📈</span>
                    시장 시그널
                  </h4>
                  <p className="text-text-secondary leading-relaxed text-responsive-sm">
                    {article.soWhat.market_signal}
                  </p>
                </div>

                {/* Time Horizon */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">
                    ⏱️ 영향 기간:
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                      TIME_HORIZON_CONFIG[
                        article.soWhat
                          .time_horizon as keyof typeof TIME_HORIZON_CONFIG
                      ]?.className ?? TIME_HORIZON_CONFIG.long.className
                    }`}
                  >
                    {TIME_HORIZON_CONFIG[
                      article.soWhat
                        .time_horizon as keyof typeof TIME_HORIZON_CONFIG
                    ]?.label ?? TIME_HORIZON_CONFIG.long.label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Impact Analysis */}
          {article.impactAnalysis && (
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                영향 분석 📊
              </h3>

              {/* Investors Impact */}
              <ImpactItem
                type="investors"
                data={article.impactAnalysis.investors}
              />

              {/* Workers Impact */}
              <ImpactItem
                type="workers"
                data={article.impactAnalysis.workers}
              />

              {/* Consumers Impact */}
              <ImpactItem
                type="consumers"
                data={article.impactAnalysis.consumers}
              />
            </div>
          )}

          {/* Related Context */}
          {article.relatedContext && (
            <div className="mb-8 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden transition-all duration-300 hover:shadow-md">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-slate-100 text-slate-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0">
                    📚
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary pt-1.5 text-responsive-lg">
                    배경 정보
                  </h3>
                </div>
                <p className="text-text-secondary text-responsive-base leading-relaxed">
                  {article.relatedContext.background}
                </p>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-4">
                {/* Related Events */}
                {article.relatedContext.related_events.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2.5 text-text-primary flex items-center gap-2 text-responsive-sm">
                      연관된 최근 이슈
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {article.relatedContext.related_events.map(
                        (event: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-white text-slate-700 rounded-lg text-sm font-medium border border-slate-200/50 transition-all hover:scale-105 hover:border-slate-300"
                          >
                            {event}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* What to Watch */}
                {article.relatedContext.what_to_watch && (
                  <div className="bg-white/70 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2 text-text-primary flex items-center gap-2">
                      <span className="text-slate-600">👀</span>
                      주목할 후속 이벤트
                    </h4>
                    <p
                      className="text-text-secondary leading-relaxed"
                      style={{ fontSize: '14px' }}
                    >
                      {article.relatedContext.what_to_watch}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sentiment */}
          {article.sentiment && (
            <div className="mb-6 flex items-center gap-3">
              {/* <span className="text-text-tertiary" style={{ fontSize: '14px' }}>
                감정 분석:
              </span>
              <span
                className={`px-3 py-1 rounded-full ${
                  article.sentiment.overall === 'positive'
                    ? 'bg-green-100 text-green-800'
                    : article.sentiment.overall === 'negative'
                      ? 'bg-red-100 text-red-800'
                      : article.sentiment.overall === 'mixed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
                style={{ fontSize: '13px', fontWeight: '500' }}
              >
                {article.sentiment.overall === 'positive'
                  ? '😊 긍정적'
                  : article.sentiment.overall === 'negative'
                    ? '😟 부정적'
                    : article.sentiment.overall === 'mixed'
                      ? '😐 복합적'
                      : '😶 중립'}
              </span> */}
              <span className="text-text-tertiary" style={{ fontSize: '13px' }}>
                신뢰도: {Math.round(article.sentiment.confidence * 100)}%
              </span>
            </div>
          )}

          {/* Keywords/Tags */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-8 pt-8 border-t border-bg-tertiary">
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword: string) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-bg-secondary text-text-secondary rounded-full hover:bg-[#e5e5e5] transition-colors cursor-pointer"
                    style={{ fontSize: '13px', fontWeight: '500' }}
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  )
}
