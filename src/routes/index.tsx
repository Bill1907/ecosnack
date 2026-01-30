import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CategoryFilter } from '../components/CategoryFilter'
import { SearchFilters } from '../components/SearchFilters'
import { NewsCard } from '../components/NewsCard'
import { CategorySchema, RegionSchema } from '../db/schema'
import {
  articlesInfiniteQueryOptions,
  categoriesQueryOptions,
} from '../lib/articles.queries'
import {
  SITE_CONFIG,
  getOrganizationJsonLd,
  getPageMeta,
  getWebsiteJsonLd,
} from '../lib/seo'
import type { Category, Region } from '../db/schema'
import { NewsCardSkeleton } from '@/components/NewsCardSkeleton'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { DailyReports } from '@/components/feature/main/DailyReports'

type SearchParams = {
  category?: Category
  query?: string
  region?: Region
}

export const Route = createFileRoute('/')({
  component: HomePage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const validCategories = CategorySchema.options
    const validRegions = RegionSchema.options
    const category = search.category
    const query = search.query
    const region = search.region

    return {
      category:
        typeof category === 'string' &&
        validCategories.includes(category as Category)
          ? (category as Category)
          : undefined,
      query: typeof query === 'string' && query.trim() ? query : undefined,
      region:
        typeof region === 'string' && validRegions.includes(region as Region)
          ? (region as Region)
          : undefined,
    }
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
  loaderDeps: ({ search }) => ({
    category: search.category,
    query: search.query,
    region: search.region,
  }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.prefetchInfiniteQuery(
        articlesInfiniteQueryOptions({
          category: deps.category,
          query: deps.query,
          region: deps.region,
        }),
      ),
      context.queryClient.ensureQueryData(categoriesQueryOptions),
    ])
  },
})

function HomePage() {
  const navigate = useNavigate({ from: '/' })
  const {
    category: urlCategory,
    query: urlQuery,
    region: urlRegion,
  } = Route.useSearch()
  const selectedCategory = urlCategory || 'all'
  const selectedRegion = urlRegion || 'all'
  const searchQuery = urlQuery || ''

  // React Query 사용
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      articlesInfiniteQueryOptions({
        category: urlCategory,
        query: urlQuery,
        region: urlRegion,
      }),
    )

  const { data: categories } = useSuspenseQuery(categoriesQueryOptions)

  // 모든 페이지의 articles 평탄화
  const articles = data.pages.flatMap((page) => page.articles)

  // 기존 훅 재사용
  const observerRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage ?? false,
    isFetchingNextPage,
  )

  const handleCategoryChange = (category: Category | 'all') => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: category === 'all' ? undefined : category,
      }),
    })
  }

  const handleSearchChange = (query: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        query: query.trim() || undefined,
      }),
    })
  }

  const handleRegionChange = (region: Region | 'all') => {
    navigate({
      search: (prev) => ({
        ...prev,
        region: region === 'all' ? undefined : region,
      }),
    })
  }

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        {/* Search & Region Filters */}
        <SearchFilters
          searchQuery={searchQuery}
          selectedRegion={selectedRegion}
          onSearchChange={handleSearchChange}
          onRegionChange={handleRegionChange}
        />

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <DailyReports />
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}

          {/* 추가 로딩 스켈레톤 */}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <NewsCardSkeleton key={`loading-more-${index}`} />
            ))}
        </div>

        {/* Intersection Observer 트리거 */}
        {hasNextPage && <div ref={observerRef} className="h-10" />}
      </div>
    </main>
  )
}
