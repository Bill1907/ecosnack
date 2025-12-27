import { createFileRoute, Link } from '@tanstack/react-router'
import { getArticlesByCategory } from '@/lib/articles.api'
import type { Article } from '@/db/schema'

export const Route = createFileRoute('/category/$slug')({
  loader: async ({ params }) => {
    const articles = await getArticlesByCategory({ data: params.slug })
    return { articles, category: params.slug }
  },
  component: CategoryPage,
})

function CategoryPage() {
  const { articles, category } = Route.useLoaderData() as {
    articles: Article[]
    category: string
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">카테고리: {category}</h1>

      {articles.length === 0 ? (
        <p className="text-gray-500">해당 카테고리에 기사가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="rounded-lg border p-4">
              <Link
                to="/article/$id"
                params={{ id: String(article.id) }}
                className="block"
              >
                <h2 className="mb-2 text-lg font-semibold hover:text-blue-600">
                  {article.title}
                </h2>
                {article.headlineSummary && (
                  <p className="mb-2 text-sm text-gray-600">
                    {article.headlineSummary}
                  </p>
                )}
                <div className="flex gap-3 text-xs text-gray-500">
                  {article.source && <span>{article.source}</span>}
                  {article.pubDate && (
                    <time>
                      {new Date(article.pubDate).toLocaleDateString('ko-KR')}
                    </time>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
