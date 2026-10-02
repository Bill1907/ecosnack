import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  // 어제 날짜 계산 (YYYY-MM-DD 형식, KST 기준)
  const getYesterdayDate = () => {
    const now = new Date()
    // KST(UTC+9) 기준으로 현재 날짜 계산 (SSR/클라이언트 타임존 차이 방지)
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    kstNow.setUTCDate(kstNow.getUTCDate() - 1)
    return kstNow.toISOString().split('T')[0]
  }

  return (
    <section className="relative overflow-hidden bg-background">
      {/* 배경 패턴/장식 - 더 풍부한 색감과 깊이감 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-float-delayed" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/40 dark:bg-indigo-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-float" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-24 sm:pb-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* 텍스트 영역 */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI 기반 경제 뉴스 분석
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-[1.15] tracking-tight">
              오늘의 경제, <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 break-keep">
                한 입에 간편하게
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground font-normal max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed animate-fade-in-up delay-100 opacity-0 fill-mode-forwards break-keep">
              복잡한 경제 뉴스를 AI가 핵심만 쏙 뽑아 분석해드려요.
              <br />
              글로벌 시장 동향부터 나에게 미치는 영향까지, 매일 아침 확인하세요.
            </p>

            {/* CTA 버튼 */}
            <div className="flex gap-3 sm:gap-4 justify-center lg:justify-start items-center animate-fade-in-up delay-200 opacity-0 fill-mode-forwards w-full sm:w-auto">
              <Link to="/news" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 px-6 py-4 sm:px-8 sm:py-6 h-auto text-base sm:text-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all rounded-xl"
                >
                  뉴스 보러가기
                </Button>
              </Link>
              <Link
                to="/daily-report/$date"
                params={{ date: getYesterdayDate() }}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 px-6 py-4 sm:px-8 sm:py-6 h-auto text-base sm:text-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-xl"
                >
                  데일리 리포트
                </Button>
              </Link>
            </div>
          </div>

          {/* 비주얼/카드 영역 */}
          <div className="relative mt-8 lg:mt-0 px-4 sm:px-0 flex justify-center lg:justify-end animate-fade-in-up delay-300 opacity-0 fill-mode-forwards">
            <div className="relative w-full max-w-[500px] aspect-4/3">
              {/* 메인 카드 (Glassmorphism) */}
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 p-6 sm:p-8 animate-float z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <svg
                      className="w-6 h-6 text-white"
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
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-0.5">
                      Today's Summary
                    </p>
                    <p className="text-xl font-bold font-display text-foreground">
                      Daily Economic Report
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="h-2 w-1/4 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-lg" />
                    <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  </div>
                  {/* <div className="space-y-2 pt-2">
                    <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-lg" />
                    <div className="h-4 w-4/5 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  </div> */}
                </div>

                {/* 하단 태그들 */}
                {/* <div className="absolute bottom-8 left-8 right-8 flex gap-2">
                  <div className="h-8 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30" />
                  <div className="h-8 w-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30" />
                </div> */}
              </div>

              {/* 장식용 플로팅 카드 1 (왼쪽) */}
              <div className="absolute -left-4 sm:-left-12 bottom-6 w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-4 animate-float-delayed z-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">핵심 분석 완료</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-green-500 rounded-full" />
                </div>
              </div>

              {/* 장식용 플로팅 카드 2 (오른쪽 위) */}
              <div className="absolute -right-4 sm:-right-8 top-12 w-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 p-4 animate-float-delayed z-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">
                    LIVE NEWS
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
