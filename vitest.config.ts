import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

// 단위 테스트 전용 설정
// vite.config.ts 의 @cloudflare/vite-plugin 은 vitest 실행 시 워커 러너를 띄우다
// 'module is not defined' 로 시작 단계에서 실패하므로, 테스트에는 경로 별칭만 적용한다
export default defineConfig({
  plugins: [viteTsConfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
