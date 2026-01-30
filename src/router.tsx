import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'

import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 30, // 30분
        throwOnError: true, // 에러를 ErrorComponent로 전파
        retry: 1, // 실패 시 1번만 재시도
      },
      mutations: {
        throwOnError: true, // mutation 에러도 ErrorComponent로 전파
      },
    },
  })

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      context: { queryClient },
    }),
    queryClient
  )

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
