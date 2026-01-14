import { SignInButton } from '@clerk/tanstack-react-start'

interface LoginRequiredProps {
  title?: string
  description?: string
  icon?: string
  buttonText?: string
  minHeight?: string
}

export function LoginRequired({
  title = '로그인이 필요합니다',
  description = '기사의 상세 내용을 보려면 로그인해 주세요.\n무료로 가입하고 모든 콘텐츠를 확인하세요!',
  icon = '🔒',
  buttonText = '로그인하기',
  minHeight = 'min-h-[60vh]',
}: LoginRequiredProps) {
  return (
    <div
      className={`${minHeight} flex flex-col items-center justify-center p-4 text-center`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">{icon}</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground mb-8 max-w-md whitespace-pre-line">
        {description}
      </p>
      <SignInButton mode="modal">
        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          {buttonText}
        </button>
      </SignInButton>
    </div>
  )
}
