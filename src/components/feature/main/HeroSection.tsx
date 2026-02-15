import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 dark:from-slate-800 dark:via-slate-900 dark:to-gray-950" />

      {/* 배경 패턴/장식 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-24 pb-32 sm:pb-40">
        <div className="text-center">
          {/* 메인 슬로건 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-snug">
            오늘의 경제, 한 입에.
          </h1>

          {/* 서브 카피 */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto mb-6 sm:mb-10 break-keep leading-relaxed">
            복잡한 경제 뉴스를 AI가 쉽게 분석해드려요.
            <br />
            매일 글로벌 시장 동향부터 나에게 미치는 영향까지.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-white text-slate-800 hover:bg-slate-100 px-8 py-3 h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              >
                뉴스 보러가기
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="ghost"
                size="lg"
                className="text-white border-white/30 border hover:bg-white/10 px-8 py-3 h-12 text-base font-normal"
              >
                데일리 리포트 보기
              </Button>
            </Link>
          </div>
        </div>

        {/* 떠있는 카드 미리보기 */}
        <div className="mt-10 sm:mt-20 flex justify-center">
          <div className="relative w-full max-w-4xl">
            {/* 메인 카드 */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-6 mx-4 sm:mx-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">오늘의 요약</p>
                  <p className="font-medium font-display text-foreground">
                    Daily Economic Report
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded-full w-full" />
                <div className="h-3 bg-muted rounded-full w-5/6" />
                <div className="h-3 bg-muted rounded-full w-4/6" />
              </div>
            </div>

            {/* 왼쪽 플로팅 카드 */}
            <div className="absolute left-2 sm:left-0 -bottom-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:-translate-x-1/2 bg-white dark:bg-card rounded-xl shadow-xl p-3 sm:p-4 w-32 sm:w-44">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-slate-600 dark:text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">AI 요약</span>
              </div>
              <p className="text-sm font-normal text-foreground">
                핵심만 빠르게
              </p>
            </div>

            {/* 오른쪽 플로팅 카드 */}
            <div className="absolute right-2 sm:right-0 -bottom-6 sm:bottom-auto sm:top-1/3 sm:translate-x-1/2 bg-white dark:bg-card rounded-xl shadow-xl p-3 sm:p-4 w-32 sm:w-44">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-slate-600 dark:text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-xs text-muted-foreground break-keep">
                  매일 업데이트
                </div>
              </div>
              <p className="text-sm font-normal text-foreground">글로벌 뉴스</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 곡선 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* 특징 섹션 - 하단 (임시 주석)
      <div className="relative z-10 bg-background -mt-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">매일</h3>
              <p className="text-muted-foreground">글로벌 뉴스 분석</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI 요약</h3>
              <p className="text-muted-foreground">핵심만 빠르게</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">내 영향</h3>
              <p className="text-muted-foreground">나한테 뭔 영향인지까지</p>
            </div>
          </div>
        </div>
      </div>
      */}
    </section>
  )
}
