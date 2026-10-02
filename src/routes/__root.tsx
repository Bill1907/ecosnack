import type { QueryClient } from '@tanstack/react-query'
import {
  ClientOnly,
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import React, { Suspense } from 'react'

const TanStackDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-devtools').then((res) => ({
          default: res.TanStackDevtools,
        })),
      )

const TanStackRouterDevtoolsPanel =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtoolsPanel,
        })),
      )

import appCss from '../styles.css?url'
import { Navigation } from '../components/Navigation'
import { Sidebar } from '../components/Sidebar'
import { ScrollToTopButton } from '../components/ScrollToTopButton'
import { SITE_CONFIG, getDefaultMeta } from '../lib/seo'
import { PostHogProvider } from 'posthog-js/react'
import { useThemeStore } from '../stores/themeStore'
import { Footer } from '@/components/Footer'
import { ErrorComponent } from '@/components/ErrorComponent'
import { NotFound } from '@/components/NotFound'

const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1946825662622426'

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
} as const

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      ...getDefaultMeta(),
      {
        title: SITE_CONFIG.title,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'canonical',
        href: SITE_CONFIG.url,
      },
    ],
    scripts: [
      {
        children: `
          (function() {
            try {
              const stored = localStorage.getItem('theme-storage');
              const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              let isDark = systemDark;

              if (stored) {
                const data = JSON.parse(stored);
                if (data?.state?.theme) {
                  // isUserSelected가 명시적으로 false가 아니면 저장된 테마 사용
                  isDark = data.state.isUserSelected === false 
                    ? systemDark 
                    : data.state.theme === 'dark';
                }
              }

              document.documentElement.classList.toggle('dark', isDark);
            } catch (e) {
              // 에러 발생 시 시스템 테마 사용
              document.documentElement.classList.toggle(
                'dark', 
                window.matchMedia('(prefers-color-scheme: dark)').matches
              );
            }
          })();
        `,
      },
      // AdSense 스크립트는 여기(head().scripts)에 두지 않는다.
      // TanStack Router 의 <Script> 는 클라이언트에서 src 를 뺀 빈 <script async> 를 렌더하는데,
      // React 가 이를 서버 HTML 의 다음 <script>(ld+json)와 짝지어 버려 페이지마다 #418 이 났다.
      // 대신 RootDocument 에서 React 19 의 async 스크립트(리소스로 호이스팅)로 렌더한다.
    ],
  }),

  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
})

function RootLayout() {
  return (
    <>
      <Sidebar />
      <Navigation />
      <main className="pt-16 sm-pt-14">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={posthogOptions}
    >
      <html
        lang="ko"
        className={theme === 'dark' ? 'dark' : ''}
        suppressHydrationWarning
      >
        <head>
          <HeadContent />
          {/* React 19 가 async+src 스크립트를 리소스로 다뤄 서버·클라이언트 모두 하이드레이션 대상에서 제외됨 */}
          <script async src={ADSENSE_SRC} crossOrigin="anonymous" />
        </head>
        <body
          className="bg-background text-foreground"
          suppressHydrationWarning
        >
          {children}
          {/* 서버엔 없고 클라이언트에만 있는 노드는 하이드레이션 불일치(#418)를 낸다.
              개발 빌드에서만, 하이드레이션이 끝난 뒤 렌더한다. */}
          {import.meta.env.DEV && (
            <ClientOnly>
              <Suspense fallback={null}>
                <TanStackDevtools
                  config={{
                    position: 'bottom-right',
                  }}
                  plugins={[
                    {
                      name: 'Tanstack Router',
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                  ]}
                />
              </Suspense>
            </ClientOnly>
          )}
          <Scripts />
        </body>
      </html>
    </PostHogProvider>
  )
}
