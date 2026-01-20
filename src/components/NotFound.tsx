import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">페이지를 찾을 수 없습니다</p>
      <Link to="/" className="text-primary hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
