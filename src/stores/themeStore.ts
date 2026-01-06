import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// 초기 테마 감지 (SSR 안전)
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  try {
    const stored = localStorage.getItem('theme-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (
        parsed.state?.theme &&
        ['light', 'dark'].includes(parsed.state.theme)
      ) {
        return parsed.state.theme as Theme
      }
    }
  } catch (e) {
    // localStorage 접근 실패 시 무시
  }

  // 시스템 테마 감지
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => {
      const initialTheme = getInitialTheme()

      // 초기 상태에서 즉시 DOM 업데이트 (클라이언트 사이드 전용)
      if (typeof window !== 'undefined') {
        const root = document.documentElement
        if (initialTheme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }

      return {
        theme: initialTheme,
        setTheme: (theme: Theme) => {
          set({ theme })
          // DOM 업데이트
          if (typeof window !== 'undefined') {
            const root = document.documentElement
            if (theme === 'dark') {
              root.classList.add('dark')
            } else {
              root.classList.remove('dark')
            }
          }
        },
        toggleTheme: () => {
          const newTheme = get().theme === 'dark' ? 'light' : 'dark'
          get().setTheme(newTheme)
        },
      }
    },
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      // 초기화 후 DOM 동기화
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          const root = document.documentElement
          if (state.theme === 'dark') {
            root.classList.add('dark')
          } else {
            root.classList.remove('dark')
          }
        }
      },
    },
  ),
)
