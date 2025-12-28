import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// .dev.vars 파일 로드 (Cloudflare Workers 로컬 개발용)
function loadDevVars(): Record<string, string> {
  const devVarsPath = resolve(process.cwd(), '.dev.vars')
  if (existsSync(devVarsPath)) {
    const content = readFileSync(devVarsPath, 'utf-8')
    const vars: Record<string, string> = {}
    content.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex > 0) {
          const key = trimmed.slice(0, eqIndex).trim()
          const value = trimmed.slice(eqIndex + 1).trim()
          vars[key] = value
        }
      }
    })
    return vars
  }
  return {}
}

const devVars = loadDevVars()

const config = defineConfig({
  plugins: [
    devtools(),
    cloudflare({
      viteEnvironment: { name: 'ssr' },
      config: (config) => {
        // .dev.vars 환경 변수를 vars로 병합 (기존 vars 유지)
        return {
          vars: { ...config.vars, ...devVars },
        }
      },
      // Pass the env to the cloudflare context
      persistState: true,
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  environments: {
    ssr: {
      define: {
        'process.env.DATABASE_URL': JSON.stringify(devVars.DATABASE_URL || ''),
      },
    },
  },
})

export default config
