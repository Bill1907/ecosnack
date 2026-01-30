import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { MenuButton } from './MenuButton'
import { useThemeStore } from '@/stores/themeStore'

export function Navigation() {
  const router = useRouter()
  const state = useRouterState()
  const isArticleDetail =
    state.location.pathname.startsWith('/article/') ||
    state.location.pathname.startsWith('/daily-report/')
  const { theme } = useThemeStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" flex items-center justify-between">
          {/* 백 버튼 (디테일 페이지에서만 표시) */}
          <div className="flex-1 flex items-center gap-2">
            {isArticleDetail && (
              <div
                onClick={() => router.history.back()}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  뒤로
                </span>
              </div>
            )}
          </div>

          {/* 로고 */}
          <Link to="/" className="flex items-center justify-center">
            <img
              src={
                theme === 'dark'
                  ? 'https://cdn.heyvona.com/logo_black.png'
                  : 'https://cdn.heyvona.com/logo.png'
              }
              alt="Logo"
              className="object-cover w-44 h-16"
              fetchPriority="high"
              decoding="async"
              width={144}
              height={64}
            />
          </Link>

          {/* 사이드바 버튼 */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <MenuButton />
          </div>
        </div>
      </div>
    </header>
  )
}
