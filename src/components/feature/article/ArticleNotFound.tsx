import { Link } from '@tanstack/react-router'

export default function ArticleNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🤔</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        기사를 찾을 수 없습니다
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        요청하신 기사가 삭제되었거나 존재하지 않는 주소입니다.
        <br />
        다른 기사를 찾아보시는 건 어떨까요?
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
