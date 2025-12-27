import { createFileRoute } from '@tanstack/react-router'
import { getArticleById } from '@/lib/articles.api'
import type { Article } from '@/db/schema'

export const Route = createFileRoute('/article/$id')({
  loader: async ({ params }) => {
    const article = await getArticleById({ data: Number(params.id) })
    if (!article) {
      throw new Error('Article not found')
    }
    return article
  },
  component: ArticleDetail,
})

function ArticleDetail() {
  const article = Route.useLoaderData() as Article

  return (
    <article className="mx-auto max-w-4xl p-6">
      {/* 헤더 */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {article.source && <span>출처: {article.source}</span>}
          {article.region && <span>지역: {article.region}</span>}
          {article.pubDate && (
            <time>
              {new Date(article.pubDate).toLocaleDateString('ko-KR')}
            </time>
          )}
        </div>
      </header>

      {/* AI 요약 */}
      {article.headlineSummary && (
        <section className="mb-6 rounded-lg bg-blue-50 p-4">
          <h2 className="mb-2 font-semibold">AI 요약</h2>
          <p>{article.headlineSummary}</p>
        </section>
      )}

      {/* 본문 설명 */}
      {article.description && (
        <section className="mb-6">
          <p className="leading-relaxed">{article.description}</p>
        </section>
      )}

      {/* So What 분석 */}
      {article.soWhat && (
        <section className="mb-6 rounded-lg bg-yellow-50 p-4">
          <h2 className="mb-2 font-semibold">So What?</h2>
          <p className="mb-2">{article.soWhat.summary}</p>
          {article.soWhat.implications && (
            <ul className="list-inside list-disc">
              {article.soWhat.implications.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* 영향 분석 */}
      {article.impactAnalysis && (
        <section className="mb-6 rounded-lg bg-green-50 p-4">
          <h2 className="mb-2 font-semibold">영향 분석</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium">환경</h3>
              <p className="text-sm">{article.impactAnalysis.environmental}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">경제</h3>
              <p className="text-sm">{article.impactAnalysis.economic}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">사회</h3>
              <p className="text-sm">{article.impactAnalysis.social}</p>
            </div>
          </div>
        </section>
      )}

      {/* 키워드 */}
      {article.keywords && article.keywords.length > 0 && (
        <section className="mb-6">
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword, i) => (
              <span
                key={i}
                className="rounded-full bg-gray-200 px-3 py-1 text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 원문 링크 */}
      <footer className="border-t pt-4">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          원문 보기 →
        </a>
      </footer>
    </article>
  )
}
