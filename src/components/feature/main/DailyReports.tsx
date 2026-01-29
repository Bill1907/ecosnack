import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Card } from '@/components/ui/card'
import { DailyReportSkeleton } from './DailyReportSkeleton'
import { useQuery } from '@tanstack/react-query'
import { dailyReportsQueryOptions } from '@/lib/daily-reports.queries'
import { Link } from '@tanstack/react-router'
import { SentimentBadge } from '@/components/feature/dailyReport/SentimentBadge'

export const DailyReports = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { data, isLoading } = useQuery(dailyReportsQueryOptions({ limit: 10 }))
  const reports = data?.reports || []

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (!isLoading && reports.length === 0) {
    return null
  }

  return (
    <section className="w-full py-4 lg:py-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            데일리 리포트
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: 'center',
            loop: true,
            skipSnaps: false,
            slidesToScroll: 1,
            startIndex: 0,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full py-2 sm:py-4 "
        >
          <CarouselContent className="-ml-2 sm:-ml-3 ">
            {isLoading
              ? // Skeleton cards
                Array(3)
                  .fill(0)
                  .map((_, index) => {
                    const actualIndex = index
                    const totalSlides = 3
                    const distance = Math.abs(current - actualIndex)
                    const wrappedDistance = Math.min(
                      distance,
                      totalSlides - distance,
                    )
                    const normalizedDistance = Math.min(wrappedDistance, 2) / 2
                    const scale = 1.0 - normalizedDistance * 0.15
                    const opacity = 1.0 - normalizedDistance * 0.3

                    return (
                      <CarouselItem
                        key={`skeleton-${index}`}
                        className="pl-2 sm:pl-3 basis-full sm:basis-4/5 md:basis-3/5 lg:basis-2/5 overflow-visible"
                      >
                        <div
                          className="transition-all duration-500 ease-out"
                          style={{
                            transform: `scale(${scale})`,
                            opacity: opacity,
                          }}
                        >
                          <DailyReportSkeleton />
                        </div>
                      </CarouselItem>
                    )
                  })
              : // Real data
                reports.map((report, index) => {
                  const actualIndex = index
                  const totalSlides = reports.length
                  const distance = Math.abs(current - actualIndex)

                  // Handle loop wrapping
                  const wrappedDistance = Math.min(
                    distance,
                    totalSlides - distance,
                  )

                  // Calculate scale based on distance
                  const normalizedDistance = Math.min(wrappedDistance, 2) / 2
                  const scale = 1.0 - normalizedDistance * 0.15
                  const opacity = 1.0 - normalizedDistance * 0.3

                  return (
                    <CarouselItem
                      key={report.id}
                      className="pl-2 sm:pl-3 basis-full sm:basis-4/5 md:basis-3/5 lg:basis-2/5 overflow-visible"
                    >
                      <div
                        className="transition-all duration-500 ease-out"
                        style={{
                          transform: `scale(${scale})`,
                          opacity: opacity,
                        }}
                      >
                        {/* Newspaper-style Card */}
                        <Link
                          to="/daily-report/$date"
                          params={{ date: report.reportDate }}
                        >
                          <Card className="group cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card aspect-[3/4] w-full relative !rounded-none !border-none">
                            <div className="h-full flex flex-col p-5">
                              {/* Header - Date & Sentiment */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    report.reportDate,
                                  ).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </div>
                                <SentimentBadge
                                  sentiment={
                                    report.executiveSummary.sentiment.overall
                                  }
                                  description={
                                    report.executiveSummary.sentiment
                                      .description
                                  }
                                />
                              </div>

                              {/* Headline */}
                              <h3 className="font-extrabold text-xl sm:text-2xl leading-tight mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {report.executiveSummary.headline}
                              </h3>

                              {/* Colored Underline */}
                              <div
                                className={`h-1 w-20 mb-4 ${
                                  report.executiveSummary.sentiment.overall ===
                                  'positive'
                                    ? 'bg-emerald-600'
                                    : report.executiveSummary.sentiment
                                          .overall === 'negative'
                                      ? 'bg-red-600'
                                      : report.executiveSummary.sentiment
                                            .overall === 'mixed'
                                        ? 'bg-yellow-600'
                                        : 'bg-gray-600'
                                }`}
                              />

                              {/* Overview */}
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                {report.executiveSummary.overview}
                              </p>

                              {/* Highlights */}
                              <div className="space-y-3 mb-4 flex-1 overflow-hidden">
                                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                  주요 내용
                                </h4>
                                <ul className="space-y-2">
                                  {report.executiveSummary.highlights
                                    .slice(0, 3)
                                    .map((highlight, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-gray-600 dark:text-gray-400"
                                      >
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          • {highlight.title}
                                        </span>
                                        <p className="ml-3 mt-1 text-xs line-clamp-2">
                                          {highlight.description}
                                        </p>
                                      </li>
                                    ))}
                                </ul>
                              </div>

                              {/* Footer - Keywords & Article Count */}
                              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {report.topKeywords
                                    .slice(0, 4)
                                    .map((keyword, idx) => (
                                      <span
                                        key={idx}
                                        className={`text-xs px-2 py-1 font-semibold uppercase tracking-wide ${
                                          report.executiveSummary.sentiment
                                            .overall === 'positive'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                            : report.executiveSummary.sentiment
                                                  .overall === 'negative'
                                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                              : report.executiveSummary
                                                    .sentiment.overall ===
                                                  'mixed'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                  📰 {report.articleCount}개 기사 분석
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </div>
                    </CarouselItem>
                  )
                })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
