import { Link, useRouterState } from '@tanstack/react-router'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/tanstack-react-start'
import { dark } from '@clerk/themes'
import { X, Bookmark, ChevronRight } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useThemeStore } from '@/stores/themeStore'
import { ThemeToggle } from './ThemeToggle'
import { useEffect } from 'react'

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore()
  const { theme } = useThemeStore()
  const state = useRouterState()
  const currentPath = state.location.pathname

  // ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isSidebarOpen, closeSidebar])

  // 사이드바 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  return (
    <>
      {/* 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed right-0 top-0 h-full w-64 bg-background border-l border-border z-70
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* 헤더 */}
        <div className="p-4 !pl-0 border-b border-border flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={closeSidebar}
          >
            <img
              src={
                theme === 'dark'
                  ? 'https://cdn.heyvona.com/logo_black.png'
                  : 'https://cdn.heyvona.com/logo.png'
              }
              alt="Ecosnack"
              className="h-8 w-30 object-cover"
            />
          </Link>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer"
            aria-label="사이드바 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 태그라인 */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm text-muted-foreground">
            오늘의 경제, 한 입에 🥜
          </p>
        </div>

        {/* 북마크 섹션 */}
        <nav className="flex-1 overflow-y-auto p-4">
          <SignedIn>
            <div className="space-y-1">
              <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                북마크
              </h3>
              <Link
                to="/bookmarks"
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-full transition-colors text-sm font-medium
                  ${
                    currentPath === '/bookmarks'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }
                `}
              >
                <Bookmark className="w-5 h-5 shrink-0" />
                <span>저장한 기사</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
            </div>
          </SignedIn>
        </nav>

        {/* 하단 사용자 영역 */}
        <div className="p-4 border-t border-border space-y-3">
          {/* 다크모드 토글 */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg">
            <span className="text-sm text-foreground">테마</span>
            <ThemeToggle />
          </div>

          {/* 로그인/프로필 */}
          <SignedIn>
            <div className="flex items-center justify-start px-3 py-2">
              <UserButton
                showName
                appearance={{
                  baseTheme: theme === 'dark' ? dark : undefined,
                  elements: {
                    // 아바타
                    avatarBox: 'w-9 h-9',

                    // 전체 버튼 박스 - flex-row-reverse로 순서 변경
                    userButtonBox: 'flex flex-row-reverse items-center gap-2',

                    // 사용자 이름 (버튼 옆)
                    userButtonOuterIdentifier:
                      'text-sm font-medium text-foreground',
                  },
                }}
              />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                로그인
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </aside>
    </>
  )
}
