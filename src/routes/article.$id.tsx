import { createFileRoute } from '@tanstack/react-router'
import { CategoryBadge } from '../components/CategoryBadge'
import { ShareButtons } from '../components/ShareButtons'
import { Footer } from '../components/Footer'
import { ImpactItem } from '../components/feature/article/ImpactItem'
import { getArticleById } from '../lib/articles.api'
import { formatRelativeTime } from '../lib/utils'

export const Route = createFileRoute('/article/$id')({
  loader: async ({ params }) => {
    const article = await getArticleById({ data: Number(params.id) })
    if (!article) {
      throw new Error('Article not found')
    }
    return { article }
  },
  component: ArticleDetailPage,
})

function ArticleDetailPage() {
  const { article } = Route.useLoaderData()

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Article Content */}
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
        {/* Article Header */}
        <header className="mb-6 sm:mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <CategoryBadge category={article.category || ''} />

            {/* Region Badge */}
            {article.region && (
              <span className="px-3 py-1 bg-[#f5f5f5] text-[#666666] rounded-full text-sm font-medium">
                📍 {article.region}
              </span>
            )}
          </div>

          <h1
            className="mb-4 sm:mb-6 text-[#1a1a1a]"
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '700',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
            }}
          >
            {article.title}
          </h1>

          <p
            className="mb-6 text-[#666666]"
            style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              lineHeight: '1.6',
            }}
          >
            {article.headlineSummary || article.description || ''}
          </p>

          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-[#e5e5e5]">
            <div
              className="flex items-center gap-2 text-[#999999]"
              style={{ fontSize: '14px' }}
            >
              <span>{article.source || '출처 없음'}</span>
            </div>
            <div
              className="flex items-center gap-2 text-[#999999]"
              style={{ fontSize: '14px' }}
            >
              {/* <Clock className="w-4 h-4" />
              <span>{calculateReadTime(article)} 분량</span>
              <span>·</span> */}
              <span>{formatRelativeTime(article.pubDate)}</span>
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
            <div className="ml-auto">
              <ShareButtons />
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="article-content">
          {/* Article Image */}
          {article.imageUrl && (
            <div className="mb-6 rounded-sm overflow-hidden shadow-sm">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>
          )}
          {/* Main Description */}
          {article.description && (
            <p
              className="text-[#1a1a1a]"
              style={{
                fontSize: 'clamp(16px, 2.5vw, 18px)',
                lineHeight: '1.8',
              }}
            >
              {article.description}
            </p>
          )}
          {/* Original Link */}
          {article.link && (
            <div className="pt-4 pb-8 border-b mb-10 border-[#e5e5e5] flex justify-end">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0066cc] hover:underline"
                style={{ fontSize: '15px', fontWeight: '500' }}
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
                  <h3 className="text-lg font-semibold text-[#1a1a1a] pt-1.5">
                    So What?
                  </h3>
                </div>
                <p
                  className="text-[#1a1a1a] leading-relaxed"
                  style={{ fontSize: '16px', lineHeight: '1.7' }}
                >
                  {article.soWhat.main_point}
                </p>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-3">
                {/* Market Signal */}
                <div className="bg-white/70 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2 text-[#1a1a1a] flex items-center gap-2">
                    <span className="text-amber-600">📈</span>
                    시장 시그널
                  </h4>
                  <p
                    className="text-[#666666] leading-relaxed"
                    style={{ fontSize: '15px' }}
                  >
                    {article.soWhat.market_signal}
                  </p>
                </div>

                {/* Time Horizon */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1a1a1a]">
                    ⏱️ 영향 기간:
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                      article.soWhat.time_horizon === 'short'
                        ? 'bg-blue-100 text-blue-700'
                        : article.soWhat.time_horizon === 'medium'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {article.soWhat.time_horizon === 'short'
                      ? '단기 (1주)'
                      : article.soWhat.time_horizon === 'medium'
                        ? '중기 (1-3개월)'
                        : '장기 (1년+)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Impact Analysis */}
          {article.impactAnalysis && (
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                영향 분석 📊
              </h3>

              {/* Investors Impact */}
              {article.impactAnalysis.investors && (
                <ImpactItem
                  type="investors"
                  data={article.impactAnalysis.investors}
                />
              )}

              {/* Workers Impact */}
              {article.impactAnalysis.workers && (
                <ImpactItem
                  type="workers"
                  data={article.impactAnalysis.workers}
                />
              )}

              {/* Consumers Impact */}
              {article.impactAnalysis.consumers && (
                <ImpactItem
                  type="consumers"
                  data={article.impactAnalysis.consumers}
                />
              )}
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
                  <h3 className="text-lg font-semibold text-[#1a1a1a] pt-1.5">
                    배경 정보
                  </h3>
                </div>
                <p
                  className="text-[#666666] leading-relaxed"
                  style={{ fontSize: '15px', lineHeight: '1.7' }}
                >
                  {article.relatedContext.background}
                </p>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-4">
                {/* Related Events */}
                {article.relatedContext.related_events &&
                  article.relatedContext.related_events.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2.5 text-[#1a1a1a] flex items-center gap-2">
                        {/* <span className="text-slate-600">🔗</span> */}
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
                    <h4 className="text-sm font-semibold mb-2 text-[#1a1a1a] flex items-center gap-2">
                      <span className="text-slate-600">👀</span>
                      주목할 후속 이벤트
                    </h4>
                    <p
                      className="text-[#666666] leading-relaxed"
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
              {/* <span className="text-[#999999]" style={{ fontSize: '14px' }}>
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
              <span className="text-[#999999]" style={{ fontSize: '13px' }}>
                신뢰도: {Math.round(article.sentiment.confidence * 100)}%
              </span>
            </div>
          )}

          {/* Keywords/Tags */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[#e5e5e5]">
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword: string) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-[#f5f5f5] text-[#666666] rounded-full hover:bg-[#e5e5e5] transition-colors cursor-pointer"
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
