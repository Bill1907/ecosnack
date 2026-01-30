import { SignInButton } from '@clerk/tanstack-react-start'

/**
 * 비로그인 사용자에게 표시되는 로그인 유도 오버레이
 * 블러 처리된 플레이스홀더와 로그인 프롬프트를 표시
 */
export function LoginRequiredOverlay() {
  return (
    <div className="relative mb-8">
      {/* Blurred placeholder content */}
      <div className="blur-md select-none pointer-events-none space-y-4">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="space-y-3">
          <div className="h-32 bg-muted/50 rounded-lg" />
          <div className="h-32 bg-muted/50 rounded-lg" />
          <div className="h-32 bg-muted/50 rounded-lg" />
        </div>
        <div className="h-48 bg-muted/50 rounded-2xl" />
        <div className="h-24 bg-muted/50 rounded-lg" />
      </div>

      {/* Overlay with login prompt */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background/95 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-3xl">🔐</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            더 많은 분석 내용
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            영향 분석, 배경 정보 등 심층 콘텐츠는
            <br />
            로그인 후 확인하실 수 있습니다
          </p>
          <SignInButton mode="modal">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              로그인
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  )
}
