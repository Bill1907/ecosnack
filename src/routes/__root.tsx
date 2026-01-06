import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { Navigation } from '../components/Navigation'
import { ScrollToTopButton } from '../components/ScrollToTopButton'
import { SITE_CONFIG, getDefaultMeta } from '../lib/seo'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/lib/theme'

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
              const theme = localStorage.getItem('theme');
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (theme === 'dark' || (!theme && systemPrefersDark)) {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          })();
        `,
      },
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7913636156841478',
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
  return (
    <>
      <Navigation />
      <div className="pt-16 sm-pt-14">
        <Outlet />
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html lang="ko" suppressHydrationWarning>
          <head>
            <HeadContent />
          </head>
          <body
            className="bg-background text-foreground"
            suppressHydrationWarning
          >
            {children}
            {typeof window !== 'undefined' && (
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
            )}
            <Scripts />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold dark:text-white">404</h1>
      <p className="text-gray-600 dark:text-gray-400">
        페이지를 찾을 수 없습니다
      </p>
      <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
