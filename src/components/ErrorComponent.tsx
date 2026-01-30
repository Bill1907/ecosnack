import { Link, ErrorComponentProps } from '@tanstack/react-router'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const posthog = usePostHog()
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    // 프로덕션 환경에서만 PostHog에 에러 로깅
    if (!isDevelopment && posthog) {
      posthog.capture('error_boundary_triggered', {
        error_message: error.message,
        error_name: error.name,
        error_stack: error.stack,
        timestamp: new Date().toISOString(),
      })
    }
  }, [error, posthog, isDevelopment])

  return (
    <div className="flex min-h-[50vh] h-[100vh] flex-col items-center justify-center gap-4 px-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-6xl font-bold text-destructive">⚠️</h1>
        <h2 className="text-3xl font-bold text-foreground">
          문제가 발생했습니다
        </h2>
      </div>

      <div className="max-w-md text-center">
        <p className="text-muted-foreground">
          {isDevelopment
            ? `에러: ${error.message}`
            : '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
        </p>
        {isDevelopment && error.stack && (
          <pre className="mt-4 max-h-64 max-w-[80vw] overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
            {error.stack}
          </pre>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
        >
          다시 시도
        </button>
        <Link
          to="/"
          className="rounded-lg border border-border bg-background px-6 py-2 text-foreground transition-colors hover:bg-accent cursor-pointer"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
