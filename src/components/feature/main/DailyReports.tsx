import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Card } from '@/components/ui/card'
import { MapPin, User } from 'lucide-react'

// Mock data - newspaper style with multiple images
const MOCK_REPORTS = [
  {
    id: '1',
    date: '2026-01-21',
    title: '글로벌 기업들의 탄소중립 선언 가속화',
    summary:
      '주요 글로벌 기업들이 2030년까지 탄소중립을 달성하겠다는 목표를 잇따라 발표하고 있습니다. 애플, 마이크로소프트, 구글 등이 선두주자로 나서며 업계 전반에 변화의 바람이 불고 있습니다.',
    newsCount: 12,
    keyTopics: ['탄소중립', '재생에너지'],
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    ],
    author: 'ESG 뉴스팀',
    location: '서울',
  },
  {
    id: '2',
    date: '2026-01-20',
    title: '식품업계 플라스틱 제로 도전',
    summary:
      '대형 식품 기업들이 2025년까지 플라스틱 포장재를 100% 친환경 소재로 전환한다고 밝혔습니다. 이는 소비자들의 환경 의식 증가에 따른 것으로 분석됩니다.',
    newsCount: 8,
    keyTopics: ['친환경 패키징', '플라스틱 제로'],
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    ],
    author: '환경부 기자',
    location: '도쿄',
  },
  {
    id: '3',
    date: '2026-01-19',
    title: 'ESG 펀드 유입 역대 최고치',
    summary:
      '기관투자자들의 ESG 펀드 투자가 전년 대비 150% 증가하며 새로운 기록을 세웠습니다. 지속가능한 투자에 대한 관심이 그 어느 때보다 높아지고 있습니다.',
    newsCount: 15,
    keyTopics: ['ESG 투자', '지속가능 금융'],
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    ],
    author: '금융 전문기자',
    location: '뉴욕',
  },
  {
    id: '4',
    date: '2026-01-18',
    title: '재생에너지 투자 급증',
    summary:
      '태양광과 풍력 발전 설비에 대한 투자가 전년 대비 40% 증가했습니다. 각국 정부의 지원 정책과 기술 발전이 투자 확대를 이끌고 있습니다.',
    newsCount: 10,
    keyTopics: ['태양광', '풍력'],
    images: [
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    ],
    author: '에너지 리포터',
    location: '베를린',
  },
  {
    id: '5',
    date: '2026-01-17',
    title: '순환경제 모델 확산',
    summary:
      '제조업체들이 제품 수명 연장과 재활용을 핵심 전략으로 채택하고 있습니다. 선형 경제에서 순환 경제로의 전환이 가속화되고 있습니다.',
    newsCount: 9,
    keyTopics: ['순환경제', '재활용'],
    images: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
    ],
    author: '산업부 기자',
    location: '암스테르담',
  },
  {
    id: '6',
    date: '2026-01-16',
    title: '전기차 보급 가속화',
    summary:
      '전기차 판매가 전년 대비 80% 증가하며 교통 부문 탄소 배출이 크게 감소했습니다. 충전 인프라 확대와 배터리 기술 발전이 주효했습니다.',
    newsCount: 11,
    keyTopics: ['전기차', '그린 모빌리티'],
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    ],
    author: '모빌리티 전문가',
    location: '상하이',
  },
]

export const DailyReports = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="w-full  py-6 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
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
            {MOCK_REPORTS.map((report, index) => {
              // Calculate distance from center for progressive scaling
              const totalSlides = MOCK_REPORTS.length
              const distance = Math.abs(current - index)

              // Handle loop wrapping
              const wrappedDistance = Math.min(distance, totalSlides - distance)

              // Calculate scale based on distance
              const normalizedDistance = Math.min(wrappedDistance, 2) / 2
              const scale = 1.0 - normalizedDistance * 0.15
              const opacity = 1.0 - normalizedDistance * 0.3

              return (
                <CarouselItem
                  key={report.id}
                  className="pl-2 sm:pl-3 basis-full sm:basis-1/3 md:basis-1/4 lg:basis-1/5 overflow-visible"
                >
                  <div
                    className="transition-all duration-500 ease-out"
                    style={{
                      transform: `scale(${scale})`,
                      opacity: opacity,
                    }}
                  >
                    {/* Clean Modern Newspaper Card */}
                    <Card className="group cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 bg-card aspect-[3/4] w-full">
                      <div className="h-full flex flex-col">
                        {/* Main Image - Top 50% */}
                        <div className="relative h-1/2 overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={report.images[0]}
                            alt={report.title}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                              wrappedDistance === 0 ? '' : 'grayscale'
                            }`}
                          />
                          {/* Date Badge */}
                          <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded">
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {new Date(report.date).toLocaleDateString(
                                'ko-KR',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Content - Bottom 50% */}
                        <div className="h-1/2 p-4 flex flex-col">
                          {/* Location & Author */}
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {report.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {report.author}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-responsive-lg leading-tight mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {report.title}
                          </h3>

                          {/* Summary */}
                          <p className="text-responsive-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 flex-1 leading-relaxed">
                            {report.summary}
                          </p>

                          {/* Topics */}
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {report.keyTopics.map((topic, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
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
