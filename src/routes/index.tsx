import {
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { CategoryFilter } from '../components/CategoryFilter'
import { Footer } from '../components/Footer'
import { NewsCard } from '../components/NewsCard'
import { CategorySchema } from '../db/schema'
import {
  getArticles,
  getArticlesByCategory,
  getCategories,
} from '../lib/articles.api'
import {
  SITE_CONFIG,
  getOrganizationJsonLd,
  getPageMeta,
  getWebsiteJsonLd,
} from '../lib/seo'
import type { Category } from '../db/schema'
import { NewsCardSkeleton } from '@/components/NewsCardSkeleton'
import { formatRelativeTime } from '@/lib/utils'

// 검색 파라미터 타입 정의
type SearchParams = {
  category?: Category
}

export const Route = createFileRoute('/')({
  component: HomePage,
  // 검색 파라미터 유효성 검사
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const validCategories = CategorySchema.options
    const category = search.category

    // 타입 가드를 사용한 안전한 검증
    if (
      typeof category === 'string' &&
      validCategories.includes(category as Category)
    ) {
      return { category: category as Category }
    }

    return { category: undefined }
  },
  head: () => {
    return {
      meta: getPageMeta({
        title: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        path: '/',
        keywords: ['경제', '금융', '비즈니스', '시장', '정책', '무역'],
      }),
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(getWebsiteJsonLd()),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(getOrganizationJsonLd()),
        },
      ],
    }
  },
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: async ({ deps }) => {
    const [articles, categories] = await Promise.all([
      deps.category
        ? getArticlesByCategory({ data: deps.category })
        : getArticles(),
      getCategories(),
    ])
    return { articles, categories }
  },
})

function HomePage() {
  const { articles, categories } = Route.useLoaderData()
  const navigate = useNavigate({ from: '/' })
  const { category: urlCategory } = Route.useSearch()
  const routerState = useRouterState()
  const isLoading = routerState.isLoading

  const selectedCategory = urlCategory || 'all'

  // 카테고리 변경 핸들러 - URL 파라미터 업데이트
  const handleCategoryChange = (category: Category | 'all') => {
    navigate({
      search: {
        category: category === 'all' ? undefined : category,
      },
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <NewsCardSkeleton key={`skeleton-${index}`} />
                ))
              : articles.map((article) => (
                  <NewsCard
                    key={article.id}
                    id={article.id}
                    category={article.category || '기타'}
                    headline={article.title}
                    summary={
                      article.description || article.headlineSummary || ''
                    }
                    source={article.source || ''}
                    timestamp={formatRelativeTime(article.pubDate)}
                    imageUrl={article.imageUrl || ''}
                  />
                ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
