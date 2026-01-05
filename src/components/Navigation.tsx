import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/tanstack-react-start'
import { ArrowLeft } from 'lucide-react'
import { LazyImage } from './LazyImage'

export function Navigation() {
  const router = useRouter()
  const state = useRouterState()
  const isArticleDetail = state.location.pathname.startsWith('/article/')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#e5e5e5] bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" flex items-center justify-between">
          {/* 백 버튼 (디테일 페이지에서만 표시) */}
          <div className="flex-1">
            {isArticleDetail && (
              <div
                onClick={() => router.history.back()}
                className="inline-flex items-center gap-2 text-[#666666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
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
              src="https://cdn.heyvona.com/logo.png"
              alt="Logo"
              className="object-cover w-44 h-16"
              fetchPriority="high"
              decoding="async"
              width={144}
              height={64}
            />
          </Link>

          {/* 로그인/사용자 버튼 */}
          <div className="flex-1 flex justify-end">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-lg hover:bg-[#333] transition-colors">
                  로그인
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}
