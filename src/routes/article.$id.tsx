// import { createFileRoute } from '@tanstack/react-router'
// import { getArticleById } from '@/lib/articles.api'
// import type { Article } from '@/db/schema'

// export const Route = createFileRoute('/article/$id')({
//   loader: async ({ params }) => {
//     const article = await getArticleById({ data: Number(params.id) })
//     if (!article) {
//       throw new Error('Article not found')
//     }
//     return article
//   },
//   component: ArticleDetail,
// })

// function ArticleDetail() {
//   const article = Route.useLoaderData() as Article

//   return (
//     <article className="mx-auto max-w-4xl p-6">
//       {/* 헤더 */}
//       <header className="mb-8">
//         <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>
//         <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//           {article.source && <span>출처: {article.source}</span>}
//           {article.region && <span>지역: {article.region}</span>}
//           {article.pubDate && (
//             <time>
//               {new Date(article.pubDate).toLocaleDateString('ko-KR')}
//             </time>
//           )}
//         </div>
//       </header>

//       {/* AI 요약 */}
//       {article.headlineSummary && (
//         <section className="mb-6 rounded-lg bg-blue-50 p-4">
//           <h2 className="mb-2 font-semibold">AI 요약</h2>
//           <p>{article.headlineSummary}</p>
//         </section>
//       )}

//       {/* 본문 설명 */}
//       {article.description && (
//         <section className="mb-6">
//           <p className="leading-relaxed">{article.description}</p>
//         </section>
//       )}

//       {/* So What 분석 */}
//       {article.soWhat && (
//         <section className="mb-6 rounded-lg bg-yellow-50 p-4">
//           <h2 className="mb-2 font-semibold">So What?</h2>
//           <p className="mb-2">{article.soWhat.summary}</p>
//           {article.soWhat.implications && (
//             <ul className="list-inside list-disc">
//               {article.soWhat.implications.map((item, i) => (
//                 <li key={i}>{item}</li>
//               ))}
//             </ul>
//           )}
//         </section>
//       )}

//       {/* 영향 분석 */}
//       {article.impactAnalysis && (
//         <section className="mb-6 rounded-lg bg-green-50 p-4">
//           <h2 className="mb-2 font-semibold">영향 분석</h2>
//           <div className="grid gap-3 md:grid-cols-3">
//             <div>
//               <h3 className="text-sm font-medium">환경</h3>
//               <p className="text-sm">{article.impactAnalysis.environmental}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium">경제</h3>
//               <p className="text-sm">{article.impactAnalysis.economic}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium">사회</h3>
//               <p className="text-sm">{article.impactAnalysis.social}</p>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* 키워드 */}
//       {article.keywords && article.keywords.length > 0 && (
//         <section className="mb-6">
//           <div className="flex flex-wrap gap-2">
//             {article.keywords.map((keyword, i) => (
//               <span
//                 key={i}
//                 className="rounded-full bg-gray-200 px-3 py-1 text-sm"
//               >
//                 {keyword}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* 원문 링크 */}
//       <footer className="border-t pt-4">
//         <a
//           href={article.link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:underline"
//         >
//           원문 보기 →
//         </a>
//       </footer>
//     </article>
//   )
// }

import { createFileRoute } from '@tanstack/react-router'
import { BackButton } from '../components/BackButton'
import { CategoryBadge } from '../components/CategoryBadge'
import { ShareButtons } from '../components/ShareButtons'
import { Footer } from '../components/Footer'
import { getArticleById } from '../lib/articles.api'
import type { Article } from '../db/schema'
import { Clock } from 'lucide-react'

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

// 카테고리를 categoryVariant로 매핑하는 헬퍼 함수
function getCategoryVariant(
  category: string | null,
): 'global' | 'local' | 'market' | 'tech' | 'policy' {
  const categoryMap: Record<
    string,
    'global' | 'local' | 'market' | 'tech' | 'policy'
  > = {
    '글로벌 경제': 'global',
    '한국 경제': 'local',
    '시장 동향': 'market',
    기술: 'tech',
    정책: 'policy',
  }
  return categoryMap[category || ''] || 'global'
}

// 날짜를 상대적 시간으로 변환하는 헬퍼 함수
function formatRelativeTime(date: Date | null): string {
  if (!date) return '방금 전'

  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return '방금 전'
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  return date.toLocaleDateString('ko-KR')
}

// 읽기 시간 계산 (대략적으로 텍스트 길이 기반)
function calculateReadTime(article: Article): string {
  const textLength =
    (article.description || '') + (article.headlineSummary || '')
  const minutes = Math.max(1, Math.ceil(textLength.length / 500)) // 대략 500자당 1분
  return `${minutes}분`
}

function ArticleDetailPage() {
  const { article } = Route.useLoaderData()

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Article Content */}
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 flex-1">
        <BackButton />

        {/* Article Header */}
        <header className="mb-6 sm:mb-8">
          <div className="mb-4">
            <CategoryBadge
              category={article.category || '기타'}
              variant={getCategoryVariant(article.category)}
            />
          </div>

          <h1
            className="mb-4 sm:mb-6 text-[#1a1a1a] font-serif"
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
              <Clock className="w-4 h-4" />
              <span>{calculateReadTime(article)} 분량</span>
              <span>·</span>
              <span>{formatRelativeTime(article.pubDate)}</span>
            </div>
            <div className="ml-auto">
              <ShareButtons />
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="article-content">
          {/* Main Description */}
          {article.description && (
            <p
              className="mb-6 text-[#1a1a1a]"
              style={{
                fontSize: 'clamp(16px, 2.5vw, 18px)',
                lineHeight: '1.8',
              }}
            >
              {article.description}
            </p>
          )}

          {/* So What Section */}
          {article.soWhat && (
            <div className="mb-8 p-6 bg-[#fffbeb] border-l-4 border-[#f59e0b] rounded-r-lg">
              <h3 className="text-lg font-semibold mb-3 text-[#1a1a1a]">
                So What? 🤔
              </h3>
              <p
                className="mb-4 text-[#1a1a1a]"
                style={{ fontSize: '16px', lineHeight: '1.7' }}
              >
                {article.soWhat.summary}
              </p>
              {article.soWhat.implications &&
                article.soWhat.implications.length > 0 && (
                  <ul className="space-y-2">
                    {article.soWhat.implications.map(
                      (item: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[#666666]"
                          style={{ fontSize: '15px' }}
                        >
                          <span className="text-[#f59e0b] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ),
                    )}
                  </ul>
                )}
            </div>
          )}

          {/* Impact Analysis */}
          {article.impactAnalysis && (
            <div className="mb-8 p-6 bg-[#f0fdf4] border-l-4 border-[#10b981] rounded-r-lg">
              <h3 className="text-lg font-semibold mb-4 text-[#1a1a1a]">
                영향 분석 📊
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {article.impactAnalysis.environmental && (
                  <div>
                    <h4
                      className="font-medium mb-2 text-[#1a1a1a]"
                      style={{ fontSize: '14px' }}
                    >
                      🌍 환경
                    </h4>
                    <p
                      className="text-[#666666]"
                      style={{ fontSize: '14px', lineHeight: '1.6' }}
                    >
                      {article.impactAnalysis.environmental}
                    </p>
                  </div>
                )}
                {article.impactAnalysis.economic && (
                  <div>
                    <h4
                      className="font-medium mb-2 text-[#1a1a1a]"
                      style={{ fontSize: '14px' }}
                    >
                      💰 경제
                    </h4>
                    <p
                      className="text-[#666666]"
                      style={{ fontSize: '14px', lineHeight: '1.6' }}
                    >
                      {article.impactAnalysis.economic}
                    </p>
                  </div>
                )}
                {article.impactAnalysis.social && (
                  <div>
                    <h4
                      className="font-medium mb-2 text-[#1a1a1a]"
                      style={{ fontSize: '14px' }}
                    >
                      👥 사회
                    </h4>
                    <p
                      className="text-[#666666]"
                      style={{ fontSize: '14px', lineHeight: '1.6' }}
                    >
                      {article.impactAnalysis.social}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Context */}
          {article.relatedContext && (
            <div className="mb-8 p-6 bg-[#f5f5f5] rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-[#1a1a1a]">
                배경 정보 📚
              </h3>
              <p
                className="mb-4 text-[#666666]"
                style={{ fontSize: '15px', lineHeight: '1.7' }}
              >
                {article.relatedContext.background}
              </p>
              {article.relatedContext.relatedTopics &&
                article.relatedContext.relatedTopics.length > 0 && (
                  <div>
                    <h4
                      className="font-medium mb-2 text-[#1a1a1a]"
                      style={{ fontSize: '14px' }}
                    >
                      관련 주제
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {article.relatedContext.relatedTopics.map(
                        (topic: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white text-[#666666] rounded-full"
                            style={{ fontSize: '13px' }}
                          >
                            {topic}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Sentiment */}
          {article.sentiment && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[#999999]" style={{ fontSize: '14px' }}>
                감정 분석:
              </span>
              <span
                className={`px-3 py-1 rounded-full ${
                  article.sentiment.label === 'positive'
                    ? 'bg-green-100 text-green-800'
                    : article.sentiment.label === 'negative'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
                style={{ fontSize: '13px', fontWeight: '500' }}
              >
                {article.sentiment.label === 'positive'
                  ? '긍정적'
                  : article.sentiment.label === 'negative'
                    ? '부정적'
                    : '중립'}{' '}
                ({article.sentiment.score})
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

          {/* Original Link */}
          {article.link && (
            <div className="mt-8 pt-8 border-t border-[#e5e5e5]">
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
        </div>
      </article>

      {/* Sticky Share Button (Mobile) */}
      <ShareButtons sticky />

      <Footer />
    </div>
  )
}
