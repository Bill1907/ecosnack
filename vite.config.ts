import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  build: {
    // 소스맵 생성 안 함: 'hidden' 은 .map 파일을 public/assets 에 그대로 두어 공개 서빙됨
    // (소스맵 업로드 대상이 없으므로 생성 자체를 끈다)
    sourcemap: false,
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
