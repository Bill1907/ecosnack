import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import React from 'react'

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
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { PostHogProvider } from 'posthog-js/react'
import { useThemeStore } from '../stores/themeStore'
import { Footer } from '@/components/Footer'
import { usePostHogIdentify } from '@/hooks/usePostHogIdentify'

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
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1946825662622426',
        async: true,
        crossOrigin: 'anonymous',
      },
    ],
  }),

  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  // PostHog 사용자 식별
  usePostHogIdentify()

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
    <ClerkProvider>
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
          </head>
          <body
            className="bg-background text-foreground"
            suppressHydrationWarning
          >
            {children}
            {typeof window !== 'undefined' && (
              <React.Suspense fallback={null}>
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
              </React.Suspense>
            )}
            <Scripts />
          </body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  )
}

function NotFound() {
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
