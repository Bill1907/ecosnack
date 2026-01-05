import { Link } from '@tanstack/react-router'

export default function ArticleNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🤔</span>
      </div>
      <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-3">
        기사를 찾을 수 없습니다
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        요청하신 기사가 삭제되었거나 존재하지 않는 주소입니다.
        <br />
        다른 기사를 찾아보시는 건 어떨까요?
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-primary dark:hover:bg-gray-100 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
