import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
  Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { Navigation } from '../components/Navigation'
import { ScrollToTopButton } from '../components/ScrollToTopButton'
import { getDefaultMeta, SITE_CONFIG } from '../lib/seo'

export const Route = createRootRoute({
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
  }),

  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <>
      <Navigation />
      <div className="pt-18 sm:pt-16">
        <Outlet />
      </div>
      <ScrollToTopButton />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
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
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">페이지를 찾을 수 없습니다</p>
      <Link to="/" className="text-blue-600 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
