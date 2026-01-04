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
    nitro({ preset: 'bun' }),
    viteReact(),
  ],
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
