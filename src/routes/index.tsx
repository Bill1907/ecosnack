import { createFileRoute } from '@tanstack/react-router'
import { Sparkles, TrendingUp, Zap, Clock, Target } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-6">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-100/20 rounded-full blur-3xl" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* 로고 */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/30">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Ecosnack
          </h1>
        </div>

        {/* 슬로건 */}
        <p className="text-xl text-amber-600 font-medium">
          오늘의 경제, 한 입에 🥜
        </p>

        {/* 상태 뱃지 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>서비스 준비중</span>
        </div>

        {/* 메인 메시지 */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            경제 뉴스, 이제
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              "그래서 나한테 뭔 영향?"
            </span>
            <br />
            까지 알려드립니다
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            매일 중요한 경제 뉴스를 AI가 쉽게 풀어서 설명하고,
            <br className="hidden sm:block" />
            내 투자와 재정에 미치는 영향까지 분석해드려요.
          </p>
        </div>

        {/* 특징 카드 */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
          <div className="flex flex-col items-center gap-2 p-4 bg-white/60 rounded-2xl border border-amber-100">
            <Zap className="w-6 h-6 text-amber-500" />
            <span className="text-sm text-gray-700 font-medium">쉬운 설명</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-white/60 rounded-2xl border border-amber-100">
            <Target className="w-6 h-6 text-orange-500" />
            <span className="text-sm text-gray-700 font-medium">내 영향 분석</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-white/60 rounded-2xl border border-amber-100">
            <Clock className="w-6 h-6 text-amber-600" />
            <span className="text-sm text-gray-700 font-medium">5분 요약</span>
          </div>
        </div>

        {/* 푸터 */}
        <div className="pt-8 text-sm text-gray-400">
          © 2025 Ecosnack. All rights reserved.
        </div>
      </div>
    </div>
  )
}
