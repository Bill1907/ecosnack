import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      preset: 'bun',
      routeRules: {
        '/assets/**': {
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
      },
    }),
    viteReact(),
  ],
  build: {
    sourcemap: 'hidden', // 소스맵 생성 (프로덕션에서 숨김)
  },
  optimizeDeps: {
    include: [
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/with-selector',
      '@clerk/tanstack-react-start',
      'cookie',
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  ssr: {
    noExternal: ['use-sync-external-store', '@clerk/tanstack-react-start'],
  },
})
