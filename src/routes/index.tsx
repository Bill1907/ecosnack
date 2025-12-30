import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { NewsCard } from '../components/NewsCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { Footer } from '../components/Footer'
import {
  getArticles,
  getCategories,
  getArticlesByCategory,
} from '../lib/articles.api'
import type { Article, Category } from '../db/schema'
import { formatRelativeTime } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const [articles, categories] = await Promise.all([
      getArticles(),
      getCategories(),
    ])
    return { articles, categories }
  },
})

function HomePage() {
  const { articles: initialArticles, categories } = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    'all',
  )
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true)
      try {
        if (selectedCategory === 'all') {
          const allArticles = await getArticles()
          setArticles(allArticles)
        } else {
          const categoryArticles = await getArticlesByCategory({
            data: selectedCategory,
          })
          setArticles(categoryArticles)
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* 로딩 스켈레톤으로 수정 예정 */}
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500 h-[calc(100vh-200px)] flex items-center justify-center">
                로딩 중...
              </div>
            ) : (
              articles.map((article) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  category={article.category || '기타'}
                  headline={article.title}
                  summary={article.description || article.headlineSummary || ''}
                  source={article.source || '출처 없음'}
                  timestamp={formatRelativeTime(article.pubDate)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
