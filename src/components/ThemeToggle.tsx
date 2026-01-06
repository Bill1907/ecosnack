import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-lg bg-secondary/80 hover:bg-secondary flex items-center justify-center group"
      aria-label={`현재 ${theme === 'dark' ? '다크' : '라이트'} 모드, 클릭하여 ${theme === 'dark' ? '라이트' : '다크'} 모드로 전환`}
      title={theme === 'dark' ? '다크 모드' : '라이트 모드'}
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'light'
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  )
}
