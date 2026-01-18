import { Link } from 'lucide-react'

export default function EmptyBookmarks() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl">📖</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        아직 북마크한 기사가 없습니다
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        관심있는 기사를 북마크하고
        <br />
        나중에 다시 읽어보세요!
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        기사 둘러보기
      </Link>
    </div>
  )
}
