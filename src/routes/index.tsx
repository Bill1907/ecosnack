// import { createFileRoute, Link } from '@tanstack/react-router'
// import { getArticles } from '@/lib/articles.api'
// import type { Article } from '@/db/schema'

// export const Route = createFileRoute('/')({
//   component: HomePage,
//   loader: async () => {
//     const articles = await getArticles()
//     return { articles }
//   },
// })

// function HomePage() {
//   const { articles } = Route.useLoaderData()

//   return (
//     <main className="min-h-screen bg-[#fdf6e3] py-8">
//       <div className="mx-auto max-w-6xl px-4">
//         {/* 신문 헤더 */}
//         <header className="mb-8 border-b-4 border-double border-neutral-800 pb-4 text-center">
//           <h1 className="font-serif text-5xl font-black tracking-tight text-neutral-900">
//             EcoSnack Daily
//           </h1>
//           <p className="mt-2 font-serif text-sm text-neutral-600">
//             환경 뉴스의 모든 것 |{' '}
//             {new Date().toLocaleDateString('ko-KR', {
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric',
//             })}
//           </p>
//         </header>

//         {articles.length === 0 ? (
//           <div className="py-20 text-center">
//             <p className="font-serif text-xl text-neutral-600">
//               아직 등록된 기사가 없습니다.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             {/* 헤드라인 기사 (첫 번째 기사) */}
//             {articles[0] && <HeadlineArticle article={articles[0]} />}

//             {/* 서브 헤드라인 (2-3번째 기사) */}
//             <div className="space-y-6 md:col-span-1">
//               {articles.slice(1, 3).map((article) => (
//                 <SubHeadlineArticle key={article.id} article={article} />
//               ))}
//             </div>

//             {/* 나머지 기사들 */}
//             <div className="border-t border-neutral-300 pt-6 md:col-span-3">
//               <h2 className="mb-4 font-serif text-xl font-bold text-neutral-800">
//                 More Stories
//               </h2>
//               <div className="grid gap-4 md:grid-cols-3">
//                 {articles.slice(3).map((article) => (
//                   <CompactArticle key={article.id} article={article} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   )
// }

// function HeadlineArticle({ article }: { article: Article }) {
//   return (
//     <article className="md:col-span-2">
//       <Link
//         to="/article/$id"
//         params={{ id: String(article.id) }}
//         className="group block"
//       >
//         <div className="border-b-2 border-neutral-800 pb-4">
//           {article.category && (
//             <span className="mb-2 inline-block bg-neutral-800 px-2 py-0.5 font-sans text-xs font-semibold tracking-wide text-white uppercase">
//               {article.category}
//             </span>
//           )}
//           <h2 className="font-serif text-3xl leading-tight font-bold text-neutral-900 group-hover:text-neutral-600 md:text-4xl">
//             {article.title}
//           </h2>
//           {article.headlineSummary && (
//             <p className="mt-3 font-serif text-lg leading-relaxed text-neutral-700">
//               {article.headlineSummary}
//             </p>
//           )}
//           <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
//             {article.source && (
//               <span className="font-medium">{article.source}</span>
//             )}
//             {article.pubDate && (
//               <time dateTime={article.pubDate.toISOString()}>
//                 {formatDate(article.pubDate)}
//               </time>
//             )}
//             {article.importanceScore && (
//               <ImportanceBadge score={article.importanceScore} />
//             )}
//           </div>
//         </div>
//       </Link>

//       {/* So What 섹션 */}
//       {article.soWhat && (
//         <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-4">
//           <h3 className="font-sans text-sm font-bold tracking-wide text-amber-800 uppercase">
//             So What?
//           </h3>
//           <p className="mt-1 font-serif text-neutral-700">
//             {article.soWhat.summary}
//           </p>
//         </div>
//       )}
//     </article>
//   )
// }

// function SubHeadlineArticle({ article }: { article: Article }) {
//   return (
//     <article className="border-b border-neutral-200 pb-4">
//       <Link
//         to="/article/$id"
//         params={{ id: String(article.id) }}
//         className="group block"
//       >
//         {article.category && (
//           <span className="mb-1 inline-block font-sans text-xs font-semibold tracking-wide text-amber-700 uppercase">
//             {article.category}
//           </span>
//         )}
//         <h3 className="font-serif text-xl leading-snug font-semibold text-neutral-900 group-hover:text-neutral-600">
//           {article.title}
//         </h3>
//         {article.description && (
//           <p className="mt-2 line-clamp-2 font-serif text-sm text-neutral-600">
//             {article.description}
//           </p>
//         )}
//         <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
//           {article.source && <span>{article.source}</span>}
//           {article.pubDate && (
//             <>
//               <span>·</span>
//               <time dateTime={article.pubDate.toISOString()}>
//                 {formatDate(article.pubDate)}
//               </time>
//             </>
//           )}
//         </div>
//       </Link>
//     </article>
//   )
// }

// function CompactArticle({ article }: { article: Article }) {
//   return (
//     <article className="border-l-2 border-neutral-200 pl-4">
//       <Link
//         to="/article/$id"
//         params={{ id: String(article.id) }}
//         className="group block"
//       >
//         <h4 className="font-serif text-base leading-snug font-medium text-neutral-800 group-hover:text-neutral-600">
//           {article.title}
//         </h4>
//         <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
//           {article.category && (
//             <span className="font-medium text-amber-700">
//               {article.category}
//             </span>
//           )}
//           {article.pubDate && (
//             <time dateTime={article.pubDate.toISOString()}>
//               {formatRelativeDate(article.pubDate)}
//             </time>
//           )}
//         </div>
//       </Link>
//     </article>
//   )
// }

// function ImportanceBadge({ score }: { score: number }) {
//   const level = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'
//   const colors = {
//     high: 'bg-red-100 text-red-800',
//     medium: 'bg-amber-100 text-amber-800',
//     low: 'bg-neutral-100 text-neutral-600',
//   }

//   return (
//     <span
//       className={`rounded px-1.5 py-0.5 text-xs font-medium ${colors[level]}`}
//     >
//       중요도 {score}
//     </span>
//   )
// }

// function formatDate(date: Date): string {
//   return date.toLocaleDateString('ko-KR', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   })
// }

// function formatRelativeDate(date: Date): string {
//   const now = new Date()
//   const diff = now.getTime() - date.getTime()
//   const hours = Math.floor(diff / (1000 * 60 * 60))
//   const days = Math.floor(hours / 24)

//   if (hours < 1) return '방금 전'
//   if (hours < 24) return `${hours}시간 전`
//   if (days < 7) return `${days}일 전`
//   return formatDate(date)
// }

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { NewsCard } from '../components/NewsCard'
import { Footer } from '../components/Footer'
import { categories } from '../data/mockData'
import { getArticles } from '../lib/articles.api'
import type { Article } from '../db/schema'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const articles = await getArticles()
    return { articles }
  },
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

function HomePage() {
  const { articles } = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredArticles: Article[] =
    selectedCategory === 'all'
      ? articles
      : articles.filter(
          (article) =>
            getCategoryVariant(article.category) === selectedCategory,
        )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Category Filter */}
          <div
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
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredArticles.map((article) => (
              <NewsCard
                key={article.id}
                id={article.id}
                category={article.category || '기타'}
                categoryVariant={getCategoryVariant(article.category)}
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
