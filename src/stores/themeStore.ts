import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  isUserSelected: boolean // 사용자가 명시적으로 선택했는지 여부
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// 초기 테마 감지 (SSR 안전)
function getInitialTheme(): { theme: Theme; isUserSelected: boolean } {
  if (typeof window === 'undefined')
    return { theme: 'light', isUserSelected: false }

  try {
    const stored = localStorage.getItem('theme-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (
        parsed.state?.theme &&
        ['light', 'dark'].includes(parsed.state.theme)
      ) {
        return {
          theme: parsed.state.theme as Theme,
          // 이전 버전 호환성: 저장된 테마가 있으면 사용자가 선택한 것으로 간주
          isUserSelected: parsed.state.isUserSelected ?? true,
        }
      }
    }
  } catch (e) {
    // localStorage 접근 실패 시 무시
  }

  // 시스템 테마 감지 (사용자가 선택하지 않은 경우)
  return {
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    isUserSelected: false,
  }
}

// DOM 업데이트 헬퍼 함수
function updateDOM(theme: Theme) {
  if (typeof window !== 'undefined') {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => {
      const initial = getInitialTheme()

      // 시스템 테마 변경 감지 (클라이언트 사이드 전용)
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          const state = get()
          // 사용자가 명시적으로 선택하지 않은 경우에만 시스템 테마 따라가기
          if (!state.isUserSelected) {
            const newTheme = e.matches ? 'dark' : 'light'
            set({ theme: newTheme })
            // React가 className을 관리하므로 updateDOM 불필요
          }
        }

        mediaQuery.addEventListener('change', handleSystemThemeChange)
      }

      return {
        theme: initial.theme,
        isUserSelected: initial.isUserSelected,
        setTheme: (theme: Theme) => {
          set({ theme, isUserSelected: true }) // 사용자가 선택했음을 표시
          // 즉각적인 업데이트를 위해 DOM도 직접 업데이트 (React re-render 전)
          updateDOM(theme)
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
      // React가 className을 관리하므로 onRehydrateStorage에서 DOM 업데이트 불필요
    },
  ),
)
