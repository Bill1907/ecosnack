import { createFileRoute } from '@tanstack/react-router'
import { NewsCard } from '../components/NewsCard'
import { Footer } from '../components/Footer'
import { getArticles } from '../lib/articles.api'
// import type { Article } from '../db/schema'
import { formatRelativeTime } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const articles = await getArticles()
    return { articles }
  },
})

function HomePage() {
  const { articles } = Route.useLoaderData()
  // const [selectedCategory, setSelectedCategory] = useState('all')

  // const filteredArticles: Article[] =
  //   selectedCategory === 'all'
  //     ? articles
  //     : articles.filter(
  //         (article) =>
  //           getCategoryVariant(article.category) === selectedCategory,
  //       )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Category Filter */}
          {/* <div
            style={{
              overflow: 'auto',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
            className="mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() =>
                    setSelectedCategory(
                      category.slug === 'all' ? 'all' : category.variant,
                    )
                  }
                  className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                    (selectedCategory === 'all' && category.slug === 'all') ||
                    selectedCategory === category.variant
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-[#f5f5f5] text-[#666666] hover:bg-[#e5e5e5]'
                  }`}
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div> */}

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                id={article.id}
                category={article.category || '기타'}
                headline={article.title}
                summary={article.description || article.headlineSummary || ''}
                source={article.source || '출처 없음'}
                timestamp={formatRelativeTime(article.pubDate)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
